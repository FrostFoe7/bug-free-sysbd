"use client";

import React from "react";
import Navigation from "@/components/navigations";

export default function MobileNavbar() {
  return (
    <div className="bg-background fixed bottom-0 left-0 z-50 h-16 w-full backdrop-blur-2xl sm:hidden dark:bg-[#101010D9]">
      <div className="mx-auto grid h-full w-full grid-cols-5">
        <Navigation />
      </div>
    </div>
  );
}
