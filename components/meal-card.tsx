'use client';

import { Meal } from '@/types/meal';
import { AlertCircle, ShoppingCart } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useCart } from '@/lib/cart-context';
import { useState } from 'react';

interface MealCardProps {
    meal: Meal;
    className?: string;
}

export function MealCard({ meal, className = '' }: MealCardProps) {
    const { addToCart } = useCart();
    const [orderTime, setOrderTime] = useState<string>('');

    const handleAddToCart = () => {
        if (!orderTime) {
            // If no time is selected, use current time
            const now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); // Adjust for timezone
            addToCart(meal, now.toISOString().slice(0, 16));
        } else {
            addToCart(meal, orderTime);
            setOrderTime('');
        }
    };

    return (
        <div className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${className}`}>
            {meal.image_url && (
                <div className="aspect-video mb-4 rounded-md overflow-hidden">
                    <img
                        src={meal.image_url}
                        alt={meal.name}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}
            
            <h3 className="text-xl font-semibold mb-2">{meal.name}</h3>
            <p className="text-gray-600 mb-3">{meal.description}</p>
            
            <div className="space-y-4">
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Price</span>
                        <span className="font-semibold">{meal.portion_sizes.medium.price.toFixed(2)} CHF</span>
                    </div>
                    <div className="mb-2 flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                            Pickup Time:
                        </label>
                        <input
                            type="time"
                            className="border rounded flex-1 px-2 py-1"
                            value={orderTime.split('T')[1] || ''}
                            onChange={(e) => {
                                const today = new Date().toISOString().split('T')[0];
                                setOrderTime(`${today}T${e.target.value}`);
                            }}
                        />
                    </div>
                    <Button
                        className="w-full"
                        onClick={handleAddToCart}
                    >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                    </Button>
                </div>

                {/* Ingredients */}
                {meal.ingredients.length > 0 && (
                    <div>
                        <h4 className="font-medium mb-2">Ingredients</h4>
                        <div className="flex flex-wrap gap-2">
                            {meal.ingredients.map((ingredient, index) => (
                                <span key={`${ingredient}-${index}`} className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                                    {ingredient}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Allergens */}
                {meal.allergens.length > 0 && (
                    <div>
                        <h4 className="font-medium mb-2">Allergens</h4>
                        <div className="flex flex-wrap gap-2">
                            {meal.allergens.map((allergen) => (
                                <TooltipProvider key={allergen}>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                {allergen}
                                            </span>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>This meal contains {allergen}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ))}
                        </div>
                    </div>
                )}

                {/* Origin */}
                <div>
                    <h4 className="font-medium mb-1">Origin</h4>
                    <p className="text-gray-600">{meal.country_of_origin}</p>
                </div>
            </div>
        </div>
    );
} 