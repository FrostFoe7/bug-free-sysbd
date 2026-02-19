import { create } from "zustand";

export interface FileWithPreview extends File {
  preview: string;
}

// Define the state type
type FileStoreState = {
  selectedFiles: FileWithPreview[];
  isSelectedImageSafe: boolean;
};

// Define the actions type
type FileStoreActions = {
  setIsSelectedImageSafe: (isSafe: boolean) => void;
  setSelectedFiles: (files: FileWithPreview[]) => void;
  addFiles: (files: FileWithPreview[]) => void;
  removeFile: (index: number) => void;
  clearFiles: () => void;
};

const useFileStore = create<FileStoreState & FileStoreActions>((set) => ({
  selectedFiles: [],
  isSelectedImageSafe: true,
  setSelectedFiles: (files) => set({ selectedFiles: files }),
  addFiles: (files) =>
    set((state) => ({
      selectedFiles: [...state.selectedFiles, ...files].slice(0, 4),
    })),
  removeFile: (index) =>
    set((state) => ({
      selectedFiles: state.selectedFiles.filter((_, i) => i !== index),
    })),
  clearFiles: () => set({ selectedFiles: [] }),
  setIsSelectedImageSafe: (isSafe) => set({ isSelectedImageSafe: isSafe }),
}));

export default useFileStore;
