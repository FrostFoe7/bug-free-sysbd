"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import CreatePostCard from "@/components/cards/create-post-card";
import { useSupabaseAuth } from "@/components/providers/supabase-provider";

export default function Navigation() {
  const { user } = useSupabaseAuth();
  const path = usePathname();

  return (
    <>
      <Link
        href={"/"}
        className="hover:bg-primary flex w-full transform items-center justify-center rounded-lg p-4 transition-all duration-150 ease-out hover:scale-100 active:scale-90 sm:px-8 sm:py-5"
      >
        <Icons.home
          className={cn(
            "h-[26px] w-[26px] text-lg",
            path === "/" ? "text-foreground" : "text-secondary",
          )}
          stroke="red"
          fill={path === "/" ? "currentColor" : "transparent"}
        />
      </Link>
      <Link
        href={"/search"}
        className="hover:bg-primary flex w-full transform items-center justify-center rounded-lg p-4 transition-all duration-150 ease-out hover:scale-100 active:scale-90 sm:px-8 sm:py-5"
      >
        <Icons.search
          className={cn(
            "h-6 w-6 text-lg",
            path === "/search" ? "text-foreground" : "text-secondary",
          )}
        />
      </Link>
      <CreatePostCard />
      <Link
        href={"/activity"}
        className="hover:bg-primary flex w-full transform items-center justify-center rounded-lg p-4 transition-all duration-150 ease-out hover:scale-100 active:scale-90 sm:px-8 sm:py-5"
      >
        <Icons.activity
          className={cn(
            "h-[26px] w-[26px]",
            path === "/activity" ? "text-foreground" : "text-secondary",
          )}
          fill={path === "/activity" ? "currentColor" : "transparent"}
        />
      </Link>
      <Link
        href={`/@${user?.user_metadata?.username || user?.email?.split("@")[0]}`}
        className="hover:bg-primary flex w-full transform items-center justify-center rounded-lg p-4 transition-all duration-150 ease-out hover:scale-100 active:scale-90 sm:px-8 sm:py-5"
      >
        <Icons.profile
          className={cn(
            "h-[26px] w-[26px]",
            path.match(/^\/@\w+$/) ? "text-foreground" : "text-secondary",
          )}
          fill={path.match(/^\/@\w+$/) ? "currentColor" : "transparent"}
        />
      </Link>
    </>
  );
}
