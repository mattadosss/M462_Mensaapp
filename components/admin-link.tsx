"use client"

import * as React from "react"
import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/utils/supabase/client"

export function AdminLink() {
  const [isAdmin, setIsAdmin] = useState(false);
  const supabase = createClient();

  React.useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.role === 'admin') {
        setIsAdmin(true);
      }
    };
    checkAdminStatus();
  }, []);

  if (!isAdmin) return null;

  return (
    <Link href="/admin" className="flex flex-col items-center text-xs">
      <span className="text-lg">👑</span>
      <span>Admin</span>
    </Link>
  );
} 