import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import type { AuthorInfoProps } from "@/types";
import QuoteButton from "@/components/buttons/quote-button";

interface RepostButtonProps {
  id: string;
  text: string;
  author: AuthorInfoProps;
  isRepostedByMe: boolean;
  createdAt?: Date;
}

const RepostButton: React.FC<RepostButtonProps> = ({
  id,
  text,
  author,
  createdAt,
  isRepostedByMe,
}) => {
  const repostUpdate = React.useRef({
    isRepostedByMe,
  });

  const { mutate: toggleRepost, isLoading } = api.post.toggleRepost.useMutation(
    {
      onMutate: () => {
        const previousRepostByMe = repostUpdate.current.isRepostedByMe;

        repostUpdate.current.isRepostedByMe =
          !repostUpdate.current.isRepostedByMe;

        if (repostUpdate.current.isRepostedByMe === true) {
          toast("Reposted");
        } else {
          toast("Removed");
        }

        return { previousRepostByMe };
      },
      onError: (error, variables, context) => {
        repostUpdate.current.isRepostedByMe =
          context?.previousRepostByMe ?? repostUpdate.current.isRepostedByMe;
        toast.error("RepostError: Something went wrong!");
      },
    },
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          disabled={isLoading}
          className="hover:bg-primary flex h-fit w-fit items-center justify-center rounded-full p-2 outline-hidden active:scale-95"
        >
          {repostUpdate.current.isRepostedByMe ? (
            <Icons.reposted className="h-5 w-5" />
          ) : (
            <Icons.repost className="h-5 w-5" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="bg-background w-[190px] rounded-2xl p-0 shadow-xl dark:bg-[#181818]"
      >
        <DropdownMenuItem
          disabled={isLoading}
          onClick={() => {
            toggleRepost({ id });
          }}
          className={cn(
            "active:bg-primary-foreground w-full cursor-pointer justify-between rounded-none px-4 py-3 text-[15px] font-semibold tracking-normal select-none focus:bg-transparent",
            {
              "text-red-600 focus:text-red-600":
                repostUpdate.current.isRepostedByMe,
            },
          )}
        >
          {repostUpdate.current.isRepostedByMe ? <>Remove</> : <>Repost</>}

          <Icons.repost
            className={cn("h-5 w-5", {
              "text-red-600": repostUpdate.current.isRepostedByMe,
            })}
          />
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-0 h-[1.2px]" />
        <div className="active:bg-primary-foreground w-full cursor-pointer justify-between rounded-none px-4 py-3 text-[15px] font-semibold tracking-normal select-none focus:bg-transparent">
          <QuoteButton
            quoteInfo={{
              text,
              id,
              author,
              createdAt,
            }}
          />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RepostButton;
