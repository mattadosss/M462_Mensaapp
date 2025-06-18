'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { getNextWeekdays, formatDate } from '@/utils/date';
import { DailyMenu } from '@/types/daily-menu';
import { Meal } from '@/types/meal';
import { MealCard } from '@/components/meal-card';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function MenuPage() {
  const [weeklyMenu, setWeeklyMenu] = useState<(DailyMenu & { meals: Meal[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const weekdays = getNextWeekdays(calendarDate);
  const [selectedDate, setSelectedDate] = useState<Date>(weekdays[0]);

  useEffect(() => {
    setSelectedDate(weekdays[0]); // Immer ersten Tag der neuen Woche auswählen, wenn Kalenderdatum sich ändert
    // eslint-disable-next-line
  }, [calendarDate]);

  useEffect(() => {
    const fetchWeeklyMenu = async () => {
      try {
        setLoading(true);
        setError(null);
        const supabase = createClientComponentClient();
        const dateStrings = weekdays.map(date => formatDate(date));
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
        const mealIds = (dailyMenus as Array<{ meal_ids: string[] }>).flatMap((menu) => menu.meal_ids);
        const { data: meals, error: mealsError } = await supabase
          .from('meals')
          .select('*')
          .in('id', mealIds);
        if (mealsError) throw mealsError;
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
    // eslint-disable-next-line
  }, [calendarDate]);

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8">Choose Menu's</h1>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <span className="block text-xl font-medium mb-2">Date</span>
            <div className="flex gap-4">
              {weekdays.map((date) => (
                <button
                  key={date.toISOString()}
                  onClick={() => setSelectedDate(date)}
                  className={`flex flex-col items-center px-8 py-4 rounded-xl font-medium text-lg
                    ${selectedDate.toDateString() === date.toDateString() ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  <span>{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                  <span className="text-2xl font-bold">{date.getDate().toString().padStart(2, '0')}</span>
                </button>
              ))}
            </div>
          </div>
          {/* Datepicker rechts */}
          <div className="flex items-center gap-2">
            <input
              type="date"
              className="bg-black text-white rounded-full px-8 py-3 text-2xl font-light focus:outline-none"
              value={calendarDate.toISOString().split('T')[0]}
              onChange={e => {
                const newDate = new Date(e.target.value);
                if (!isNaN(newDate.getTime())) setCalendarDate(newDate);
              }}
              style={{ width: '220px' }}
            />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">
            {selectedDate.toLocaleDateString('en-US', {
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
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8">Choose Menu's</h1>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <span className="block text-xl font-medium mb-2">Date</span>
            <div className="flex gap-4">
              {weekdays.map((date) => (
                <button
                  key={date.toISOString()}
                  onClick={() => setSelectedDate(date)}
                  className={`flex flex-col items-center px-8 py-4 rounded-xl font-medium text-lg
                    ${selectedDate.toDateString() === date.toDateString() ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  <span>{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                  <span className="text-2xl font-bold">{date.getDate().toString().padStart(2, '0')}</span>
                </button>
              ))}
            </div>
          </div>
          {/* Datepicker rechts */}
          <div className="flex items-center gap-2">
            <input
              type="date"
              className="bg-black text-white rounded-full px-8 py-3 text-2xl font-light focus:outline-none"
              value={calendarDate.toISOString().split('T')[0]}
              onChange={e => {
                const newDate = new Date(e.target.value);
                if (!isNaN(newDate.getTime())) setCalendarDate(newDate);
              }}
              style={{ width: '220px' }}
            />
          </div>
        </div>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Choose Menu's</h1>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <span className="block text-xl font-medium mb-2">Date</span>
          <div className="flex gap-4">
            {weekdays.map((date) => (
              <button
                key={date.toISOString()}
                onClick={() => setSelectedDate(date)}
                className={`flex flex-col items-center px-8 py-4 rounded-xl font-medium text-lg
                  ${selectedDate.toDateString() === date.toDateString() ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                <span>{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                <span className="text-2xl font-bold">{date.getDate().toString().padStart(2, '0')}</span>
              </button>
            ))}
          </div>
        </div>
        {/* Datepicker rechts */}
        <div className="flex items-center gap-2">
          <input
            type="date"
            className="bg-black text-white rounded-full px-8 py-3 text-2xl font-light focus:outline-none"
            value={calendarDate.toISOString().split('T')[0]}
            onChange={e => {
              const newDate = new Date(e.target.value);
              if (!isNaN(newDate.getTime())) setCalendarDate(newDate);
            }}
            style={{ width: '220px' }}
          />
        </div>
      </div>
      <div className="space-y-8">
        {(() => {
          const date = selectedDate;
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
        })()}
      </div>
    </div>
  );
}