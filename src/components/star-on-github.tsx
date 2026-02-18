import React from "react";
import { Icons } from "@/components/icons";

export default function StarOnGithub() {
  return (
    <a href="https://github.com/sujjeee/threads-clone" target="_blank">
      <div className="hidden min-w-32 transform  cursor-pointer select-none rounded-full border border-border bg-transparent p-1 px-6 py-4 text-[14px] font-medium tracking-wide text-muted-foreground shadow-lg transition-all duration-150 ease-out hover:scale-105 active:scale-95 xl:flex">
        <span className="flex items-center justify-center">
          <Icons.gitHub className="mr-2 h-4 w-4" />
          Star on Github
        </span>
      </div>
    </a>
  );
}
