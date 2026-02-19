import { Icons } from "@/components/icons";
import React from "react";

export default function Loading() {
  return (
    <div
      suppressHydrationWarning
      className="flex h-[80vh] w-full items-center justify-center"
    >
      <Icons.loading className="h-11 w-11" />
    </div>
  );
}
