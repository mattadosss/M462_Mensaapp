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
        
        // Create portion sizes with the same price for all sizes
        const mealData = {
            name: data.name,
            description: data.description,
            ingredients: data.ingredients,
            allergens: data.allergens,
            country_of_origin: data.country_of_origin,
            image_url: data.image_url,
            portion_sizes: {
                small: {
                    price: data.portion_sizes.medium.price,
                    description: 'Small portion'
                },
                medium: {
                    price: data.portion_sizes.medium.price,
                    description: 'Medium portion'
                },
                large: {
                    price: data.portion_sizes.medium.price,
                    description: 'Large portion'
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
        <div className="container mx-auto px-4 py-6 sm:py-10">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold">Manage Meals</h1>
                <Button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="w-full sm:w-auto"
                >
                    Add Meal
                </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {meals.map((meal) => (
                    <div key={meal.id} className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                        <h2 className="text-lg sm:text-xl font-semibold mb-2">{meal.name}</h2>
                        <p className="text-gray-600 mb-4 text-sm sm:text-base line-clamp-3">{meal.description}</p>
                        <div className="space-y-2 mb-4">
                            <h3 className="font-medium text-sm sm:text-base">Price:</h3>
                            <div className="flex justify-between items-center">
                                <span className="text-sm sm:text-base">Standard Price:</span>
                                <span className="font-medium text-sm sm:text-base">{meal.portion_sizes.medium.price.toFixed(2)} CHF</span>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 sm:justify-end sm:space-x-2">
                            <Button 
                                onClick={() => handleEdit(meal)}
                                size="sm"
                                className="w-full sm:w-auto"
                            >
                                Edit
                            </Button>
                            <Button 
                                variant="destructive" 
                                onClick={() => handleDelete(meal)}
                                size="sm"
                                className="w-full sm:w-auto"
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="w-[95vw] max-w-md sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Edit Meal</DialogTitle>
                    </DialogHeader>
                    {selectedMeal && (
                        <MealForm onSubmit={handleUpdateMeal} initialData={selectedMeal} />
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent className="w-[95vw] max-w-md sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Add New Meal</DialogTitle>
                    </DialogHeader>
                    <MealForm onSubmit={handleUpdateMeal} />
                </DialogContent>
            </Dialog>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent className="w-[95vw] max-w-md">
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
