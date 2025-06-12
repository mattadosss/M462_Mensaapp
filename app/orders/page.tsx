'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Meal } from '@/types/meal';

interface OrderItem {
    meal: Meal;
    orderTime: string;
    quantity: number;
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<OrderItem[]>([]);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('activeOrders') || '[]');
        setOrders(data);
    }, []);

    if (orders.length === 0) {
        return (
            <div className="container mx-auto py-10">
                <h1 className="text-3xl font-bold mb-8">Aktive Bestellungen</h1>
                <p className="text-gray-600">Keine Bestellungen vermerkt.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-8">Aktive Bestellungen</h1>
            <div className="space-y-4">
                {orders.map((item, idx) => (
                    <div key={idx} className="border rounded p-4">
                        <h2 className="font-semibold">{item.meal.name}</h2>
                        <p>{new Date(item.orderTime).toLocaleString()}</p>
                        <p>Menge: {item.quantity}</p>
                        <p>Preis: {item.meal.portion_sizes.medium.price.toFixed(2)} €</p>
                    </div>
                ))}
            </div>
            <div className="mt-6">
                <Link href="/menu">
                    <Button>Weitere Gerichte</Button>
                </Link>
            </div>
        </div>
    );
}
