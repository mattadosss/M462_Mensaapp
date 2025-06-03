import { AccountType, getDiscountForAccountType } from "@/types/user";

export interface DiscountCalculation {
    subtotal: number;
    discountAmount: number;
    finalTotal: number;
    discountPercentage: number;
}

export function calculateDiscount(
    subtotal: number,
    accountType: AccountType
): DiscountCalculation {
    const discountPercentage = getDiscountForAccountType(accountType);
    const discountAmount = subtotal * discountPercentage;
    const finalTotal = subtotal - discountAmount;

    return {
        subtotal,
        discountAmount,
        finalTotal,
        discountPercentage,
    };
} 