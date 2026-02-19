"use client";

import React from "react";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { usePathname, useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import useFileStore from "@/store/fileStore";
import usePost from "@/store/post";
import PostPrivacyMenu from "@/components/menus/post-privacy-menu";
import CreatePostInput from "@/components/create-post-input";
import Link from "next/link";
import { Check } from "lucide-react";
import { uploadFile } from "@/lib/supabase/storage";
import type { FileWithPreview } from "@/store/fileStore";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import useDialog from "@/store/dialog";
import CreateButton from "@/components/buttons/create-button";

const CreatePostCard: React.FC = ({}) => {
  const router = useRouter();
  const path = usePathname();

  const {
    openDialog,
    setOpenDialog,
    replyPostInfo,
    setReplyPostInfo,
    quoteInfo,
    setQuoteInfo,
  } = useDialog();

  const { selectedFiles, setSelectedFiles, clearFiles, isSelectedImageSafe } = useFileStore();

  const { postPrivacy } = usePost();

  const [isUploading, setIsUploading] = React.useState(false);

  const [threadData, setThreadData] = React.useState({
    privacy: postPrivacy,
    text: "",
  });

  React.useEffect(() => {
    setThreadData((prevThreadData) => ({
      ...prevThreadData,
      privacy: postPrivacy,
    }));
  }, [postPrivacy]);

  const trpcUtils = api.useUtils();

  const { isPending: isLoading, mutateAsync: createThread } =
    api.post.createPost.useMutation({
      onMutate: ({}) => {
        setThreadData({
          ...threadData,
          text: "",
        });
        // TODO: Add new optimistic update, old one is not working
      },
      onError: () => {
        toast.error("PostingError: Something went wrong!");
      },
      onSettled: async () => {
        await trpcUtils.post.getInfinitePost.invalidate();
      },
      retry: false,
    });

  const { isPending: isReplying, mutateAsync: replyToPost } =
    api.post.replyToPost.useMutation({
      onError: (err) => {
        toast.error("ReplyingError: Something went wrong!");
        if (err.data?.code === "UNAUTHORIZED") {
          router.push("/login");
        }
      },
      onSettled: async () => {
        if (path === "/") {
          await trpcUtils.post.getInfinitePost.invalidate();
        }
        await trpcUtils.invalidate();
      },
      retry: false,
    });

  async function handleMutation() {
    let imageUrls: string[] = [];

    if (selectedFiles && selectedFiles.length > 0) {
      setIsUploading(true);
      try {
        imageUrls = await Promise.all(
          selectedFiles.map((file) => uploadFile(file, "threads-images")),
        );
      } catch (error) {
        toast.error("Upload failed");
        setIsUploading(false);
        throw error;
      }
      setIsUploading(false);
    }

    const promise = replyPostInfo
      ? replyToPost({
          text: JSON.stringify(threadData.text, null, 2),
          postId: replyPostInfo.id,
          imageUrls: imageUrls,
          privacy: threadData.privacy,
          postAuthor: replyPostInfo.author.id,
        })
      : createThread({
          text: JSON.stringify(threadData.text, null, 2),
          imageUrls: imageUrls,
          privacy: threadData.privacy,
          quoteId: quoteInfo?.id,
          postAuthor: quoteInfo?.author.id,
        });

    return promise;
  }

  function handleCreateThread() {
    setOpenDialog(false);
    const promise = handleMutation();

    toast.promise(promise, {
      loading: (
        <div className="flex w-[270px] items-center justify-start gap-1.5 p-0">
          <div>
            <Icons.loading className="h-8 w-8" />
          </div>
          Posting...
        </div>
      ),
      success: (data) => {
        return (
          <div className="flex w-[270px] items-center justify-between p-0">
            <div className="flex items-center justify-center gap-1.5">
              <Check className="h-5 w-5" />
              Posted
            </div>
            <Link
              href={`/${data?.createPost.author.username}/post/${data?.createPost.id}`}
              className="hover:text-blue-900"
            >
              View
            </Link>
          </div>
        );
      },
      error: "Error",
    });
  }

  const handleFieldChange = (textValue: string) => {
    setThreadData({
      ...threadData,
      text: textValue,
    });
  };

  React.useEffect(() => {
    if (!openDialog) {
      setThreadData({
        privacy: postPrivacy,
        text: "",
      });
      clearFiles();
      setReplyPostInfo(null);
      setQuoteInfo(null);
    }
  }, [
    openDialog,
    postPrivacy,
    clearFiles,
    setReplyPostInfo,
    setQuoteInfo,
  ]);

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger>
        <CreateButton />
      </DialogTrigger>
      <DialogContent className="w-full max-w-lg border-none bg-transparent shadow-none outline-hidden select-none sm:max-w-[668px]">
        <DialogTitle asChild>
          <h1 className="mb-2 w-full text-center font-bold text-white">
            {replyPostInfo ? <>Reply</> : <>New thread</>}
          </h1>
        </DialogTitle>
        <Card className="bg-background rounded-2xl border-none shadow-2xl ring-1 ring-[#393939] ring-offset-0 dark:bg-[#181818]">
          <div className="no-scrollbar min-h-[30vh] max-h-[70vh] overflow-y-auto p-6">
            {replyPostInfo && (
              <CreatePostInput
                isOpen={openDialog}
                onTextareaChange={handleFieldChange}
                replyThreadInfo={replyPostInfo}
              />
            )}
            <CreatePostInput
              isOpen={openDialog}
              onTextareaChange={handleFieldChange}
              quoteInfo={quoteInfo}
            />
          </div>
          <div className="flex w-full items-center justify-between p-6">
            <PostPrivacyMenu />
            <Button
              size={"sm"}
              onClick={handleCreateThread}
              disabled={
                !isSelectedImageSafe ||
                threadData.text === "" ||
                isLoading ||
                isReplying ||
                isUploading
              }
              className="bg-foreground hover:bg-foreground rounded-full px-4 font-semibold text-white select-none dark:text-black"
            >
              {(isLoading || isReplying || isUploading) && (
                <Icons.spinner
                  className="mr-2 h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Post
              <span className="sr-only">Post</span>
            </Button>
          </div>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostCard;
