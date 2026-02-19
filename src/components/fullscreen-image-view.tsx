"use client";

import { useImageStore } from "@/store/image";
import { X } from "lucide-react";
import Image from "next/image";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const FullscreenImageView: React.FC = ({}) => {
  const { images, currentIndex, setImages, setImageIndex } = useImageStore();

  const handlePrevious = () => {
    setImageIndex(currentIndex > 0 ? currentIndex - 1 : images.length - 1);
  };

  const handleNext = () => {
    setImageIndex(currentIndex < images.length - 1 ? currentIndex + 1 : 0);
  };

  return (
    images.length > 0 && (
      <div className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-bottom-full data-[state=open]:slide-in-from-bottom-full fixed inset-0 z-150 bg-black">
        <span
          onClick={() => setImages([])}
          className="absolute top-5 left-5 z-50 cursor-pointer rounded-full bg-[#181818] p-1 text-[1.2rem] font-thin text-[#525151] md:p-2 md:text-[1.5rem]"
        >
          <X className="h-8 w-8" />
        </span>
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <Carousel className="w-full max-w-5xl" opts={{ startIndex: currentIndex }}>
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="flex items-center justify-center">
                    <Image
                      width={630}
                      height={630}
                      src={image}
                      alt="Image with full screen view"
                      className="h-full w-full max-h-[80vh] object-contain"
                      style={{ width: "auto", height: "auto" }}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {images.length > 1 && (
              <>
                <CarouselPrevious className="left-2" onClick={handlePrevious} />
                <CarouselNext className="right-2" onClick={handleNext} />
              </>
            )}
          </Carousel>
        </div>
      </div>
    )
  );
};

export default FullscreenImageView;
