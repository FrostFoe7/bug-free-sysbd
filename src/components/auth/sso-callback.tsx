"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Icons } from "@/components/icons";

export default function SSOCallback() {
  const router = useRouter();

  React.useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    
    // Check if there's a hash in the URL (OAuth callback)
    const hash = window.location.hash;
    if (hash) {
      // Supabase will automatically handle the session from the hash
      // Just wait for the session to be established and redirect
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === "SIGNED_IN" && session) {
          router.push("/");
        }
      });
      
      return () => subscription.unsubscribe();
    }
    
    // If no hash, just redirect to home
    router.push("/");
  }, [router]);

  return (
    <div
      role="status"
      aria-label="Loading"
      aria-describedby="loading-description"
      className="flex items-center justify-center"
    >
      <Icons.spinner className="h-16 w-16 animate-spin" aria-hidden="true" />
    </div>
  );
}
