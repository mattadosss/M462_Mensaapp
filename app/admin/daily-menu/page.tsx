'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DailyMenu } from '@/types/daily-menu';
import { Meal } from '@/types/meal';
import { Search, Check, Plus, Edit3, X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const dailyMenuSchema = z.object({
    date: z.string().min(1, 'Date is required'),
    meal_ids: z.array(z.string())
        .min(1, 'At least one meal must be selected')
        .max(3, 'Maximum 3 meals allowed'),
});

type DailyMenuFormValues = z.infer<typeof dailyMenuSchema>;

// Hilfsfunktion für die nächsten 6 Tage ab gewähltem Datum
function getNextDays(startDateStr, count = 6) {
    const startDate = new Date(startDateStr);
    if (isNaN(startDate.getTime())) return [];
    const days = [];
    let current = new Date(startDate);
    for (let i = 0; i < count; i++) {
        days.push(new Date(current));
        current.setDate(current.getDate() + 1);
    }
    return days;
}

export default function DailyMenuPage() {
    const [meals, setMeals] = useState<Meal[]>([]);
    const [selectedMeals, setSelectedMeals] = useState<Meal[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [currentView, setCurrentView] = useState<'choose' | 'edit'>('choose');
    const [activeDayIndex, setActiveDayIndex] = useState(0);

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

            setMeals(data || []);
        };

        fetchMeals();
    }, []);

    useEffect(() => {
        setActiveDayIndex(0); // Immer zurücksetzen, wenn das Kalenderdatum geändert wird
    }, [form.watch('date')]);

    const handleMealSelection = (meal: Meal) => {
        const currentMealIds = form.getValues('meal_ids');
        
        if (currentMealIds.includes(meal.id)) {
            // Remove meal
            const newMealIds = currentMealIds.filter(id => id !== meal.id);
            setSelectedMeals(selectedMeals.filter(m => m.id !== meal.id));
            form.setValue('meal_ids', newMealIds);
        } else {
            // Add meal (max 3)
            if (currentMealIds.length >= 3) {
                return;
            }
            const newMealIds = [...currentMealIds, meal.id];
            setSelectedMeals([...selectedMeals, meal]);
            form.setValue('meal_ids', newMealIds);
        }
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

            // Reset form and switch to edit view
            setCurrentView('edit');
        } catch (error) {
            console.error('Error saving daily menu:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredMeals = meals.filter((meal) =>
        meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meal.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const nextDays = getNextDays(form.watch('date'), 6);
    const isValidDate = nextDays.length > 0;

    const MealCard = ({ meal, isSelected = false, isEditable = false }: { 
        meal: Meal; 
        isSelected?: boolean; 
        isEditable?: boolean;
    }) => (
        <div 
            className={`relative bg-white rounded-xl overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
                isSelected 
                    ? 'border-primary bg-primary/10' 
                    : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => !isEditable && handleMealSelection(meal)}
        >
            {/* Meal Image */}
            <div className="relative h-32 sm:h-40 bg-gradient-to-br from-purple-300 to-purple-500 overflow-hidden">
                {meal.image_url ? (
                    <img 
                        src={meal.image_url} 
                        alt={meal.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="text-white text-sm">No Image</span>
                    </div>
                )}
                
                {/* Selection indicator */}
                {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                    </div>
                )}
                
                {!isSelected && !isEditable && (
                    <div className="absolute top-2 right-2 w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <div className="w-3 h-3 sm:w-5 sm:h-5 border-2 border-white rounded-full"></div>
                    </div>
                )}
            </div>

            {/* Meal Info */}
            <div className="p-3 sm:p-4">
                <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">{meal.name}</h3>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-base sm:text-lg font-bold text-gray-900">
                        {meal.portion_sizes.medium.price.toFixed(0)}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500 line-through">
                        €{(meal.portion_sizes.medium.price * 1.25).toFixed(0)}
                    </span>
                    <div className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs font-medium">
                        DISCOUNT
                    </div>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2">{meal.description}</p>
                
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <span className="text-yellow-400 text-sm">★</span>
                        <span className="text-xs sm:text-sm font-medium ml-1">5.0(34)</span>
                    </div>
                    <span className="text-xs sm:text-sm text-gray-500">Main Course</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2 sm:space-x-4">
                            <Link href="/admin" className="text-xl sm:text-2xl font-bold text-gray-900">
                                Mensa
                            </Link>
                            <span className="text-gray-400 hidden sm:block">/</span>
                            <Link href="/admin" className="text-gray-600 hover:text-gray-900 text-sm sm:text-base">
                                Admin
                            </Link>
                            <span className="text-gray-400 hidden sm:block">/</span>
                            <h1 className="text-lg sm:text-xl font-semibold text-gray-700">Daily Menu</h1>
                        </div>
                        <div className="flex items-center space-x-2 sm:space-x-4">
                            <button 
                                onClick={() => setCurrentView(currentView === 'choose' ? 'edit' : 'choose')}
                                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm"
                            >
                                {currentView === 'choose' ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                <span className="hidden sm:inline">{currentView === 'choose' ? 'Edit Mode' : 'Choose Mode'}</span>
                            </button>
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-300 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
                {currentView === 'choose' ? (
                    // Choose Menu's View
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
                        {/* Left Side - Choose Menu's */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-4 sm:mb-6">
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Choose Menu's</h2>
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                        <div className="w-4 h-4 sm:w-6 sm:h-6 bg-gray-400 rounded-full"></div>
                                    </div>
                                </div>

                                {/* Date Selector */}
                                <div className="mb-4 sm:mb-6">
                                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                                        <span className="text-sm font-medium text-gray-700">Date</span>
                                        <input
                                            type="date"
                                            value={nextDays[activeDayIndex] ? nextDays[activeDayIndex].toISOString().split('T')[0] : form.watch('date')}
                                            onChange={(e) => form.setValue('date', e.target.value)}
                                            className="text-sm border border-gray-300 rounded-lg px-2 sm:px-3 py-1"
                                        />
                                    </div>
                                    {isValidDate && (
                                        <div className="grid grid-cols-6 gap-1 sm:gap-2">
                                            {nextDays.map((date, index) => (
                                                <button
                                                    type="button"
                                                    key={date.toISOString()}
                                                    onClick={() => {
                                                        setActiveDayIndex(index);
                                                        form.setValue('date', date.toISOString().split('T')[0]);
                                                    }}
                                                    className={`w-full text-center p-1 sm:p-2 rounded-lg transition-colors font-medium
                                                        ${activeDayIndex === index ? 'bg-primary text-white' : 'text-gray-600 bg-transparent hover:bg-primary/10'}`}
                                                >
                                                    <div className="text-xs">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                                                    <div className="text-xs sm:text-sm font-bold">{date.getDate().toString().padStart(2, '0')}</div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Search */}
                                <div className="relative mb-4 sm:mb-6">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                                    <Input
                                        type="text"
                                        placeholder="Search meals..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-8 sm:pl-10 h-10 sm:h-12 bg-gray-50 border-0 rounded-lg sm:rounded-xl text-sm"
                                    />
                                </div>

                                {/* Meals Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                                    {filteredMeals.map((meal) => (
                                        <MealCard 
                                            key={meal.id}
                                            meal={meal} 
                                            isSelected={form.getValues('meal_ids').includes(meal.id)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Selected Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                                    Selected Meals ({selectedMeals.length}/3)
                                </h3>
                                
                                {selectedMeals.length > 0 ? (
                                    <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                                        {selectedMeals.map((meal) => (
                                            <div key={meal.id} className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
                                                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-300 to-purple-500 rounded-lg flex-shrink-0"></div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-medium text-gray-900 text-xs sm:text-sm truncate">{meal.name}</h4>
                                                    <p className="text-xs text-gray-500">{meal.portion_sizes.medium.price.toFixed(0)} €</p>
                                                </div>
                                                <button
                                                    onClick={() => handleMealSelection(meal)}
                                                    className="p-1 text-gray-400 hover:text-red-500 flex-shrink-0"
                                                >
                                                    <X className="w-3 h-3 sm:w-4 sm:h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-6 sm:py-8 text-gray-500">
                                        <p className="text-sm">No meals selected yet</p>
                                        <p className="text-xs">Choose up to 3 meals for the daily menu</p>
                                    </div>
                                )}

                                <Button
                                    onClick={form.handleSubmit(handleSubmit)}
                                    disabled={isLoading || selectedMeals.length === 0}
                                    className="w-full h-10 sm:h-12 bg-primary text-white hover:bg-[#5a8e22] font-semibold rounded-lg sm:rounded-xl text-sm"
                                >
                                    {isLoading ? 'Saving...' : 'Save Daily Menu'}
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Edit Today's Menu's View
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4 sm:mb-6">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Edit Today's Menu's</h2>
                                <div className="flex items-center space-x-2 sm:space-x-3">
                                    <button className="p-1 sm:p-2 text-gray-400 hover:text-gray-600">
                                        <Edit3 className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                        <div className="w-4 h-4 sm:w-6 sm:h-6 bg-gray-400 rounded-full"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Current Menu Display */}
                            <div className="space-y-4 sm:space-y-6">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Today's Menu's</h3>
                                
                                {selectedMeals.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                                        {selectedMeals.map((meal, index) => (
                                            <MealCard 
                                                key={meal.id}
                                                meal={meal} 
                                                isEditable={true}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 sm:py-12">
                                        <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-100 rounded-xl sm:rounded-2xl mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                                            <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                                        </div>
                                        <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">No menu set for today</h4>
                                        <p className="text-gray-500 mb-3 sm:mb-4 text-sm">Start by choosing meals for today's menu</p>
                                        <Button
                                            onClick={() => setCurrentView('choose')}
                                            className="bg-primary text-white hover:bg-[#5a8e22] font-semibold rounded-lg sm:rounded-xl px-4 sm:px-6 text-sm"
                                        >
                                            Choose Meals
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
