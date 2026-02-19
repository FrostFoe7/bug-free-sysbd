"use client";

import React from "react";
import { useImageStore } from "@/store/image";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface PostImageCardProps {
  images: string[] | undefined;
}

const PostImageCard: React.FC<PostImageCardProps> = ({ images }) => {
  const { setImageUrl } = useImageStore();

  if (!images || images.length === 0) return null;

  return (
    <Carousel className="mt-2.5 w-full">
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <div
              className="border-border relative cursor-pointer overflow-hidden rounded-[12px] border"
              onClick={() => {
                setImageUrl(image);
              }}
            >
              <Image
                loading="lazy"
                src={image ?? ""}
                width={630}
                height={630}
                alt="Will add alt-text soon!"
                className="aspect-square w-full rounded-[12px] object-cover"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {images.length > 1 && (
        <>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </>
      )}
    </Carousel>
  );
};

export default PostImageCard;
