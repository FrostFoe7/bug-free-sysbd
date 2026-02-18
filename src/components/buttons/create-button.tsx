"use client";

import React from "react";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const CreateButton: React.FC = ({}) => {
  const path = usePathname();
  return (
    <div className="hover:bg-primary flex w-full transform items-center justify-center rounded-lg p-4 transition-all duration-150 ease-out hover:scale-100 active:scale-90 sm:px-[34px] sm:py-5">
      <Icons.create
        className={cn(
          "h-6 w-6",
          path === "/create" ? "text-forground" : "text-secondary",
        )}
      />
    </div>
  );
};

export default CreateButton;
