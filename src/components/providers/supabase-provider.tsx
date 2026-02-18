"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createBrowserClient, type CookieOptions } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";

type SupabaseContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
};

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          try {
            return document.cookie.match(new RegExp(`(^|;\\s*)(${name})=([^;]*)`))?.[3] ?? "";
          } catch {
            return "";
          }
        },
        set(name: string, value: string, _options: CookieOptions) {
          try {
            document.cookie = `${name}=${value}; path=/; ${_options.secure ? "secure;" : ""} ${_options.sameSite ? `samesite=${_options.sameSite};` : ""}`;
          } catch {
            // Ignore errors in cookie setting
          }
        },
        remove(name: string, _options: CookieOptions) {
          try {
            document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
          } catch {
            // Ignore errors in cookie removal
          }
        },
      },
    },
  );

  useEffect(() => {
    // Get initial session
    void supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error as Error | null };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <SupabaseContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabaseAuth() {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error("useSupabaseAuth must be used within a SupabaseProvider");
  }
  return context;
}
