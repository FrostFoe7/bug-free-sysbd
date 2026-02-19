"use client";

import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useSupabaseAuth } from "@/components/providers/supabase-provider";
import type { PostReplyCardProps } from "@/types";
import Username from "@/components/user/user-username";
import PostActionMenu from "@/components/menus/post-action-menu";
import PostParentCard from "@/components/cards/post-parent-card";
import ProfileInfoCard from "@/components/cards/user-profile-card";
import RepostButton from "@/components/buttons/repost-button";
import ShareButton from "@/components/buttons/share-button";
import LikeButton from "@/components/buttons/like-button";
import PostActivityCard from "@/components/cards/post-activity-card";
import { cn, formatTimeAgo } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import PostImageCard from "@/components/cards/post-image-card";
import PostQuoteCard from "@/components/cards/post-quote-card";
import ReplyButton from "@/components/buttons/reply-button";

const PostReplyCard: React.FC<PostReplyCardProps> = ({
  postInfo,
  parentPosts,
}) => {
  React.useEffect(() => {
    const scrollToPost = () => {
      const postIdFromUrl = postInfo.id;
      if (postIdFromUrl) {
        const postElement = document.getElementById(postIdFromUrl);
        if (postElement) {
          postElement.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "start",
          });
        }
      }
    };

    scrollToPost();
  }, [postInfo]);

  const { user: loggedUser } = useSupabaseAuth();

  const {
    id,
    likes,
    replies,
    author,
    count,
    createdAt,
    text,
    images,
    reposts,
    quoteId,
  } = postInfo;

  const { replyCount } = count;

  const isRepostedByMe = reposts?.some(
    (repost) => repost.userId === loggedUser?.id,
  );

  const [likeCount, setLikeCount] = React.useState(count.likeCount);

  const handleLikeClick = (isLiked: boolean) => {
    if (!isLiked) {
      setLikeCount(likeCount + 1);
    } else {
      setLikeCount(likeCount - 1);
    }
  };
  return (
    <>
      <div
        className={cn("mb-8 flex w-full flex-col pt-2", {
          "mb-0": replies.length > 0,
        })}
      >
        {parentPosts?.map((post, index) => (
          <>
            <PostParentCard
              key={index}
              author={post.author}
              count={post.count}
              id={post.id}
              createdAt={post.createdAt}
              likes={post.likes}
              parentPostId={post.parentPostId}
              replies={post.replies}
              images={post.images}
              text={post.text}
              quoteId={post.quoteId}
              reposts={post.reposts}
            />
          </>
        ))}

        <div className="flex w-full items-center gap-3 pr-2">
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

          <div className="flex w-full justify-between gap-5 pl-0.5">
            <span className="flex cursor-pointer items-center justify-center gap-1.5">
              <Username author={author} />
            </span>
            <div className="flex items-center justify-between gap-3 self-stretch">
              <time className="cursor-default self-stretch text-right text-[15px] leading-none text-[#777777]">
                {formatTimeAgo(createdAt)}
              </time>
              <PostActionMenu authorId={author.id} threadId={id} />
            </div>
          </div>
        </div>

        <div id={id} className="flex w-full flex-col">
          <div className="flex flex-col items-start justify-center self-stretch">
            <div className="flex w-full flex-col items-start justify-center self-start pt-1.5">
              <div
                dangerouslySetInnerHTML={{
                  __html: text.slice(1, -1).replace(/\\n/g, "\n"),
                }}
                className="text-accent-foreground mt-1 text-[15px] leading-5 whitespace-pre-line max-md:max-w-full"
              />

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

          <div className="flex items-center pb-3 text-center text-[15px] text-[#777777]">
            <Link href={`/@${author.username}/post/${id}`}>
              {replyCount > 0 && (
                <span className="hover:underline">
                  {replyCount} {replyCount === 1 ? "reply" : "replies"}
                </span>
              )}
            </Link>

            {replyCount > 0 && likeCount > 0 && (
              <span className="mx-2"> · </span>
            )}

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
      </div>
    </>
  );
};

export default PostReplyCard;
