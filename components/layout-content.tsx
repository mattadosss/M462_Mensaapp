'use client';

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

interface LayoutContentProps {
  children: React.ReactNode;
}

export function LayoutContent({ children }: LayoutContentProps) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/auth';

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
                    <Link href="/" className="text-lg font-semibold hover:text-primary transition-colors">
                      Home
                    </Link>
                    <Link href="/menu" className="text-lg font-semibold hover:text-primary transition-colors">
                      Menu
                    </Link>
                    <Link href="/cart" className="text-lg font-semibold hover:text-primary transition-colors">
                      Cart
                    </Link>
                    <Link href="/orders" className="text-lg font-semibold hover:text-primary transition-colors">
                      Orders
                    </Link>
                    {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
                  </nav>
                </SheetContent>
              </Sheet>
              <Link href="/" className="text-xl font-bold text-gray-900 hover:text-gray-700 transition-colors">
                Mensa
              </Link>
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
            <Link href="/" className="flex flex-col items-center text-xs">
              <span className="text-lg">🏠</span>
              <span>Home</span>
            </Link>
            <Link href="/menu" className="flex flex-col items-center text-xs">
              <span className="text-lg">🍽️</span>
              <span>Menu</span>
            </Link>
            <Link href="/cart" className="flex flex-col items-center text-xs">
              <span className="text-lg">🛒</span>
              <span>Cart</span>
            </Link>
            <Link href="/orders" className="flex flex-col items-center text-xs">
              <span className="text-lg">📋</span>
              <span>Orders</span>
            </Link>
            <AdminLink />
          </div>
        </nav>
      </main>
    </CartProvider>
  );
} 