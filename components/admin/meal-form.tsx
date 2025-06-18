'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { Textarea } from '@/components/ui/textarea';
import { CreateMealInput, PortionSizes } from '@/types/meal';

const mealFormSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
    ingredients: z.string().min(1, 'Ingredients are required'),
    allergens: z.string().min(1, 'Allergens are required'),
    country_of_origin: z.string().min(1, 'Country of origin is required'),
    image_url: z.string().url('Must be a valid URL'),
    price: z.string().min(1, 'Price is required'),
});

type MealFormValues = z.infer<typeof mealFormSchema>;

interface MealFormProps {
    onSubmit: (data: CreateMealInput) => void;
    initialData?: Partial<CreateMealInput>;
}

export function MealForm({ onSubmit, initialData }: MealFormProps) {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<MealFormValues>({
        resolver: zodResolver(mealFormSchema),
        defaultValues: {
            name: initialData?.name || '',
            description: initialData?.description || '',
            ingredients: initialData?.ingredients?.join(', ') || '',
            allergens: initialData?.allergens?.join(', ') || '',
            country_of_origin: initialData?.country_of_origin || '',
            image_url: initialData?.image_url || '',
            price: initialData?.portion_sizes?.medium?.price?.toString() || '',
        },
    });

    const handleSubmit = async (data: MealFormValues) => {
        try {
            setIsLoading(true);
            
            const price = parseFloat(data.price) || 0;
            
            // Create portion sizes with the same price for all sizes
            const portionSizes: PortionSizes = {
                small: { price: price, description: 'Small portion' },
                medium: { price: price, description: 'Medium portion' },
                large: { price: price, description: 'Large portion' },
            };

            const mealData: CreateMealInput = {
                name: data.name,
                description: data.description,
                ingredients: data.ingredients.split(',').map(item => item.trim()),
                allergens: data.allergens.split(',').map(item => item.trim()),
                country_of_origin: data.country_of_origin,
                image_url: data.image_url,
                portion_sizes: portionSizes,
            };
            await onSubmit(mealData);
            form.reset();
        } catch (error) {
            console.error('Error submitting meal:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-h-[80vh] overflow-y-auto pr-2">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter meal name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Enter meal description" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="ingredients"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ingredients (comma-separated)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter ingredients" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="allergens"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Allergens (comma-separated)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter allergens" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="country_of_origin"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Country of Origin</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter country of origin" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="image_url"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Image URL</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter image URL" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price (CHF)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        step="0.05"
                                        min="0"
                                        placeholder="Enter price"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save Meal'}
                    </Button>
                </form>
            </Form>
        </div>
    );
} 