'use client';

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

const discountGroupSchema = z.object({
    name: z.string()
        .min(1, 'Name ist erforderlich')
        .max(50, 'Name darf maximal 50 Zeichen lang sein'),
    description: z.string()
        .min(1, 'Beschreibung ist erforderlich')
        .max(500, 'Beschreibung darf maximal 500 Zeichen lang sein'),
    discount_percentage: z.number()
        .min(0, 'Rabatt muss mindestens 0% betragen')
        .max(100, 'Rabatt darf maximal 100% betragen'),
});

type DiscountGroupFormValues = z.infer<typeof discountGroupSchema>;

interface DiscountGroupFormProps {
    onSubmit: (data: DiscountGroupFormValues) => Promise<void>;
    initialData?: {
        name: string;
        description: string;
        discount_percentage: number;
    };
    isLoading?: boolean;
}

export function DiscountGroupForm({ onSubmit, initialData, isLoading = false }: DiscountGroupFormProps) {
    const form = useForm<DiscountGroupFormValues>({
        resolver: zodResolver(discountGroupSchema),
        defaultValues: {
            name: initialData?.name || '',
            description: initialData?.description || '',
            discount_percentage: initialData?.discount_percentage || 0,
        },
    });

    const handleSubmit = async (data: DiscountGroupFormValues) => {
        await onSubmit(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Gruppenname</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="z.B. Schüler, Lehrer, Externe..."
                                    {...field}
                                />
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
                            <FormLabel>Beschreibung</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Beschreibung der Rabattgruppe..."
                                    rows={3}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="discount_percentage"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Rabatt (%)</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    placeholder="z.B. 15"
                                    {...field}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end space-x-2">
                    <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full"
                    >
                        {isLoading ? 'Wird gespeichert...' : (initialData ? 'Aktualisieren' : 'Erstellen')}
                    </Button>
                </div>
            </form>
        </Form>
    );
} 