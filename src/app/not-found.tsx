"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <div className="flex h-[80vh] flex-col justify-between ">
        <div className="flex grow flex-col items-center justify-center gap-4 px-4 ">
          <h4 className="scroll-m-20 text-[16px] font-bold tracking-normal">
            Sorry, this page isn&#39;t available
          </h4>
          <span className="w-full max-w-[350px] text-center text-[15px] text-[#777777]">
            The link you followed may be broken, or the page may have been
            removed.
          </span>
          <Button
            asChild
            className="rounded-xl px-4 hover:bg-transparent active:scale-90"
            variant={"outline"}
            size={"sm"}
          >
            <Link href={"/"}>Back</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
