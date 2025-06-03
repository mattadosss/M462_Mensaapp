export type AccountType = 'Student' | 'Teacher' | 'External';

export type UserProfile = {
    id: string;
    user_id: string;
    account_type: AccountType;
    created_at: string;
    updated_at: string;
};

export type CreateUserProfileInput = {
    user_id: string;
    account_type: AccountType;
};

export type UpdateUserProfileInput = Partial<CreateUserProfileInput>;

// Discount percentages for each account type
export const ACCOUNT_TYPE_DISCOUNTS: Record<AccountType, number> = {
    'Student': 0.20, // 20%
    'Teacher': 0.15, // 15%
    'External': 0.05 // 5%
};

export function getDiscountForAccountType(accountType: AccountType): number {
    return ACCOUNT_TYPE_DISCOUNTS[accountType];
} 