"use client";

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
import { useSupabaseAuth } from "@/components/providers/supabase-provider";
import { useRouter } from "next/navigation";

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
  const { user: loggedUser } = useSupabaseAuth();
  const router = useRouter();

  const [optimisticReposted, setOptimisticReposted] =
    React.useState(isRepostedByMe);

  // Sync state with props if they change
  React.useEffect(() => {
    setOptimisticReposted(isRepostedByMe);
  }, [isRepostedByMe]);

  const { mutate: toggleRepost, isPending: isLoading } =
    api.post.toggleRepost.useMutation({
      onMutate: () => {
        const previousRepostByMe = optimisticReposted;
        setOptimisticReposted(!previousRepostByMe);

        if (!previousRepostByMe) {
          toast("Reposted");
        } else {
          toast("Removed");
        }

        return { previousRepostByMe };
      },
      onError: (error, variables, context) => {
        setOptimisticReposted(context?.previousRepostByMe ?? isRepostedByMe);
        toast.error("RepostError: Something went wrong!");
      },
    });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        onClick={(e) => {
          if (!loggedUser) {
            e.preventDefault();
            router.push("/login");
          }
        }}
      >
        <button
          disabled={isLoading}
          className="hover:bg-primary flex h-fit w-fit items-center justify-center rounded-full p-2 outline-hidden active:scale-95"
        >
          {optimisticReposted ? (
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
              "text-red-600 focus:text-red-600": optimisticReposted,
            },
          )}
        >
          {optimisticReposted ? <>Remove</> : <>Repost</>}

          <Icons.repost
            className={cn("h-5 w-5", {
              "text-red-600": optimisticReposted,
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
