'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DailyMenu } from '@/types/daily-menu';
import { Meal } from '@/types/meal';

const dailyMenuSchema = z.object({
    date: z.string().min(1, 'Date is required'),
    meal_ids: z.array(z.string())
        .min(1, 'At least one meal must be selected')
        .max(3, 'Maximum 3 meals allowed'),
});

type DailyMenuFormValues = z.infer<typeof dailyMenuSchema>;

export default function DailyMenuPage() {
    const [meals, setMeals] = useState<Meal[]>([]);
    const [selectedMeals, setSelectedMeals] = useState<Meal[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<DailyMenuFormValues>({
        resolver: zodResolver(dailyMenuSchema),
        defaultValues: {
            date: new Date().toISOString().split('T')[0],
            meal_ids: [],
        },
    });

    // Fetch meals on component mount
    useEffect(() => {
        const fetchMeals = async () => {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('meals')
                .select('*')
                .order('name');

            if (error) {
                console.error('Error fetching meals:', error);
                return;
            }

            console.log('Fetched meals:', data); // Debug log
            setMeals(data || []);
        };

        fetchMeals();
    }, []);

    const handleMealSelection = (mealId: string) => {
        const currentMealIds = form.getValues('meal_ids');
        const meal = meals.find(m => m.id === mealId);

        if (!meal) return;

        let newMealIds: string[];
        if (currentMealIds.includes(mealId)) {
            newMealIds = currentMealIds.filter(id => id !== mealId);
            setSelectedMeals(selectedMeals.filter(m => m.id !== mealId));
        } else {
            if (currentMealIds.length >= 3) {
                return; // Don't allow more than 3 meals
            }
            newMealIds = [...currentMealIds, mealId];
            setSelectedMeals([...selectedMeals, meal]);
        }

        form.setValue('meal_ids', newMealIds);
    };

    const handleSubmit = async (data: DailyMenuFormValues) => {
        try {
            setIsLoading(true);
            const supabase = createClient();

            const { error } = await supabase
                .from('daily_menus')
                .upsert({
                    date: data.date,
                    meal_ids: data.meal_ids,
                }, {
                    onConflict: 'date'
                });

            if (error) throw error;

            // Reset form
            form.reset();
            setSelectedMeals([]);
        } catch (error) {
            console.error('Error saving daily menu:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6">Daily Menu Management</h1>
            
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Date</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="space-y-4">
                        <FormLabel>Select Meals (max 3)</FormLabel>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {meals.map((meal) => (
                                <div
                                    key={meal.id}
                                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                                        form.getValues('meal_ids').includes(meal.id)
                                            ? 'border-primary bg-primary/10'
                                            : 'border-border hover:border-primary/50'
                                    }`}
                                    onClick={() => handleMealSelection(meal.id)}
                                >
                                    <h3 className="font-medium">{meal.name}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {meal.description}
                                    </p>
                                    <p className="text-sm font-medium mt-2">
                                        {meal.portion_sizes.medium.price.toFixed(2)} €
                                    </p>
                                </div>
                            ))}
                        </div>
                        <FormMessage />
                    </div>

                    {selectedMeals.length > 0 && (
                        <div className="mt-6">
                            <h3 className="font-medium mb-2">Selected Meals:</h3>
                            <div className="space-y-2">
                                {selectedMeals.map((meal) => (
                                    <div
                                        key={meal.id}
                                        className="flex items-center justify-between p-2 bg-muted rounded"
                                    >
                                        <span>{meal.name}</span>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleMealSelection(meal.id)}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={isLoading || selectedMeals.length === 0}
                    >
                        {isLoading ? 'Saving...' : 'Save Daily Menu'}
                    </Button>
                </form>
            </Form>
        </div>
    );
} 