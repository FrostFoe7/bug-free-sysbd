"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { ChevronRight } from "lucide-react";
import { api } from "@/trpc/react";
import type { AuthorInfoProps } from "@/types";
import Username from "@/components/user/user-username";
import Link from "next/link";
import { cn } from "@/lib/utils";
import FollowButton from "@/components/buttons/follow-button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PostActivityCardProps {
  likeCount: number;
  id: string;
  text: string;
  author: AuthorInfoProps;
}

const PostActivityCard: React.FC<PostActivityCardProps> = ({
  likeCount,
  id,
  text,
  author,
}) => {
  return (
    <Dialog>
      <DialogTrigger>
        <span className="hover:underline">
          {likeCount} {likeCount === 1 ? "like" : "likes"}
        </span>
      </DialogTrigger>
      <DialogContent className="bg-background w-full max-w-[520px] gap-0 rounded-xl border-none p-0 shadow-2xl ring-1 ring-[#393939] dark:bg-[#181818]">
        <div className="flex items-center justify-between p-6">
          <div className="w-full text-center text-[15px] font-medium tracking-normal">
            Post activity
          </div>
          <div className="text-right text-[15px] tracking-normal">Sort</div>
        </div>
        <section className="no-scrollbar max-h-[80vh] overflow-y-auto">
          <Card className="border-border mx-6 mb-2 space-y-1.5 overflow-hidden rounded-xl bg-transparent p-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-7 w-7 rounded-full">
                <AvatarImage src={author.image ?? ""} alt="author.username" />
                <AvatarFallback>OG</AvatarFallback>
              </Avatar>
              <Username author={author} />
            </div>
            <div className="text-accent-foreground w-full grow resize-none truncate overflow-hidden text-[15px] tracking-normal wrap-break-word whitespace-pre-line outline-hidden placeholder:text-[#777777]">
              <div
                dangerouslySetInnerHTML={{
                  __html: text.slice(1, -1).replace(/\\n/g, "\n"),
                }}
              />
            </div>
          </Card>
          <DisplayInsight id={id} />
        </section>
      </DialogContent>
    </Dialog>
  );
};

export default PostActivityCard;

interface DisplayInsightProps {
  id: string;
}

const DisplayInsight: React.FC<DisplayInsightProps> = ({ id }) => {
  const { data, isLoading } = api.like.postLikeInfo.useQuery({ id });

  if (isLoading) {
    return (
      <div className="flex h-[100px] w-full items-center justify-center">
        <Icons.loading className="h-11 w-11" />
      </div>
    );
  }

  const likeCount = data?.likes.length;
  const repostCount = data?.reposts.length;

  return (
    <>
      <div className="flex w-full items-center pl-1">
        <div>
          <Icons.heart className="mr-3 ml-6 h-6 w-6" />
        </div>
        <div className="border-border mr-6 flex w-full items-center justify-between border-b py-5">
          <span className="text-base font-semibold tracking-normal">Likes</span>
          <div className="flex items-center gap-1">
            <span className="text-[15px]">{likeCount}</span>
            <ChevronRight className="h-5 w-5" />
          </div>
        </div>
      </div>
      <div className="flex w-full items-center pl-1">
        <div>
          <Icons.repost className="mr-3 ml-6 h-6 w-6" />
        </div>
        <div className="border-border mr-6 flex w-full items-center justify-between border-b py-5">
          <span className="text-base font-semibold tracking-normal">
            Reposts
          </span>
          <div className="flex items-center gap-1">
            <span className="text-[15px]">{repostCount}</span>
            <ChevronRight className="h-5 w-5" />
          </div>
        </div>
      </div>
      <div className="flex w-full items-center p-1 pr-0">
        <div>
          <Icons.quote className="mr-3 ml-6 h-6 w-6" />
        </div>
        <div className="border-border mr-6 flex w-full items-center justify-between border-b py-5">
          <span className="text-base font-semibold tracking-normal">
            Quotes
          </span>
          <div className="flex items-center gap-1">
            <span className="text-[15px]">0</span>
            <ChevronRight className="h-5 w-5" />
          </div>
        </div>
      </div>

      {data?.likes.map((userData, index) => (
        <div key={index} className="flex w-full items-center">
          <button className="relative mr-3 ml-4">
            <div className="h-9 w-9 rounded-full outline-1 outline-[#333333] outline-solid">
              <Avatar className="h-full w-full rounded-full">
                <AvatarImage
                  src={userData.user.image ?? ""}
                  alt={userData.user.fullname ?? ""}
                />
                <AvatarFallback>
                  {userData.user.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="border-background text-background absolute -right-0.5 -bottom-0.5 rounded-2xl border-2 bg-red-500 hover:scale-105 active:scale-95">
              <Icons.heart
                className="h-4 w-4 p-[3px] text-white"
                fill="white"
              />
            </div>
          </button>
          <div
            className={cn(
              "mr-6 flex w-full items-center justify-between py-5",
              {
                "border-border border-b": index !== data.likes.length - 1,
              },
            )}
          >
            <Link
              href={`/@${userData.user.username}`}
              className="flex w-full flex-col gap-1.5"
            >
              <div className="flex w-full flex-col">
                <div className="flex">
                  <Username author={userData.user} />
                  {/* TODO: This is temp solution */}
                  <div className="invisible h-3 w-3">
                    <Icons.verified className="h-3 w-3" />
                  </div>
                </div>
                <span className="mt-1 text-[15px] tracking-wide text-[#6A6A6A]">
                  {userData.user.fullname}
                </span>
              </div>
            </Link>
            <FollowButton
              variant="outline"
              author={userData.user}
              className="px-6 text-[14px]"
            />
          </div>
        </div>
      ))}
    </>
  );
};
