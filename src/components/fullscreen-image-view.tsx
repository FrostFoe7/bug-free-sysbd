"use client";

import { useImageStore } from "@/store/image";
import { X } from "lucide-react";
import Image from "next/image";
import React from "react";

const FullscreenImageView: React.FC = ({}) => {
  const { imageUrl, setImageUrl } = useImageStore();

  return (
    imageUrl && (
      <div className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-bottom-full data-[state=open]:slide-in-from-bottom-full fixed inset-0 z-150 bg-black">
        <span
          onClick={() => setImageUrl("")}
          className="absolute top-5 left-5 cursor-pointer rounded-full bg-[#181818] p-1 text-[1.2rem] font-thin text-[#525151] md:p-2 md:text-[1.5rem]"
        >
          <X className="h-8 w-8" />
        </span>
        <div className="fixed inset-0 z-999 flex items-center justify-center p-4">
          <Image
            width={630}
            height={630}
            src={imageUrl}
            alt="Image with full screen view"
            className="h-full w-full max-w-full max-h-full object-contain"
            style={{ width: "auto", height: "auto" }}
          />
        </div>
      </div>
    )
  );
};

export default FullscreenImageView;
