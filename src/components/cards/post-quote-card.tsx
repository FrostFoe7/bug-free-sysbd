"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import Username from "@/components/user/user-username";
import UserAvatar from "@/components/user/user-avatar";
import { api } from "@/trpc/react";
import { Icons } from "@/components/icons";
import type { ParentPostInfo } from "@/types";
import Link from "next/link";
import { formatTimeAgo } from "@/lib/utils";

type PostQuoteCardProps = Partial<
  Pick<ParentPostInfo, "id" | "text" | "author">
> & { createdAt?: Date };

const PostQuoteCard: React.FC<PostQuoteCardProps & { quoteId?: string }> = ({
  author,
  text,
  quoteId,
  createdAt,
}) => {
  if (quoteId) {
    const { data, isLoading } = api.post.getQuotedPost.useQuery(
      { id: quoteId },
      {
        enabled: !!quoteId,
        staleTime: Infinity,
      },
    );
    if (isLoading) {
      return (
        <div className="flex h-[100px] w-full items-center justify-center">
          <Icons.loading className="h-11 w-11" />
        </div>
      );
    }

    if (!data) return <>Not found.</>;

    return (
      <Link
        href={`/@${data.postInfo.user.username}/post/${data.postInfo.id}`}
        className="w-full"
      >
        <RenderCard
          author={data?.postInfo.user}
          text={data?.postInfo.text}
          createdAt={data.postInfo.createdAt}
        />
      </Link>
    );
  }
  return <RenderCard author={author} text={text} createdAt={createdAt} />;
};

export default PostQuoteCard;

const RenderCard: React.FC<PostQuoteCardProps> = ({
  author,
  text,
  createdAt,
}) => {
  return (
    <Card className="border-border mt-3 w-full overflow-hidden rounded-xl bg-transparent p-4">
      <div className="mb-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserAvatar
            fullname={author?.fullname}
            image={author?.image}
            username={author?.username ?? ""}
            className="h-7 w-7"
          />
          <Username author={author!} />
        </div>
        <time className="cursor-default text-[15px] text-[#777777]">
          {createdAt && formatTimeAgo(createdAt)}
        </time>
      </div>
      {text && (
        <span className="text-accent-foreground w-full grow resize-none truncate overflow-hidden text-[15px] tracking-normal wrap-break-word whitespace-pre-line outline-hidden placeholder:text-[#777777]">
          <div
            dangerouslySetInnerHTML={{
              __html: text.slice(1, -1).replace(/\\n/g, "\n"),
            }}
          />
        </span>
      )}
    </Card>
  );
};
