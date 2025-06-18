"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function AdminDashboard() {
    const [isLoading, setIsLoading] = useState<string | null>(null);

    const handleNavigation = (path: string) => {
        setIsLoading(path);
        // Simuliere eine kurze Verzögerung für bessere UX
        setTimeout(() => {
            window.location.href = path;
        }, 100);
    };

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
                    <h2 className="text-xl font-semibold mb-4">Tagesmenüs verwalten</h2>
                    <p className="text-gray-600 text-center mb-4">
                        Erstellen und bearbeiten Sie die täglichen Menüs
                    </p>
                    <Button 
                        onClick={() => handleNavigation('/admin/daily-menu')}
                        isLoading={isLoading === '/admin/daily-menu'}
                        loadingText="Lade..."
                        className="mt-4 min-w-[180px] max-w-full"
                    >
                        Zu den Tagesmenüs
                    </Button>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
                    <h2 className="text-xl font-semibold mb-4">Gerichte verwalten</h2>
                    <p className="text-gray-600 text-center mb-4">
                        Hinzufügen, bearbeiten und löschen Sie Gerichte
                    </p>
                    <Button 
                        onClick={() => handleNavigation('/admin/meals')}
                        isLoading={isLoading === '/admin/meals'}
                        loadingText="Lade..."
                        className="mt-4 min-w-[180px] max-w-full"
                    >
                        Zu den Gerichten
                    </Button>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
                    <h2 className="text-xl font-semibold mb-4">Rabattgruppen verwalten</h2>
                    <p className="text-gray-600 text-center mb-4">
                        Definieren Sie Rabattgruppen und deren Konditionen
                    </p>
                    <Button 
                        onClick={() => handleNavigation('/admin/discount-groups')}
                        isLoading={isLoading === '/admin/discount-groups'}
                        loadingText="Lade..."
                        className="mt-4 min-w-[180px] max-w-full"
                    >
                        Zu den Rabattgruppen
                    </Button>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
                    <h2 className="text-xl font-semibold mb-4">Live Orders Overview</h2>
                    <Button 
                        onClick={() => handleNavigation('/admin/orders-overview')}
                        isLoading={isLoading === '/admin/orders-overview'}
                        loadingText="Lade..."
                        className="mt-4 min-w-[180px] max-w-full"
                    >
                        View Live Orders
                    </Button>
                </div>
            </div>
        </div>
    );
} 