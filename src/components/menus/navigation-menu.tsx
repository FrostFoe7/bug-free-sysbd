"use client";

import React from "react";
import { useClerk } from "@clerk/nextjs";
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
  const { signOut } = useClerk();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div>
            <Icons.menu className="h-[22px] w-[22px] transform cursor-pointer text-secondary transition-all duration-150 ease-out hover:scale-100 hover:text-foreground active:scale-90 active:text-foreground" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="z-999 mt-1 w-[185px] rounded-2xl bg-background p-0 shadow-xl dark:bg-[#181818]"
        >
          <DropdownMenuItem
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="cursor-pointer select-none rounded-none px-4 py-3 text-[15px] font-semibold tracking-normal focus:bg-transparent active:bg-primary-foreground"
          >
            Switch appearance
          </DropdownMenuItem>
          <DropdownMenuSeparator className="my-0 h-[1.2px]" />
          <DropdownMenuItem className="cursor-pointer select-none rounded-none px-4 py-3 text-[15px] font-semibold tracking-normal  focus:bg-transparent  active:bg-primary-foreground">
            About
          </DropdownMenuItem>
          <DropdownMenuSeparator className=" my-0 h-[1.2px]" />
          <DropdownMenuItem className="cursor-pointer select-none rounded-none px-4 py-3 text-[15px] font-semibold tracking-normal focus:bg-transparent active:bg-primary-foreground">
            Report a problem
          </DropdownMenuItem>
          <DropdownMenuSeparator className="my-0 h-[1.2px]" />
          <DropdownMenuItem className="cursor-pointer select-none rounded-none px-4 py-3 text-[15px] font-semibold tracking-normal  focus:bg-transparent active:bg-primary-foreground">
            <div
              aria-label="Log out"
              onClick={() => signOut(() => router.push("/"))}
            >
              Log out
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
