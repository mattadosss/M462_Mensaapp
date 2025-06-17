import { createClient } from '@/utils/supabase/client';

export interface DiscountGroup {
    id: string;
    name: string;
    description: string;
    discount_percentage: number;
}

export interface DiscountCalculation {
    originalPrice: number;
    discountPercentage: number;
    discountAmount: number;
    finalPrice: number;
    groupName: string;
}

// Cache für Rabattgruppen
let discountGroupsCache: DiscountGroup[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getDiscountGroups(): Promise<DiscountGroup[]> {
    const now = Date.now();
    
    // Return cached data if still valid
    if (discountGroupsCache && (now - cacheTimestamp) < CACHE_DURATION) {
        return discountGroupsCache;
    }

    try {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('discount_groups')
            .select('*')
            .order('name');

        if (error) {
            console.error('Error fetching discount groups:', error);
            return getFallbackDiscountGroups();
        }

        discountGroupsCache = data || [];
        cacheTimestamp = now;
        return discountGroupsCache;
    } catch (error) {
        console.error('Unexpected error fetching discount groups:', error);
        return getFallbackDiscountGroups();
    }
}

function getFallbackDiscountGroups(): DiscountGroup[] {
    return [
        {
            id: 'fallback-student',
            name: 'Schüler',
            description: 'Rabatt für Schülerinnen und Schüler',
            discount_percentage: 15.0
        },
        {
            id: 'fallback-teacher',
            name: 'Lehrer', 
            description: 'Rabatt für Lehrkräfte',
            discount_percentage: 10.0
        },
        {
            id: 'fallback-external',
            name: 'Externe',
            description: 'Keine Rabatte für externe Besucher',
            discount_percentage: 0.0
        }
    ];
}

export async function getDiscountGroupByName(groupName: string): Promise<DiscountGroup | null> {
    const groups = await getDiscountGroups();
    return groups.find(group => group.name.toLowerCase() === groupName.toLowerCase()) || null;
}

export async function calculateDiscountByGroupName(
    originalPrice: number, 
    groupName: string
): Promise<DiscountCalculation> {
    const group = await getDiscountGroupByName(groupName);
    
    if (!group) {
        return {
            originalPrice,
            discountPercentage: 0,
            discountAmount: 0,
            finalPrice: originalPrice,
            groupName: groupName || 'Unbekannt'
        };
    }

    const discountAmount = (originalPrice * group.discount_percentage) / 100;
    const finalPrice = originalPrice - discountAmount;

    return {
        originalPrice,
        discountPercentage: group.discount_percentage,
        discountAmount,
        finalPrice,
        groupName: group.name
    };
}

// Legacy-Kompatibilität
export async function calculateDiscountByAccountType(
    originalPrice: number,
    accountType: 'Student' | 'Teacher' | 'External' | string
): Promise<DiscountCalculation> {
    const groupNameMap: Record<string, string> = {
        'Student': 'Schüler',
        'Teacher': 'Lehrer', 
        'External': 'Externe'
    };

    const groupName = groupNameMap[accountType] || accountType;
    return calculateDiscountByGroupName(originalPrice, groupName);
}

export function invalidateDiscountGroupsCache(): void {
    discountGroupsCache = null;
    cacheTimestamp = 0;
} 