"use client";

import React from "react";
import useFileStore from "@/store/fileStore";
import { X } from "lucide-react";
import Username from "@/components/user/user-username";
import { ResizeTextarea } from "@/components/ui/resize-textarea";
import { cn } from "@/lib/utils";
import UserAvatar from "@/components/user/user-avatar";
import { useSupabaseAuth } from "@/components/providers/supabase-provider";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import type { ParentPostInfo } from "@/types";
import PostQuoteCard from "@/components/cards/post-quote-card";
import PostImageCard from "@/components/cards/post-image-card";
import { useDropzone, type Accept } from "react-dropzone";
import Image from "next/image";

interface CreatePostInputProps {
  isOpen: boolean;
  replyThreadInfo?: ParentPostInfo | null;
  onTextareaChange: (textValue: string) => void;
  quoteInfo?:
    | (Pick<ParentPostInfo, "id" | "text" | "author"> & { createdAt?: Date })
    | null;
}

const maxSize = 4 * 1024 * 1024;

const CreatePostInput: React.FC<CreatePostInputProps> = ({
  isOpen,
  replyThreadInfo,
  onTextareaChange,
  quoteInfo,
}) => {
  const { user } = useSupabaseAuth();
  const { setSelectedFile } = useFileStore();

  const [inputValue, setInputValue] = React.useState("");

  const handleResizeTextareaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    onTextareaChange(newValue);
  };

  const [previewURL, setPreviewURL] = React.useState<string | undefined>(
    undefined,
  );

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      const acceptedFile = acceptedFiles[0];

      if (!acceptedFile) {
        alert("Selected image is too large!");
        return;
      }

      const previewURL = URL.createObjectURL(acceptedFile);
      setPreviewURL(previewURL);

      setSelectedFile(acceptedFiles);
    },
    [setSelectedFile],
  );

  const accept: Accept = {
    "image/*": [],
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept,
    maxSize,
  });

  const scrollDownRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    scrollDownRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  }, [isOpen]);

  return (
    <div
      className={cn("flex space-x-3", {
        "mt-1": !replyThreadInfo,
      })}
    >
      <div className="relative flex flex-col items-center">
        {replyThreadInfo ? (
          <UserAvatar
            image={replyThreadInfo.author.image}
            username={replyThreadInfo.author.username}
            fullname={replyThreadInfo.author.fullname}
          />
        ) : (
          <UserAvatar
            image={
              (user?.user_metadata?.avatar_url as string) ?? user?.email ?? ""
            }
            username={(user?.user_metadata?.username as string) ?? ""}
            fullname={(user?.user_metadata?.full_name as string) ?? ""}
          />
        )}

        {replyThreadInfo?.text && (
          <div className="my-1 mt-1.5 h-full w-0.5 rounded-full bg-[#D8D8D8] dark:bg-[#313639]" />
        )}
      </div>

      <div className="flex w-full flex-col gap-1.5 pb-4">
        {replyThreadInfo ? (
          <div className="flex">
            <Username author={replyThreadInfo?.author} />

            {/* TODO: This is temp solution to maintain layout */}
            <div className="invisible h-3 w-3">
              <Icons.verified className="h-3 w-3" />
            </div>
          </div>
        ) : (
          <span className="text-[15px] leading-none font-medium tracking-normal">
            {user?.user_metadata?.username || user?.email?.split("@")[0]}
          </span>
        )}

        {replyThreadInfo ? (
          <>
            <div className="text-accent-foreground w-full grow resize-none overflow-hidden text-[15px] tracking-normal wrap-break-word whitespace-pre-line outline-hidden placeholder:text-[#777777]">
              <div
                dangerouslySetInnerHTML={{
                  __html: replyThreadInfo.text
                    .slice(1, -1)
                    .replace(/\\n/g, "\n"),
                }}
              />
            </div>
            {replyThreadInfo?.images && replyThreadInfo?.images?.length > 0 && (
              <PostImageCard image={replyThreadInfo.images[0]} />
            )}
          </>
        ) : (
          <>
            <ResizeTextarea
              name="text"
              value={inputValue}
              onChange={handleResizeTextareaChange}
              placeholder="Start a thread..."
              maxLength={200}
            />
            {previewURL && (
              <div className="border-border relative w-fit overflow-hidden rounded-[12px] border">
                <Image
                  src={previewURL}
                  alt="Preview"
                  width={1000}
                  height={1000}
                  unoptimized
                  className="max-h-[520px] max-w-full rounded-[12px] object-contain"
                />
                {/* TODO: Do this check on server side !*/}
                {/* {!isSafeImage &&
                                    <div className='absolute top-0 left-0 w-full h-full backdrop-blur-xl flex justify-center items-center'>
                                        <EyeOff className='h-8 w-8 text-[#3b3b3b]' />
                                    </div>
                                } */}
                <Button
                  onClick={() => {
                    // setIsSafeImage(true)
                    setSelectedFile([]);
                    setPreviewURL("");
                  }}
                  variant={"ghost"}
                  className="bg-background absolute top-2 right-2 z-50 h-6 w-6 transform cursor-pointer rounded-full p-1 transition-transform active:scale-75"
                >
                  <X />
                </Button>
              </div>
            )}
          </>
        )}

        {!replyThreadInfo?.text && (
          <div
            {...getRootProps()}
            ref={scrollDownRef}
            className="mt-1 w-fit space-y-2 select-none"
          >
            <div className="flex items-center gap-1 text-[15px] text-[#777777] select-none">
              <input {...getInputProps()} />
              <Icons.image className="h-5 w-5 transform cursor-pointer transition-transform select-none active:scale-75" />
            </div>
          </div>
        )}

        {quoteInfo && (
          <PostQuoteCard {...quoteInfo} createdAt={quoteInfo.createdAt} />
        )}
      </div>
    </div>
  );
};

export default CreatePostInput;
