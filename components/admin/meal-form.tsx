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

const portionSizeSchema = z.object({
    price: z.number().min(0, 'Price must be a positive number'),
    description: z.string().min(1, 'Description is required'),
});

const mealFormSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
    ingredients: z.string().min(1, 'Ingredients are required'),
    allergens: z.string().min(1, 'Allergens are required'),
    country_of_origin: z.string().min(1, 'Country of origin is required'),
    image_url: z.string().url('Must be a valid URL'),
    portion_sizes: z.object({
        small: portionSizeSchema,
        medium: portionSizeSchema,
        large: portionSizeSchema,
    }),
});

type MealFormValues = z.infer<typeof mealFormSchema>;

interface MealFormProps {
    onSubmit: (data: CreateMealInput) => void;
    initialData?: Partial<CreateMealInput>;
}

const defaultPortionSizes: PortionSizes = {
    small: { price: 0, description: 'Small portion' },
    medium: { price: 0, description: 'Medium portion' },
    large: { price: 0, description: 'Large portion' },
};

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
            portion_sizes: initialData?.portion_sizes || defaultPortionSizes,
        },
    });

    const handleSubmit = async (data: MealFormValues) => {
        try {
            setIsLoading(true);
            const mealData: CreateMealInput = {
                name: data.name,
                description: data.description,
                ingredients: data.ingredients.split(',').map(item => item.trim()),
                allergens: data.allergens.split(',').map(item => item.trim()),
                country_of_origin: data.country_of_origin,
                image_url: data.image_url,
                portion_sizes: data.portion_sizes,
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

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Portion Sizes</h3>
                    {(['small', 'medium', 'large'] as const).map((size) => (
                        <div key={size} className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name={`portion_sizes.${size}.description`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="capitalize">{size} Description</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`portion_sizes.${size}.price`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="capitalize">{size} Price (€)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                {...field}
                                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    ))}
                </div>

                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Meal'}
                </Button>
            </form>
        </Form>
    );
} 