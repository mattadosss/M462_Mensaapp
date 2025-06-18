"use client";

import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { useEffect, useState } from 'react';
import { useAccountType } from '@/lib/use-account-type';

export default function HeaderAuth() {
  const router = useRouter();
  const supabase = createClient();
  const { totalItems } = useCart();
  const [user, setUser] = useState<any>(null);
  const accountType = useAccountType();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const handleNavigation = (path: string) => {
    setIsLoading(path);
    // Simuliere eine kurze Verzögerung für bessere UX
    setTimeout(() => {
      window.location.href = path;
    }, 100);
  };

  const handleSignOut = async () => {
    setIsLoading('signout');
    try {
      await supabase.auth.signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {user ? (
        <>
          <span className="text-sm text-gray-600 font-medium">{accountType}</span>
          <Link href="/cart" className="hidden md:block">
            <Button variant="ghost" size="icon" className="relative h-9 w-9">
              <span className="text-lg">🛒</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>
          {user.user_metadata?.role === 'admin' && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="hidden sm:inline-flex h-8 px-3 text-sm font-medium"
              onClick={() => handleNavigation('/admin')}
              isLoading={isLoading === '/admin'}
              loadingText="Lade..."
            >
              Admin
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            className="hidden sm:inline-flex h-8 px-3 text-sm font-medium"
            onClick={() => handleNavigation('/orders')}
            isLoading={isLoading === '/orders'}
            loadingText="Lade..."
          >
            Your Order
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSignOut} 
            className="h-8 px-3 text-sm font-medium"
            isLoading={isLoading === 'signout'}
            loadingText="Abmelde..."
          >
            Sign Out
          </Button>
        </>
      ) : (
        <Button 
          variant="default" 
          size="sm" 
          className="h-8 px-4 text-sm font-medium"
          onClick={() => handleNavigation('/auth')}
          isLoading={isLoading === '/auth'}
          loadingText="Lade..."
        >
          Sign In
        </Button>
      )}
    </div>
  );
}
