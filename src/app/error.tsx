"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Error() {
  return (
    <div className="flex h-[80vh] flex-col justify-between">
      <div className="flex grow flex-col items-center justify-center gap-4 px-4">
        <h4 className="scroll-m-20 text-[16px] font-bold tracking-normal">
          Sorry, something went wrong!
        </h4>
        <Button
          asChild
          className="rounded-xl px-4 hover:bg-transparent active:scale-95"
          variant={"outline"}
          size={"sm"}
        >
          <Link href={"/"}>Back</Link>
        </Button>
      </div>
    </div>
  );
}
