import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function CardDetailsInput({ onPaymentSuccess, onCancel }: { onPaymentSuccess: () => void; onCancel: () => void }) {
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cvv, setCvv] = useState('');

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, ''); // Only allow digits
        if (value.length <= 16) {
            setCardNumber(value);
        }
    };

    const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, ''); // Only allow digits
        if (value.length > 2) {
            value = `${value.substring(0, 2)}/${value.substring(2, 4)}`;
        } else if (value.length === 2 && !cardExpiry.includes('/')) {
            value = `${value}/`;
        }
        if (value.length <= 5) { // MM/YY (5 characters)
            setCardExpiry(value);
        }
    };

    const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, ''); // Only allow digits
        if (value.length <= 4) { // Max 4 digits for CVV
            setCvv(value);
        }
    };

    const isFormValid = () => {
        // Basic validation: all fields must meet length requirements
        const cardNumberValid = cardNumber.length === 16;
        const cardExpiryValid = cardExpiry.match(/^\d{2}\/\d{2}$/) !== null;
        const cvvValid = cvv.length >= 3 && cvv.length <= 4;
        return cardNumberValid && cardExpiryValid && cvvValid;
    };

    const handlePayNow = () => {
        if (!isFormValid()) {
            alert('Please enter valid card details.');
            return;
        }
        // Here you would integrate with a real payment gateway
        // For demonstration, we'll just simulate success
        console.log('Processing payment with:', { cardNumber, cardExpiry, cvv });
        // Simulate a delay for payment processing
        setTimeout(() => {
            onPaymentSuccess();
        }, 1500);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Card Details</h2>
            <div className="space-y-4">
                <div>
                    <Label htmlFor="cardNumber" className="text-gray-700">Card Number</Label>
                    <Input
                        id="cardNumber"
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        value={cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ')}
                        onChange={handleCardNumberChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        inputMode="numeric"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="cardExpiry" className="text-gray-700">Card Expiry</Label>
                        <Input
                            id="cardExpiry"
                            type="text"
                            placeholder="MM/YY"
                            value={cardExpiry}
                            onChange={handleCardExpiryChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                            inputMode="numeric"
                        />
                    </div>
                    <div>
                        <Label htmlFor="cvv" className="text-gray-700">CVV</Label>
                        <Input
                            id="cvv"
                            type="password"
                            placeholder="123"
                            value={cvv}
                            onChange={handleCvvChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                            inputMode="numeric"
                            maxLength={4}
                        />
                    </div>
                </div>
                <Button
                    className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    onClick={handlePayNow}
                    disabled={!isFormValid()}
                >
                    Pay Now
                </Button>
                <Button
                    variant="outline"
                    className="w-full mt-2"
                    onClick={onCancel}
                >
                    Cancel
                </Button>
            </div>
        </div>
    );
} 