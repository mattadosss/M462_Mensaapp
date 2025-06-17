'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { getNextWeekdays, formatDate } from '@/utils/date';
import { DailyMenu } from '@/types/daily-menu';
import { Meal } from '@/types/meal';
import { MealCard } from '@/components/meal-card';
import { useEffect, useState } from 'react';

export default function MenuPage() {
  const [weeklyMenu, setWeeklyMenu] = useState<(DailyMenu & { meals: Meal[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const weekdays = getNextWeekdays();

  useEffect(() => {
    const fetchWeeklyMenu = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // @ts-ignore: If you see a module error, install with: npm install @supabase/auth-helpers-nextjs
        const supabase = createClientComponentClient();
        const dateStrings = weekdays.map(date => formatDate(date));

        // Fetch daily menus for the week
        const { data: dailyMenus, error: dailyMenusError } = await supabase
          .from('daily_menus')
          .select('*')
          .in('date', dateStrings)
          .order('date');

        if (dailyMenusError) throw dailyMenusError;

        if (!dailyMenus || dailyMenus.length === 0) {
          setWeeklyMenu([]);
          return;
        }

        // Get all meal IDs from the daily menus
        const mealIds = (dailyMenus as Array<{ meal_ids: string[] }>).flatMap((menu) => menu.meal_ids);
        
        // Fetch all meals in a single query
        const { data: meals, error: mealsError } = await supabase
          .from('meals')
          .select('*')
          .in('id', mealIds);

        if (mealsError) throw mealsError;

        // Combine the data
        const menusWithMeals = (dailyMenus as Array<DailyMenu>).map((menu) => ({
          ...menu,
          meals: (meals as Meal[] | null)?.filter((meal) => menu.meal_ids.includes(meal.id)) || []
        }));

        setWeeklyMenu(menusWithMeals);
      } catch (err) {
        console.error('Error fetching weekly menu:', err);
        setError('Failed to load menu data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyMenu();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8">Weekly Menu</h1>
        <div className="space-y-8">
          {weekdays.map((date) => (
            <div key={date.toISOString()} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">
                {date.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric'
                })}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-40 bg-gray-200 rounded-lg"></div>
                    <div className="mt-2 h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="mt-1 h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8">Weekly Menu</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Weekly Menu</h1>
      
      <div className="space-y-8">
        {weekdays.map((date) => {
          const dailyMenu = weeklyMenu.find(menu => menu.date === formatDate(date));
          const formattedDate = date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
          });

          return (
            <div key={date.toISOString()} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">{formattedDate}</h2>

              {dailyMenu?.meals && dailyMenu.meals.length > 0 ? (
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