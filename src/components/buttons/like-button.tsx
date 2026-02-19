"use client";

import React from "react";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { useSupabaseAuth } from "@/components/providers/supabase-provider";
import type { PostCardProps } from "@/types";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface LikeButtonProps {
  likeInfo: Pick<PostCardProps, "id" | "likes" | "count">;
  onLike: (isLiked: boolean) => void;
}

const LikeButton: React.FC<LikeButtonProps> = ({ likeInfo, onLike }) => {
  const { user: loggedUser } = useSupabaseAuth();
  const router = useRouter();

  const { id, likes } = likeInfo;
  const isLikedByMe = likes?.some((like) => like.userId === loggedUser?.id);

  const [optimisticLiked, setOptimisticLiked] = React.useState(isLikedByMe);

  // Sync state with props if they change
  React.useEffect(() => {
    setOptimisticLiked(isLikedByMe);
  }, [isLikedByMe]);

  const { mutate: toggleLike, isPending: isLoading } =
    api.like.toggleLike.useMutation({
      onMutate: () => {
        const previousLikedByMe = optimisticLiked;
        setOptimisticLiked(!previousLikedByMe);
        return { previousLikedByMe };
      },
      onError: (error, variables, context) => {
        setOptimisticLiked(context?.previousLikedByMe ?? isLikedByMe);
        toast.error("Something went wrong!");
      },
    });

  return (
    <div className="hover:bg-primary flex h-fit w-fit items-center justify-center rounded-full p-2 active:scale-95">
      <button disabled={isLoading}>
        <Icons.heart
          onClick={() => {
            if (!loggedUser) {
              router.push("/login");
              return;
            }
            onLike(!!optimisticLiked);
            toggleLike({ id });
          }}
          fill={optimisticLiked ? "#ff3040" : "transparent"}
          className={cn("h-5 w-5", {
            "text-[#ff3040]": optimisticLiked,
          })}
        />
      </button>
    </div>
  );
};

export default LikeButton;
