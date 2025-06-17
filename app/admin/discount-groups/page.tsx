'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DiscountGroupForm } from '@/components/admin/discount-group-form';
import { invalidateDiscountGroupsCache } from '@/utils/discount-enhanced';

interface DiscountGroup {
    id: string;
    name: string;
    description: string;
    discount_percentage: number;
    created_at: string;
    updated_at: string;
}

interface CreateDiscountGroupInput {
    name: string;
    description: string;
    discount_percentage: number;
}

export default function AdminDiscountGroupsPage() {
    const [discountGroups, setDiscountGroups] = useState<DiscountGroup[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<DiscountGroup | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const fetchDiscountGroups = async () => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('discount_groups')
            .select('*')
            .order('name');
        
        if (error) {
            console.error('Error fetching discount groups:', error);
            return;
        }
        setDiscountGroups(data || []);
    };

    useEffect(() => {
        fetchDiscountGroups();
    }, []);

    const handleEdit = (group: DiscountGroup) => {
        setSelectedGroup(group);
        setIsEditModalOpen(true);
    };

    const handleDelete = (group: DiscountGroup) => {
        setSelectedGroup(group);
        setIsDeleteDialogOpen(true);
    };

    const handleUpdateGroup = async (data: CreateDiscountGroupInput) => {
        setIsLoading(true);
        const supabase = createClient();

        try {
            if (selectedGroup) {
                const updateData = {
                    name: data.name,
                    description: data.description,
                    discount_percentage: data.discount_percentage,
                    updated_at: new Date().toISOString()
                };
                
                const { error } = await supabase
                    .from('discount_groups')
                    .update(updateData)
                    .eq('id', selectedGroup.id);

                if (error) {
                    console.error('Error updating discount group:', error.message);
                    alert(`Error updating discount group: ${error.message}`);
                    return;
                }
                
                invalidateDiscountGroupsCache();
                await fetchDiscountGroups();
                setIsEditModalOpen(false);
                setSelectedGroup(null);
                
            } else {
                const { error } = await supabase
                    .from('discount_groups')
                    .insert({
                        name: data.name,
                        description: data.description,
                        discount_percentage: data.discount_percentage
                    });

                if (error) {
                    console.error('Error creating discount group:', error.message);
                    alert(`Error creating discount group: ${error.message}`);
                    return;
                }
                
                invalidateDiscountGroupsCache();
                await fetchDiscountGroups();
                setIsAddModalOpen(false);
            }
        } catch (error) {
            console.error('Unexpected error:', error);
            alert('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteGroup = async () => {
        if (!selectedGroup) return;
        setIsLoading(true);
        const supabase = createClient();
        
        const { error } = await supabase
            .from('discount_groups')
            .delete()
            .eq('id', selectedGroup.id);
        
        if (error) {
            console.error('Error deleting discount group:', error);
            alert(`Error deleting discount group: ${error.message}`);
        } else {
            await fetchDiscountGroups();
            setIsDeleteDialogOpen(false);
        }
        setIsLoading(false);
    };

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Rabattgruppen verwalten</h1>
                <Button onClick={() => setIsAddModalOpen(true)}>
                    Neue Rabattgruppe hinzufügen
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {discountGroups.map((group) => (
                    <div key={group.id} className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-2">{group.name}</h2>
                        <p className="text-gray-600 mb-4">{group.description}</p>
                        <div className="mb-4">
                            <span className="text-lg font-bold text-green-600">
                                {group.discount_percentage}% Rabatt
                            </span>
                        </div>
                        <div className="text-xs text-gray-500 mb-4">
                            Erstellt: {new Date(group.created_at).toLocaleDateString('de-DE')}
                            {group.updated_at !== group.created_at && (
                                <div>
                                    Geändert: {new Date(group.updated_at).toLocaleDateString('de-DE')}
                                </div>
                            )}
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button onClick={() => handleEdit(group)}>Bearbeiten</Button>
                            <Button variant="destructive" onClick={() => handleDelete(group)}>
                                Löschen
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {discountGroups.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg mb-4">
                        Noch keine Rabattgruppen definiert.
                    </p>
                    <Button onClick={() => setIsAddModalOpen(true)}>
                        Erste Rabattgruppe erstellen
                    </Button>
                </div>
            )}

            {/* Edit Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Rabattgruppe bearbeiten</DialogTitle>
                    </DialogHeader>
                    {selectedGroup && (
                        <DiscountGroupForm 
                            onSubmit={handleUpdateGroup} 
                            initialData={selectedGroup}
                            isLoading={isLoading}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Add Modal */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Neue Rabattgruppe hinzufügen</DialogTitle>
                    </DialogHeader>
                    <DiscountGroupForm 
                        onSubmit={handleUpdateGroup}
                        isLoading={isLoading}
                    />
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Sind Sie sicher?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Diese Aktion kann nicht rückgängig gemacht werden. Die Rabattgruppe 
                            "{selectedGroup?.name}" wird permanent gelöscht.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleDeleteGroup}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Wird gelöscht...' : 'Löschen'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
} 