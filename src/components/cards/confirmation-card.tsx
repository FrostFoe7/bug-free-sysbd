"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDelete,
  AlertDialogTrigger,
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
            <Icons.loading className="h-8 w-8 " />
          </div>
          Deleting...
        </div>
      ),
      success: () => {
        return (
          <div className="flex w-[270px] items-center justify-between p-0 ">
            <div className="flex items-center justify-center gap-1.5">
              <Check className="h-5 w-5 " />
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
      <AlertDialogTrigger className="w-full cursor-pointer select-none rounded-none px-4 py-3 text-start text-[15px] font-bold tracking-normal text-red-700   focus:bg-transparent focus:text-red-700 active:bg-primary-foreground">
        Delete
      </AlertDialogTrigger>
      <AlertDialogContent className="w-full max-w-[280px] gap-0 overflow-hidden rounded-2xl border-border bg-background p-0 shadow-xl dark:bg-[#181818]">
        <div className="flex w-full items-center justify-center border-b border-border py-5 text-[16px] font-bold">
          Are you sure?
        </div>
        <div className="flex items-center justify-center">
          <AlertDialogClose className=" mt-0 flex w-full cursor-pointer select-none items-center justify-center rounded-none border-r border-border px-4 py-4 text-[15px] font-semibold tracking-normal focus:bg-transparent  active:bg-primary-foreground">
            Cancel
          </AlertDialogClose>
          <AlertDialogDelete
            onClick={handleDeletePost}
            className="mt-0 flex w-full cursor-pointer select-none items-center justify-center rounded-none border-border px-4 py-4 text-[15px] font-semibold tracking-normal text-red-600  focus:bg-transparent   active:bg-primary-foreground"
          >
            Delete
          </AlertDialogDelete>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default ConfirmationCard;
