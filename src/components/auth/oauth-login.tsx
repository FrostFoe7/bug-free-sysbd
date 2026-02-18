"use client";

import React from "react";
import { useSignIn } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { catchClerkError } from "@/lib/utils";

const OAuthLogin: React.FC = ({}) => {
  const [isLoading, setIsLoading] = React.useState<string | null>(null);
  const { signIn, isLoaded: signInLoaded } = useSignIn();

  async function oauthSignIn(provider: "google" | "github") {
    if (!signInLoaded) return null;
    try {
      setIsLoading(provider);
      await signIn.authenticateWithRedirect({
        strategy: provider === "google" ? "oauth_google" : "oauth_github",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
      });
    } catch (error) {
      setIsLoading(null);
      catchClerkError(error);
    }
  }
  return (
    <div className="flex flex-col gap-3">
      <Button
        aria-label={`Continue with Google`}
        variant="outline"
        className="flex h-16 w-full transform cursor-pointer select-none items-center justify-center rounded-xl border-[#333333] bg-transparent px-3 py-5 text-base text-white transition-transform hover:bg-transparent hover:text-white active:scale-95"
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
        className="flex h-16 w-full transform cursor-pointer select-none items-center justify-center rounded-xl border-[#333333] bg-transparent px-3 py-5 text-base text-white transition-transform hover:bg-transparent hover:text-white active:scale-95"
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
