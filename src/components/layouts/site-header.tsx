"use client";

import React from "react";
import Navigation from "@/components/navigations";
import useWindow from "@/hooks/use-window";
import { cn } from "@/lib/utils";
import Link from "next/link";
import NavigationMenu from "@/components/menus/navigation-menu";
import Image from "next/image";

export default function SiteHeader() {
  const { isMobile } = useWindow();
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const changeBgColor = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", changeBgColor);
    return () => window.removeEventListener("scroll", changeBgColor);
  }, []);

  return (
    <header
      aria-label="Header"
      className={cn(
        "sticky top-0 z-100 w-full",
        isScrolled
          ? "bg-background backdrop-blur-2xl dark:bg-[#101010D9]"
          : "bg-transparent",
      )}
    >
      <nav className="px-4 sm:container sm:max-w-[1250px]">
        <div className="relative z-50 flex h-full max-h-[60px] w-full items-center justify-between py-1 sm:max-h-full">
          <Link
            href={"/"}
            className="z-50 flex w-full transform cursor-pointer items-center justify-center gap-2.5 py-4 text-2xl font-semibold tracking-wide transition-all duration-150 ease-out hover:scale-105 active:scale-95 sm:w-fit"
          >
            <Image
              src="/logo.png"
              alt="Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </Link>
          <div className="hidden w-full max-w-[480px] items-center justify-between sm:flex">
            <Navigation />
          </div>
          {isMobile ? (
            <div className="absolute top-2/4 right-0 z-999 -translate-y-2/4">
              <NavigationMenu />
            </div>
          ) : (
            <NavigationMenu />
          )}
        </div>
      </nav>
    </header>
  );
}
