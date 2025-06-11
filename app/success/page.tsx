'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function PaymentSuccessPage() {
    const router = useRouter();

    const handleBackHome = () => {
        router.push('/menu');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="bg-green-700 text-white rounded-lg shadow-md p-6 text-center max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6">Payment Successful.</h2>
                <p className="text-xl">Thank You.</p>
            </div>
            <Button
                variant="outline"
                onClick={handleBackHome}
                className="mt-8"
            >
                ← back home
            </Button>
        </div>
    );
} 