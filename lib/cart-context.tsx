'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Meal } from '@/types/meal';

interface CartItem {
    meal: Meal;
    portionSize: string;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (meal: Meal, portionSize: string) => void;
    removeFromCart: (mealId: string, portionSize: string) => void;
    updateQuantity: (mealId: string, portionSize: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    const addToCart = (meal: Meal, portionSize: string) => {
        setItems(currentItems => {
            const existingItem = currentItems.find(
                item => item.meal.id === meal.id && item.portionSize === portionSize
            );

            if (existingItem) {
                return currentItems.map(item =>
                    item.meal.id === meal.id && item.portionSize === portionSize
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            return [...currentItems, { meal, portionSize, quantity: 1 }];
        });
    };

    const removeFromCart = (mealId: string, portionSize: string) => {
        setItems(currentItems =>
            currentItems.filter(
                item => !(item.meal.id === mealId && item.portionSize === portionSize)
            )
        );
    };

    const updateQuantity = (mealId: string, portionSize: string, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(mealId, portionSize);
            return;
        }

        setItems(currentItems =>
            currentItems.map(item =>
                item.meal.id === mealId && item.portionSize === portionSize
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
        const price = item.meal.portion_sizes[item.portionSize].price;
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