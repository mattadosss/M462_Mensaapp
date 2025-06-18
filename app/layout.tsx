import DeployButton from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Suspense } from "react";
import { CartProvider } from "@/lib/cart-context";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AdminLink } from "@/components/admin-link";
import { LayoutContent } from "@/components/layout-content";
import { Toaster } from 'sonner';

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



export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
      <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
      <Suspense fallback={<div>Loading...</div>}>
        <LayoutContent>{children}</LayoutContent>
      </Suspense>
      {/* 👇 Toast Notification Container */}
      <Toaster position="bottom-right" richColors />
      </body>
      </html>
  );
}