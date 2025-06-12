'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Meal } from '@/types/meal';

interface CartItem {
    meal: Meal;
    orderTime: string;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (meal: Meal, orderTime: string) => void;
    removeFromCart: (mealId: string, orderTime: string) => void;
    updateQuantity: (mealId: string, orderTime: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    const addToCart = (meal: Meal, orderTime: string) => {
        setItems(currentItems => {
            const existingItem = currentItems.find(
                item => item.meal.id === meal.id && item.orderTime === orderTime
            );

            if (existingItem) {
                return currentItems.map(item =>
                    item.meal.id === meal.id && item.orderTime === orderTime
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            return [...currentItems, { meal, orderTime, quantity: 1 }];
        });
    };

    const removeFromCart = (mealId: string, orderTime: string) => {
        setItems(currentItems =>
            currentItems.filter(
                item => !(item.meal.id === mealId && item.orderTime === orderTime)
            )
        );
    };

    const updateQuantity = (mealId: string, orderTime: string, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(mealId, orderTime);
            return;
        }

        setItems(currentItems =>
            currentItems.map(item =>
                item.meal.id === mealId && item.orderTime === orderTime
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => {
        const price = item.meal.portion_sizes.medium.price;
        return sum + price * item.quantity;
    }, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                totalItems,
                totalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
} 