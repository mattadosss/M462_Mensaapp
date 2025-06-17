'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Meal } from '@/types/meal';

interface OrderItem {
    meal: Meal;
    orderTime: string;
    quantity: number;
    userName?: string;
}

export default function OrdersOverviewPage() {
    const [orders, setOrders] = useState<OrderItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const supabase = createClient();

        // Initial fetch of today's orders
        const fetchTodayOrders = async () => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const data = JSON.parse(localStorage.getItem('activeOrders') || '[]');
            const todayOrders = data.filter((order: OrderItem) => 
                new Date(order.orderTime) >= today
            );
            
            setOrders(todayOrders);
            setLoading(false);
        };

        fetchTodayOrders();

        // Subscribe to localStorage changes
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'activeOrders') {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                const data = JSON.parse(e.newValue || '[]');
                const todayOrders = data.filter((order: OrderItem) => 
                    new Date(order.orderTime) >= today
                );
                
                setOrders(todayOrders);
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // Cleanup
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto py-10">
                <h1 className="text-3xl font-bold mb-8">Live Orders Overview</h1>
                <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-24 bg-gray-200 rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-8">Live Orders Overview</h1>
            
            {orders.length === 0 ? (
                <p className="text-gray-600">No active orders for today.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {orders.map((order, idx) => (
                        <div 
                            key={idx} 
                            className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h2 className="text-xl font-semibold">{order.meal.name}</h2>
                                <span className="text-sm text-gray-500">
                                    {new Date(order.orderTime).toLocaleTimeString()}
                                </span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-gray-600">
                                    Quantity: <span className="font-medium">{order.quantity}</span>
                                </p>
                                {order.userName && (
                                    <p className="text-gray-600">
                                        Ordered by: <span className="font-medium">{order.userName}</span>
                                    </p>
                                )}
                                <p className="text-gray-600">
                                    Price: <span className="font-medium">
                                        {(order.meal.portion_sizes.medium.price * order.quantity).toFixed(2)} €
                                    </span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
} 