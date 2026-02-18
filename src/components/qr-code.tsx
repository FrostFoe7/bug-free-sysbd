"use client";

import React from "react";
import useWindow from "@/hooks/use-window";
import QRCodeSvg from "@/components/qr-code-svg";
import { Zoom } from "@/components/zoom";

export default function QRcode() {
  const { isMobile } = useWindow();
  return isMobile ? null : (
    <div className="fixed bottom-2 right-2 z-50 flex scale-75 flex-col items-center justify-center gap-5 lg:bottom-10  lg:right-10 lg:scale-100">
      <span className="text-[13px] tracking-wide text-[#777777]">
        Scan to get the code
      </span>
      <div className="transform select-none transition-transform hover:scale-105 active:scale-95 ">
        <Zoom>
          <QRCodeSvg className=" z-50 h-[175px]  w-[175px] cursor-pointer rounded-2xl border border-[#393939] bg-[#181818] p-1 " />
        </Zoom>
      </div>
    </div>
  );
}
