"use client";

import React from "react";
import { useSupabaseAuth } from "@/components/providers/supabase-provider";
import { Icons } from "@/components/icons";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function NavigationMenu() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { signOut } = useSupabaseAuth();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div>
            <Icons.menu className="text-secondary hover:text-foreground active:text-foreground h-[22px] w-[22px] transform cursor-pointer transition-all duration-150 ease-out hover:scale-100 active:scale-90" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="bg-background z-999 mt-1 w-[185px] rounded-2xl p-0 shadow-xl dark:bg-[#181818]"
        >
          <DropdownMenuItem
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="active:bg-primary-foreground cursor-pointer rounded-none px-4 py-3 text-[15px] font-semibold tracking-normal select-none focus:bg-transparent"
          >
            Switch appearance
          </DropdownMenuItem>
          <DropdownMenuSeparator className="my-0 h-[1.2px]" />
          <DropdownMenuItem className="active:bg-primary-foreground cursor-pointer rounded-none px-4 py-3 text-[15px] font-semibold tracking-normal select-none focus:bg-transparent">
            About
          </DropdownMenuItem>
          <DropdownMenuSeparator className="my-0 h-[1.2px]" />
          <DropdownMenuItem className="active:bg-primary-foreground cursor-pointer rounded-none px-4 py-3 text-[15px] font-semibold tracking-normal select-none focus:bg-transparent">
            Report a problem
          </DropdownMenuItem>
          <DropdownMenuSeparator className="my-0 h-[1.2px]" />
          <DropdownMenuItem className="active:bg-primary-foreground cursor-pointer rounded-none px-4 py-3 text-[15px] font-semibold tracking-normal select-none focus:bg-transparent">
            <div
              aria-label="Log out"
              onClick={async () => {
                await signOut();
                router.push("/");
              }}
            >
              Log out
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
