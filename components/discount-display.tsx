import { cn } from "@/lib/utils"

interface DiscountDisplayProps {
    calculation: {
        subtotal?: number;
        originalPrice?: number;
        discountAmount: number;
        finalTotal?: number;
        finalPrice?: number;
        discountPercentage: number;
    } | null;
    className?: string;
}

export function DiscountDisplay({ calculation, className = "" }: DiscountDisplayProps) {
    if (!calculation) {
        return (
            <div className={cn("space-y-2", className)}>
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-24"></div>
                </div>
            </div>
        );
    }

    const originalPrice = calculation.subtotal || calculation.originalPrice || 0;
    const finalPrice = calculation.finalTotal || calculation.finalPrice || 0;
    const { discountAmount, discountPercentage } = calculation;
    
    const hasDiscount = discountPercentage > 0;

    return (
        <div className={cn("space-y-2", className)}>
            {hasDiscount && (
                <div className="text-sm text-gray-600">
                    <div className="flex justify-between items-center">
                        <span>Originalpreis:</span>
                        <span className="line-through">{originalPrice.toFixed(2)} CHF</span>
                    </div>
                    <div className="flex justify-between items-center text-green-600">
                        <span>{discountPercentage}% Rabatt:</span>
                        <span className="text-green-600 font-medium">
                            -{discountAmount.toFixed(2)} CHF
                        </span>
                    </div>
                </div>
            )}
            
            <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Endpreis:</span>
                <span className={cn(
                    "text-xl font-bold",
                    hasDiscount ? "text-green-600" : "text-gray-900"
                )}>
                    {finalPrice.toFixed(2)} CHF
                </span>
            </div>
        </div>
    );
} 