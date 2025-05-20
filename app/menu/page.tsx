import { createClient } from '@/utils/supabase/server';
import { getNextWeekdays, formatDate } from '@/utils/date';
import { DailyMenu } from '@/types/daily-menu';
import { Meal } from '@/types/meal';
import { MealCard } from '@/components/meal-card';

async function getWeeklyMenu() {
    try {
        const supabase = await createClient();
        const weekdays = getNextWeekdays();
        const dateStrings = weekdays.map(date => formatDate(date));

        // First, get the daily menus
        const { data: dailyMenus, error: dailyMenusError } = await supabase
            .from('daily_menus')
            .select('*')
            .in('date', dateStrings)
            .order('date');

        if (dailyMenusError) {
            console.error('Error fetching daily menus:', dailyMenusError);
            return [];
        }

        if (!dailyMenus || dailyMenus.length === 0) {
            return [];
        }

        // Then, get all meals for these daily menus
        const mealIds = dailyMenus.flatMap(menu => menu.meal_ids);
        const { data: meals, error: mealsError } = await supabase
            .from('meals')
            .select('*')
            .in('id', mealIds);

        if (mealsError) {
            console.error('Error fetching meals:', mealsError);
            return [];
        }

        // Combine the data
        const menusWithMeals = dailyMenus.map(menu => ({
            ...menu,
            meals: meals?.filter(meal => menu.meal_ids.includes(meal.id)) || []
        }));

        return menusWithMeals as (DailyMenu & { meals: Meal[] })[];
    } catch (error) {
        console.error('Unexpected error in getWeeklyMenu:', error);
        return [];
    }
}

export default async function MenuPage() {
    const weeklyMenu = await getWeeklyMenu();
    const weekdays = getNextWeekdays();

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-8">Weekly Menu</h1>
            
            <div className="space-y-8">
                {weekdays.map((date) => {
                    const dailyMenu = weeklyMenu.find(menu => menu.date === formatDate(date));
                    
                    return (
                        <div key={date.toISOString()} className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-2xl font-semibold mb-4">
                                {date.toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </h2>

                            {dailyMenu?.meals ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {dailyMenu.meals.map((meal) => (
                                        <MealCard key={meal.id} meal={meal} />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">No meals planned for this day</p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
} 