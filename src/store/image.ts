import { create } from "zustand";

type ImageStore = {
  images: string[];
  currentIndex: number;
  setImages: (urls: string[], index?: number) => void;
  setImageIndex: (index: number) => void;
};

export const useImageStore = create<ImageStore>((set) => ({
  images: [],
  currentIndex: 0,
  setImages: (urls, index = 0) => set({ images: urls, currentIndex: index }),
  setImageIndex: (index) => set({ currentIndex: index }),
}));
