"use client";

import { usePathname } from "next/navigation";
import { CartProvider } from "@/lib/cart-context";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AdminLink } from "@/components/admin-link";
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";
import { useState } from "react";

interface LayoutContentProps {
  children: React.ReactNode;
}

export function LayoutContent({ children }: LayoutContentProps) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/auth';
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleNavigation = (path: string) => {
    setIsLoading(path);
    // Simuliere eine kurze Verzögerung für bessere UX
    setTimeout(() => {
      window.location.href = path;
    }, 100);
  };

  return (
    <CartProvider>
      <main className="min-h-screen flex flex-col">
        {/* Mobile Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-4 h-16">
            {/* Left side - Logo and navigation */}
            <div className="flex items-center gap-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden -ml-2">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <nav className="flex flex-col gap-4 mt-8">
                    <Button 
                      variant="ghost" 
                      className="justify-start text-lg font-semibold hover:text-primary transition-colors"
                      onClick={() => handleNavigation('/')}
                      isLoading={isLoading === '/'}
                      loadingText="Lade..."
                    >
                      Home
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="justify-start text-lg font-semibold hover:text-primary transition-colors"
                      onClick={() => handleNavigation('/menu')}
                      isLoading={isLoading === '/menu'}
                      loadingText="Lade..."
                    >
                      Menu
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="justify-start text-lg font-semibold hover:text-primary transition-colors"
                      onClick={() => handleNavigation('/cart')}
                      isLoading={isLoading === '/cart'}
                      loadingText="Lade..."
                    >
                      Cart
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="justify-start text-lg font-semibold hover:text-primary transition-colors"
                      onClick={() => handleNavigation('/orders')}
                      isLoading={isLoading === '/orders'}
                      loadingText="Lade..."
                    >
                      Orders
                    </Button>
                    {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
                  </nav>
                </SheetContent>
              </Sheet>
              <Button 
                variant="ghost" 
                className="text-xl font-bold text-gray-900 hover:text-gray-700 transition-colors"
                onClick={() => handleNavigation('/')}
                isLoading={isLoading === '/'}
                loadingText="Lade..."
              >
                Mensa
              </Button>
            </div>

            {/* Right side - Auth and user actions */}
            <div className="flex items-center gap-3">
              {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 w-full pt-16">
          <div className="max-w-5xl mx-auto px-4 py-6">
            {children}
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t md:hidden">
          <div className="flex justify-around items-center h-16">
            <Button 
              variant="ghost" 
              className="flex flex-col items-center text-xs"
              onClick={() => handleNavigation('/')}
              isLoading={isLoading === '/'}
              loadingText="Lade..."
            >
              <span className="text-lg">🏠</span>
              <span>Home</span>
            </Button>
            <Button 
              variant="ghost" 
              className="flex flex-col items-center text-xs"
              onClick={() => handleNavigation('/menu')}
              isLoading={isLoading === '/menu'}
              loadingText="Lade..."
            >
              <span className="text-lg">🍽️</span>
              <span>Menu</span>
            </Button>
            <Button 
              variant="ghost" 
              className="flex flex-col items-center text-xs"
              onClick={() => handleNavigation('/cart')}
              isLoading={isLoading === '/cart'}
              loadingText="Lade..."
            >
              <span className="text-lg">🛒</span>
              <span>Cart</span>
            </Button>
            <Button 
              variant="ghost" 
              className="flex flex-col items-center text-xs"
              onClick={() => handleNavigation('/orders')}
              isLoading={isLoading === '/orders'}
              loadingText="Lade..."
            >
              <span className="text-lg">📋</span>
              <span>Orders</span>
            </Button>
            <AdminLink />
          </div>
        </nav>
      </main>
    </CartProvider>
  );
} 