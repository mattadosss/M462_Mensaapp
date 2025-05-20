import { Meal } from '@/types/meal';
import { AlertCircle } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface MealCardProps {
    meal: Meal;
    className?: string;
}

export function MealCard({ meal, className = '' }: MealCardProps) {
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
                {/* Portion Sizes */}
                <div>
                    <h4 className="font-medium mb-2">Portion Sizes</h4>
                    <div className="grid grid-cols-3 gap-2">
                        {Object.entries(meal.portion_sizes).map(([size, { price, description }]) => (
                            <div
                                key={size}
                                className="border rounded p-2 text-center"
                            >
                                <div className="text-sm font-medium capitalize">{size}</div>
                                <div className="text-lg font-semibold">{price.toFixed(2)} €</div>
                                <div className="text-xs text-gray-500">{description}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Ingredients */}
                {meal.ingredients.length > 0 && (
                    <div>
                        <h4 className="font-medium mb-2">Ingredients</h4>
                        <div className="flex flex-wrap gap-2">
                            {meal.ingredients.map((ingredient) => (
                                <span
                                    key={ingredient}
                                    className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                                >
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