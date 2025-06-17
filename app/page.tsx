import { createClient } from '@/utils/supabase/server';
import { formatDate } from '@/utils/date';
import { MealCard } from '@/components/meal-card';
import Link from 'next/link';

async function getTodayMenu() {
    const supabase = await createClient();
    const today = new Date();
    const todayString = formatDate(today);

    // Fetch today's daily menu
    const { data: dailyMenu, error: dailyMenuError } = await supabase
        .from('daily_menus')
        .select('*')
        .eq('date', todayString)
        .single();

    if (dailyMenuError || !dailyMenu) {
        return [];
    }

    // Fetch meals for today's menu
    const { data: meals, error: mealsError } = await supabase
        .from('meals')
        .select('*')
        .in('id', dailyMenu.meal_ids);

    if (mealsError || !meals) {
        return [];
    }

    return meals;
}

export default async function HomePage() {
    const meals = await getTodayMenu();
    const today = new Date();
    const todayLabel = today.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="container mx-auto py-10 flex flex-col items-center"> {/* Added flex, flex-col, and items-center */}
            <h1 className="text-3xl font-bold mb-6">Today's Menu</h1>
            <h2 className="text-xl font-semibold mb-4">{todayLabel}</h2>
            {meals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 w-full"> {/* Added w-full */}
                    {meals.map((meal) => (
                        <MealCard key={meal.id} meal={meal} />
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 italic mb-8">No menu available for today.</p>
            )}
            <div className="flex justify-center">
                <Link href="/menu">
                    <span className="inline-block px-8 py-3 bg-[#6ca12b] text-white rounded-lg text-lg font-semibold hover:bg-[#5a8e22] transition">View Full Weekly Menu</span>
                </Link>
            </div>
        </div>
    );
}