"use client";

import useWindow from "@/hooks/use-window";
import React from "react";
import { Icons } from "@/components/icons";
import Image from "next/image";

export default function ThreadsBanner() {
  const { isMobile } = useWindow();
  return (
    <header className="mx-auto  max-w-(--breakpoint-md) md:max-w-(--breakpoint-2xl) lg:max-w-[1800px]">
      {isMobile ? (
        <div className="flex items-center justify-center ">
          <Icons.logo className="mb-6 mt-16 h-10 w-10 sm:h-16 sm:w-16" />
        </div>
      ) : (
        <nav className="pointer-events-none z-50 flex w-full select-none items-center justify-between">
          <Image
            width={1000}
            height={1000}
            src="/bg.webp"
            alt="Background"
            className="h-[500px] w-full object-cover"
            unoptimized
            priority
          />
        </nav>
      )}
    </header>
  );
}
