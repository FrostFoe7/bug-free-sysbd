"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { createBrowserClient } from "@supabase/ssr";

const OAuthLogin: React.FC = ({}) => {
  const [isLoading, setIsLoading] = React.useState<string | null>(null);

  async function oauthSignIn(provider: "google" | "github") {
    try {
      setIsLoading(provider);
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      );
      await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
    } catch (error) {
      setIsLoading(null);
      console.error(error);
    }
  }
  return (
    <div className="flex flex-col gap-3">
      <Button
        aria-label={`Continue with Google`}
        variant="outline"
        className="flex h-16 w-full transform cursor-pointer items-center justify-center rounded-xl border-[#333333] bg-transparent px-3 py-5 text-base text-white transition-transform select-none hover:bg-transparent hover:text-white active:scale-95"
        onClick={() => void oauthSignIn("google")}
        disabled={isLoading !== null}
      >
        {isLoading === "google" ? (
          <Icons.spinner
            className="mr-2 h-4 w-4 animate-spin"
            aria-hidden="true"
          />
        ) : (
          <Icons.googleColor className="mr-2 h-4 w-4" aria-hidden="true" />
        )}
        Continue with Google
      </Button>
      <Button
        aria-label={`Continue with GitHub`}
        variant="outline"
        className="flex h-16 w-full transform cursor-pointer items-center justify-center rounded-xl border-[#333333] bg-transparent px-3 py-5 text-base text-white transition-transform select-none hover:bg-transparent hover:text-white active:scale-95"
        onClick={() => void oauthSignIn("github")}
        disabled={isLoading !== null}
      >
        {isLoading === "github" ? (
          <Icons.spinner
            className="mr-2 h-4 w-4 animate-spin"
            aria-hidden="true"
          />
        ) : (
          <Icons.gitHub className="mr-2 h-4 w-4" aria-hidden="true" />
        )}
        Continue with GitHub
      </Button>
    </div>
  );
};

export default OAuthLogin;
