'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Meal, CreateMealInput } from '@/types/meal';
import { MealForm } from '@/components/admin/meal-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

export default function AdminMealsPage() {
    const [meals, setMeals] = useState<Meal[]>([]);
    const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const fetchMeals = async () => {
        const supabase = createClient();
        const { data, error } = await supabase.from('meals').select('*').order('name');
        if (error) {
            console.error('Error fetching meals:', error);
            return;
        }
        setMeals(data || []);
    };

    useEffect(() => {
        fetchMeals();
    }, []);

    const handleEdit = (meal: Meal) => {
        setSelectedMeal(meal);
        setIsEditModalOpen(true);
    };

    const handleDelete = (meal: Meal) => {
        setSelectedMeal(meal);
        setIsDeleteDialogOpen(true);
    };

    const handleUpdateMeal = async (data: CreateMealInput) => {
        setIsLoading(true);
        const supabase = createClient();
        const mealData = {
            name: data.name,
            description: data.description,
            ingredients: data.ingredients,
            allergens: data.allergens,
            country_of_origin: data.country_of_origin,
            image_url: data.image_url,
            portion_sizes: {
                small: {
                    price: data.portion_sizes.small.price,
                    description: data.portion_sizes.small.description
                },
                medium: {
                    price: data.portion_sizes.medium.price,
                    description: data.portion_sizes.medium.description
                },
                large: {
                    price: data.portion_sizes.large.price,
                    description: data.portion_sizes.large.description
                }
            }
        };

        try {
            if (selectedMeal) {
                // Update existing meal
                const { error } = await supabase.from('meals').update(mealData).eq('id', selectedMeal.id);
                if (error) {
                    console.error('Error updating meal:', error.message);
                    alert(`Error updating meal: ${error.message}`);
                    return;
                }
                await fetchMeals();
                setIsEditModalOpen(false);
            } else {
                // Create new meal
                const { error } = await supabase.from('meals').insert(mealData);
                if (error) {
                    console.error('Error creating meal:', error.message);
                    alert(`Error creating meal: ${error.message}`);
                    return;
                }
                await fetchMeals();
                setIsAddModalOpen(false);
            }
        } catch (error) {
            console.error('Unexpected error:', error);
            alert('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteMeal = async () => {
        if (!selectedMeal) return;
        setIsLoading(true);
        const supabase = createClient();
        const { error } = await supabase.from('meals').delete().eq('id', selectedMeal.id);
        if (error) {
            console.error('Error deleting meal:', error);
        } else {
            await fetchMeals();
            setIsDeleteDialogOpen(false);
        }
        setIsLoading(false);
    };

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Manage Meals</h1>
                <Button onClick={() => setIsAddModalOpen(true)}>Add Meal</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {meals.map((meal) => (
                    <div key={meal.id} className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-2">{meal.name}</h2>
                        <p className="text-gray-600 mb-4">{meal.description}</p>
                        <div className="space-y-2 mb-4">
                            <h3 className="font-medium">Portion Sizes:</h3>
                            {Object.entries(meal.portion_sizes).map(([size, { price, description }]) => (
                                <div key={size} className="flex justify-between items-center">
                                    <span className="capitalize">{size}:</span>
                                    <span className="font-medium">{price.toFixed(2)} €</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button onClick={() => handleEdit(meal)}>Edit</Button>
                            <Button variant="destructive" onClick={() => handleDelete(meal)}>Delete</Button>
                        </div>
                    </div>
                ))}
            </div>

            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Meal</DialogTitle>
                    </DialogHeader>
                    {selectedMeal && (
                        <MealForm onSubmit={handleUpdateMeal} initialData={selectedMeal} />
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Meal</DialogTitle>
                    </DialogHeader>
                    <MealForm onSubmit={handleUpdateMeal} />
                </DialogContent>
            </Dialog>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the meal.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteMeal}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
