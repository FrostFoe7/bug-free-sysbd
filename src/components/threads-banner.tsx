"use client";

import useWindow from "@/hooks/use-window";
import React from "react";
import Image from "next/image";

export default function ThreadsBanner() {
  const { isMobile } = useWindow();
  return (
    <header className="mx-auto max-w-(--breakpoint-md) md:max-w-(--breakpoint-2xl) lg:max-w-[1800px]">
      {isMobile ? (
        <div className="flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={64}
            height={64}
            className="mt-16 mb-6 object-contain sm:h-16 sm:w-16"
          />
        </div>
      ) : (
        <nav className="pointer-events-none z-50 flex w-full items-center justify-between select-none">
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
