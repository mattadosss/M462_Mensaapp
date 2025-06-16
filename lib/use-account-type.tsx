'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { AccountType } from '@/types/user';

export function useAccountType(initial: AccountType = 'External'): AccountType {
    const [accountType, setAccountType] = useState<AccountType>(initial);
    const supabase = createClient();

    useEffect(() => {
        const fetchType = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            const type = user?.user_metadata?.account_type as AccountType | undefined;
            if (type) setAccountType(type);
        };

        fetchType();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
            const type = session?.user?.user_metadata?.account_type as AccountType | undefined;
            if (type) setAccountType(type);
        });

        return () => {
            subscription?.unsubscribe();
        };
    }, [supabase]);

    return accountType;
}
