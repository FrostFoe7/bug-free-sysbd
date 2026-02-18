"use client";

import { Toaster as RadToaster } from "sonner";

export function Toaster() {
  return (
    <RadToaster
      className="rounded-x flex max-h-10 w-max max-w-sm items-center justify-center px-2"
      position="bottom-center"
      toastOptions={{
        style: {
          maxHeight: "50px",
          height: "fit-content",
          width: "max-content",
          fontWeight: 600,
          fontSize: 15,
        },
      }}
    />
  );
}
