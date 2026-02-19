"use client";

import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { cn, formatTimeAgo } from "@/lib/utils";
import { useSupabaseAuth } from "@/components/providers/supabase-provider";
import type { PostCardProps } from "@/types";
import UserRepliesImages from "@/components/user/user-replies-images";
import ProfileInfoCard from "@/components/cards/user-profile-card";
import PostActionMenu from "@/components/menus/post-action-menu";
import ShareButton from "@/components/buttons/share-button";
import RepostButton from "@/components/buttons/repost-button";
import Username from "@/components/user/user-username";
import PostActivityCard from "@/components/cards/post-activity-card";
import { useTheme } from "next-themes";
import LikeButton from "@/components/buttons/like-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import PostImageCard from "@/components/cards/post-image-card";
import PostQuoteCard from "@/components/cards/post-quote-card";
import ReplyButton from "@/components/buttons/reply-button";

const PostParentCard: React.FC<PostCardProps> = ({
  id,
  text,
  createdAt,
  likes,
  replies,
  author,
  count,
  images,
  reposts,
  quoteId,
}) => {
  const { user: loggedUser } = useSupabaseAuth();

  const { replyCount } = count;

  const isRepostedByMe = reposts?.some(
    (repost) => repost.userId === loggedUser?.id,
  );

  const getThreadReplies = replies?.map((reply) => ({
    id: reply.author.id,
    username: reply.author.username,
    image: reply.author.image,
  }));

  const [likeCount, setLikeCount] = React.useState(count.likeCount);

  const handleLikeClick = (isLiked: boolean) => {
    if (!isLiked) {
      setLikeCount(likeCount + 1);
    } else {
      setLikeCount(likeCount - 1);
    }
  };

  const { theme } = useTheme();

  return (
    <>
      <div className="flex w-full gap-2">
        <div className="flex flex-col items-center gap-1.5">
          <Dialog>
            <DialogTrigger asChild>
              <button className="relative">
                <div className="outline-border ml-px h-9 w-9 rounded-full outline-1 outline-solid">
                  <Avatar className="h-full w-full rounded-full">
                    <AvatarImage
                      src={author.image ?? ""}
                      alt={author.username}
                      className="object-cover"
                    />
                    <AvatarFallback>
                      {author.username?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="border-background bg-foreground text-background absolute -right-0.5 -bottom-0.5 rounded-2xl border-2 hover:scale-105 active:scale-95">
                  <Plus className="h-4 w-4 p-0.5 text-white dark:text-black" />
                </div>
              </button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-[360px] rounded-2xl border-none p-0">
              <DialogTitle asChild>
                <VisuallyHidden>{author.username}'s profile</VisuallyHidden>
              </DialogTitle>
              <ProfileInfoCard {...author} />
            </DialogContent>
          </Dialog>

          {replyCount > 0 && (
            // TODO: need to fix this
            <div className="relative h-full">
              <div className="h-full w-0.5 rounded-full bg-[#D8D8D8] leading-0 dark:bg-[#313639]" />
              <div className="absolute -left-[14px] z-10 h-full -translate-y-1 transform leading-0 text-[#D8D8D8] dark:text-[#313639]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="29"
                  viewBox="0 0 17 29"
                  fill="none"
                >
                  <path
                    d="M16 27.5V15.5C16 10.7858 11.7871 5.70534 7.23886 5.70533C2.69067 5.70532 1.92432 8.83932 1.92432 10.6923C1.92432 12.5452 2.85983 15.4303 7.23957 15.4303C12.2931 15.4303 16 10.5535 16 5.5V1.5"
                    stroke={theme === "light" ? "#D8D8D8" : "#313639"}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          )}
        </div>

        <div className="flex w-full flex-col px-2">
          <div className="flex flex-col items-start justify-center self-stretch max-md:max-w-full">
            <div className="flex w-full flex-col items-start justify-center self-start pt-0">
              <div className="flex w-full justify-between gap-5 self-start py-px max-md:max-w-full max-md:flex-wrap">
                <Username author={author} />
                <div className="flex items-center justify-between gap-3 self-stretch">
                  <time className="cursor-default self-stretch text-right text-[15px] leading-none text-[#777777]">
                    {formatTimeAgo(createdAt)}
                  </time>
                  <PostActionMenu authorId={author.id} threadId={id} />
                </div>
              </div>

              <Link href={`/@${author.username}/post/${id}`} className="w-full">
                <div
                  dangerouslySetInnerHTML={{
                    __html: text.slice(1, -1).replace(/\\n/g, "\n"),
                  }}
                  className="text-accent-foreground mt-1 text-[15px] leading-5 whitespace-pre-line max-md:max-w-full"
                />
              </Link>

              {images && images.length > 0 && (
                <PostImageCard images={images} />
              )}

              {quoteId && (
                <PostQuoteCard quoteId={quoteId} createdAt={createdAt} />
              )}

              <div className="mt-2 -ml-2 flex w-full font-bold">
                <LikeButton
                  likeInfo={{
                    id,
                    count,
                    likes,
                  }}
                  onLike={handleLikeClick}
                />
                <ReplyButton
                  replyThreadInfo={{
                    id,
                    text,
                    images: images,
                    author: { ...author },
                  }}
                />
                <RepostButton
                  id={id}
                  text={text}
                  author={author}
                  createdAt={createdAt}
                  isRepostedByMe={isRepostedByMe}
                />
                <ShareButton id={id} author={author.username} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={cn("flex items-center pb-2 select-none", {
          "gap-2 pb-3.5": replyCount > 0 || likeCount > 0,
        })}
      >
        <div
          className={cn("invisible flex w-[36px] items-center justify-center", {
            invisible: replyCount > 0,
          })}
        >
          <UserRepliesImages author={getThreadReplies} />
        </div>

        <div className="flex items-center px-2 text-center text-[15px] text-[#777777]">
          <Link href={`/@${author.username}/post/${id}`}>
            {replyCount > 0 && (
              <span className="hover:underline">
                {replyCount} {replyCount === 1 ? "reply" : "replies"}
              </span>
            )}
          </Link>

          {replyCount > 0 && likeCount > 0 && <span className="mx-2"> · </span>}

          {likeCount > 0 && (
            <PostActivityCard
              author={author}
              id={id}
              likeCount={likeCount}
              text={text}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default PostParentCard;
