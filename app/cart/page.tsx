'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import CardDetailsInput from '@/components/CardDetailsInput';

export default function CartPage() {
    const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
    const router = useRouter();
    const [showCardDetails, setShowCardDetails] = useState(false);

    const handleCheckout = () => {
        setShowCardDetails(true);
    };

    const handlePaymentSuccess = () => {
        clearCart();
        router.push('/success');
        setShowCardDetails(false);
    };

    const handleCancelPayment = () => {
        setShowCardDetails(false);
    };

    if (items.length === 0) {
        return (
            <div className="container mx-auto py-10">
                <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <p className="text-gray-600 mb-4">Your cart is empty</p>
                    <Button onClick={() => router.push('/menu')}>
                        Browse Menu
                    </Button>
                </div>
            </div>
        );
    }

    if (showCardDetails) {
        return (
            <div className="container mx-auto py-10">
                <h1 className="text-3xl font-bold mb-8 text-center">Complete Your Purchase</h1>
                <CardDetailsInput onPaymentSuccess={handlePaymentSuccess} onCancel={handleCancelPayment} />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        {items.map((item) => (
                            <div key={`${item.meal.id}-${item.portionSize}`} className="border-b last:border-b-0 py-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-semibold">{item.meal.name}</h3>
                                        <p className="text-gray-600 capitalize">{item.portionSize} Portion</p>
                                        <p className="text-gray-600">
                                            {item.meal.portion_sizes[item.portionSize].price.toFixed(2)} € each
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => updateQuantity(item.meal.id, item.portionSize, item.quantity - 1)}
                                            >
                                                <Minus className="w-4 h-4" />
                                            </Button>
                                            <span className="w-8 text-center">{item.quantity}</span>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => updateQuantity(item.meal.id, item.portionSize, item.quantity + 1)}
                                            >
                                                <Plus className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeFromCart(item.meal.id, item.portionSize)}
                                        >
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>{totalPrice.toFixed(2)} €</span>
                            </div>
                            <div className="flex justify-between font-semibold text-lg">
                                <span>Total</span>
                                <span>{totalPrice.toFixed(2)} €</span>
                            </div>
                        </div>
                        <Button
                            className="w-full"
                            onClick={handleCheckout}
                        >
                            Proceed to Checkout
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
} 