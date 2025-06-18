'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/lib/cart-context';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import CardDetailsInput from '@/components/CardDetailsInput';
import { useAccountType } from '@/lib/use-account-type';
import { calculateDiscountByAccountType } from '@/utils/discount-enhanced';
import { DiscountDisplay } from '@/components/discount-display';
import { createClient } from '@/utils/supabase/client';

interface DiscountCalculation {
    subtotal: number;
    discountAmount: number;
    finalTotal: number;
    discountPercentage: number;
}

export default function CartPage() {
    const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
    const router = useRouter();
    const accountType = useAccountType();
    const [showCardDetails, setShowCardDetails] = useState(false);
    const [discountCalc, setDiscountCalc] = useState<DiscountCalculation | null>(null);

    // Rabattberechnung mit neuem System
    useEffect(() => {
        const calculateDiscount = async () => {
            try {
                const calc = await calculateDiscountByAccountType(totalPrice, accountType);
                // Format für bestehende DiscountDisplay Komponente anpassen
                setDiscountCalc({
                    subtotal: calc.originalPrice,
                    discountAmount: calc.discountAmount,
                    finalTotal: calc.finalPrice,
                    discountPercentage: calc.discountPercentage
                });
            } catch (error) {
                console.error('Error calculating discount:', error);
                // Fallback ohne Rabatt
                setDiscountCalc({
                    subtotal: totalPrice,
                    discountAmount: 0,
                    finalTotal: totalPrice,
                    discountPercentage: 0
                });
            }
        };

        calculateDiscount();
    }, [totalPrice, accountType]);

    const handleCheckout = () => {
        setShowCardDetails(true);
    };

    const handlePaymentSuccess = async () => {
        try {
            const supabase = createClient();
            
            // Get the current user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                throw new Error('User not authenticated');
            }

            // Save each item as an order
            const orderPromises = items.map(item => 
                supabase.from('orders').insert({
                    user_id: user.id,
                    meal_id: item.meal.id,
                    quantity: item.quantity,
                    order_time: item.orderTime,
                    status: 'pending'
                })
            );

            await Promise.all(orderPromises);
            
            // Clear the cart and redirect
            clearCart();
            router.push('/success');
            setShowCardDetails(false);
        } catch (error) {
            console.error('Error saving orders:', error);
            alert('Failed to save orders. Please try again.');
        }
    };

    const handleCancelPayment = () => {
        setShowCardDetails(false);
    };

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-6 sm:py-10">
                <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Your Cart</h1>
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 text-center">
                    <p className="text-gray-600 mb-4">Your cart is empty</p>
                    <Button onClick={() => router.push('/menu')} className="w-full sm:w-auto">
                        Browse Menu
                    </Button>
                </div>
            </div>
        );
    }

    if (showCardDetails) {
        return (
            <div className="container mx-auto px-4 py-6 sm:py-10">
                <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">Complete Your Purchase</h1>
                <CardDetailsInput onPaymentSuccess={handlePaymentSuccess} onCancel={handleCancelPayment} />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6 sm:py-10">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Your Cart</h1>
            
            <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 sm:gap-8">
                <div className="lg:col-span-2 order-2 lg:order-1">
                    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                        {items.map((item) => (
                            <div key={`${item.meal.id}-${item.orderTime}`} className="border-b last:border-b-0 py-4">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold mb-1">{item.meal.name}</h3>
                                        <p className="text-gray-600 text-sm sm:text-base mb-1">{new Date(item.orderTime).toLocaleString()}</p>
                                        <p className="text-gray-600 text-sm sm:text-base">
                                            {item.meal.portion_sizes.medium.price.toFixed(2)} CHF each
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => updateQuantity(item.meal.id, item.orderTime, item.quantity - 1)}
                                                className="h-8 w-8 sm:h-9 sm:w-9"
                                            >
                                                <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                                            </Button>
                                            <span className="w-8 text-center text-sm sm:text-base font-medium">{item.quantity}</span>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => updateQuantity(item.meal.id, item.orderTime, item.quantity + 1)}
                                                className="h-8 w-8 sm:h-9 sm:w-9"
                                            >
                                                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                                            </Button>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeFromCart(item.meal.id, item.orderTime)}
                                            className="h-8 w-8 sm:h-9 sm:w-9"
                                        >
                                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-1 order-1 lg:order-2">
                    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 sticky top-20">
                        <h2 className="text-lg sm:text-xl font-semibold mb-4">Order Summary</h2>
                        <DiscountDisplay calculation={discountCalc} className="mb-4" />
                        <Button
                            className="w-full"
                            onClick={handleCheckout}
                            size="lg"
                        >
                            Proceed to Checkout
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
} 