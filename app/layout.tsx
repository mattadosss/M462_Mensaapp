import DeployButton from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import { Suspense } from "react";
import { CartProvider } from "@/lib/cart-context";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AdminLink } from "@/components/admin-link";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Mensa App",
  description: "Your digital canteen companion",
};

function ThemeProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <Suspense fallback={<div>Loading...</div>}>
          <ThemeProviderWrapper>
            <CartProvider>
              <main className="min-h-screen flex flex-col">
                {/* Mobile Header */}
                <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <div className="flex items-center justify-between px-4 h-16 border-b">
                    <div className="flex items-center gap-2">
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="ghost" size="icon" className="md:hidden">
                            <Menu className="h-5 w-5" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                          <nav className="flex flex-col gap-4 mt-8">
                            <Link href="/" className="text-lg font-semibold hover:text-primary">
                              Home
                            </Link>
                            <Link href="/menu" className="text-lg font-semibold hover:text-primary">
                              Menu
                            </Link>
                            <Link href="/cart" className="text-lg font-semibold hover:text-primary">
                              Cart
                            </Link>
                            <Link href="/orders" className="text-lg font-semibold hover:text-primary">
                              Orders
                            </Link>
                            {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
                          </nav>
                        </SheetContent>
                      </Sheet>
                      <Link href="/" className="text-xl font-bold">
                        Mensa
                      </Link>
                    </div>
                    <div className="flex items-center gap-2">
                      <ThemeSwitcher />
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

                {/* Footer - Only visible on desktop */}
                <footer className="hidden md:flex w-full items-center justify-center border-t mx-auto text-center text-xs gap-8 py-8">
                  <p>
                    Powered by{" "}
                    <a
                      href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
                      target="_blank"
                      className="font-bold hover:underline"
                      rel="noreferrer"
                    >
                      Supabase
                    </a>
                  </p>
                  <ThemeSwitcher />
                </footer>
              </main>
            </CartProvider>
          </ThemeProviderWrapper>
        </Suspense>
      </body>
    </html>
  );
}
