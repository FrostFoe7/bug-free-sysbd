"use client";

import React from "react";
import { Follow } from "@/components/ui/follow-button";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import type { AuthorInfoProps } from "@/types";
import { useSupabaseAuth } from "@/components/providers/supabase-provider";
import { cn } from "@/lib/utils";

interface FollowButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant: string;
  author: AuthorInfoProps;
}

const FollowButton: React.FC<FollowButtonProps> = ({
  variant,
  author,
  className,
}) => {
  const path = usePathname();
  const { user: loggedUser } = useSupabaseAuth();

  const isSameUser = author.id === loggedUser?.id;
  const isFollowedByMe = author.followers?.some(
    (user) => user.id === loggedUser?.id,
  );

  const [optimisticFollowed, setOptimisticFollowed] =
    React.useState(isFollowedByMe);

  // Sync state with props if they change
  React.useEffect(() => {
    setOptimisticFollowed(isFollowedByMe);
  }, [isFollowedByMe]);

  const trpcUtils = api.useUtils();

  const { mutate: toggleFollow, isPending: isLoading } =
    api.user.toggleFollow.useMutation({
      onMutate: () => {
        const previousFollowedByMe = optimisticFollowed;
        setOptimisticFollowed(!previousFollowedByMe);

        if (!previousFollowedByMe) {
          toast("Followed");
        } else {
          toast("Unfollowed");
        }

        return { previousFollowedByMe };
      },
      onError: (error, variables, context) => {
        setOptimisticFollowed(context?.previousFollowedByMe ?? isFollowedByMe);
        toast.error("FollowError: Something went wrong!");
      },
      onSettled: async () => {
        if (path === "/") {
          await trpcUtils.post.getInfinitePost.invalidate();
        }
        await trpcUtils.invalidate();
      },
    });

  const setVariant = variant === "default" ? "default" : "outline";
  return (
    <Follow
      disabled={isLoading || isSameUser}
      onClick={() => {
        toggleFollow({ id: author.id });
      }}
      variant={!optimisticFollowed ? setVariant : "outline"}
      className={cn("rounded-xl px-4 py-1.5 select-none", className, {
        "opacity-80": optimisticFollowed,
      })}
    >
      {optimisticFollowed ? "Following" : "Follow"}
    </Follow>
  );
};

export default FollowButton;
