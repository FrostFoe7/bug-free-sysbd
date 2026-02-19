"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDelete,
  AlertDialogTrigger,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { Icons } from "@/components/icons";
import { Check } from "lucide-react";

interface ConfirmationCardProps {
  id: string;
}

const ConfirmationCard: React.FC<ConfirmationCardProps> = ({ id }) => {
  const path = usePathname();

  const trpcUtils = api.useUtils();

  const { mutateAsync: deletePost } = api.post.deletePost.useMutation({
    onError: () => {
      toast.error("DeleteError: Something went wrong!");
    },
    onSettled: async () => {
      if (path === "/") {
        await trpcUtils.post.getInfinitePost.invalidate();
      }
      await trpcUtils.invalidate();
    },
  });

  function handleDeletePost() {
    const promise = deletePost({ id });

    toast.promise(promise, {
      loading: (
        <div className="flex w-[270px] items-center justify-start gap-1.5 p-0">
          <div>
            <Icons.loading className="h-8 w-8" />
          </div>
          Deleting...
        </div>
      ),
      success: () => {
        return (
          <div className="flex w-[270px] items-center justify-between p-0">
            <div className="flex items-center justify-center gap-1.5">
              <Check className="h-5 w-5" />
              Deleted
            </div>
          </div>
        );
      },
      error: "Error",
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger className="active:bg-primary-foreground w-full cursor-pointer rounded-none px-4 py-3 text-start text-[15px] font-bold tracking-normal text-red-700 select-none focus:bg-transparent focus:text-red-700">
        Delete
      </AlertDialogTrigger>
      <AlertDialogContent className="border-border bg-background w-full max-w-[280px] gap-0 overflow-hidden rounded-2xl p-0 shadow-xl dark:bg-[#181818]">
        <AlertDialogTitle asChild>
          <div className="border-border flex w-full items-center justify-center border-b py-5 text-[16px] font-bold">
            Are you sure?
          </div>
        </AlertDialogTitle>
        <div className="flex items-center justify-center">
          <AlertDialogClose className="border-border active:bg-primary-foreground mt-0 flex w-full cursor-pointer items-center justify-center rounded-none border-r px-4 py-4 text-[15px] font-semibold tracking-normal select-none focus:bg-transparent">
            Cancel
          </AlertDialogClose>
          <AlertDialogDelete
            onClick={handleDeletePost}
            className="border-border active:bg-primary-foreground mt-0 flex w-full cursor-pointer items-center justify-center rounded-none px-4 py-4 text-[15px] font-semibold tracking-normal text-red-600 select-none focus:bg-transparent"
          >
            Delete
          </AlertDialogDelete>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default ConfirmationCard;
