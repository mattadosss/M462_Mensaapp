import { DiscountCalculation } from "@/utils/discount";
import { formatCurrency } from "@/utils/format";

interface DiscountDisplayProps {
    calculation: DiscountCalculation;
    className?: string;
}

export function DiscountDisplay({ calculation, className = "" }: DiscountDisplayProps) {
    const {
        subtotal,
        discountAmount,
        finalTotal,
        discountPercentage,
    } = calculation;

    return (
        <div className={`space-y-2 ${className}`}>
            <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-green-600">
                <span>Discount ({discountPercentage * 100}%):</span>
                <span>-{formatCurrency(discountAmount)}</span>
            </div>
            <div className="flex justify-between font-semibold border-t pt-2">
                <span>Total:</span>
                <span>{formatCurrency(finalTotal)}</span>
            </div>
        </div>
    );
} 