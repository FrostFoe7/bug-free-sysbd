"use client";

import React from "react";
import { Instagram } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { cn, formatURL } from "@/lib/utils";
import { Icons } from "@/components/icons";
import type { UserProfileInfoProps } from "@/types";
import { Button } from "@/components/ui/button";
import { useSupabaseAuth } from "@/components/providers/supabase-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserFollowers from "@/components/user/user-followers";
import FollowButton from "@/components/buttons/follow-button";

const UserProfile: React.FC<UserProfileInfoProps> = (props) => {
  const { id, bio, fullname, image, link, username, followers, isAdmin } =
    props;
  const path = usePathname();
  const { user } = useSupabaseAuth();

  const params = useParams();
  const profile = params.profile as string;
  const usernamePath = decodeURIComponent(profile).substring(1);
  const basePath = `@${usernamePath}`;

  const segments = path.split("/");
  const lastSegment = segments[segments.length - 1];

  return (
    <div className="z-10 mt-4 flex w-full flex-col space-y-4">
      <div className="w-fullitems-center flex">
        <div className="flex w-full flex-col gap-1 p-3 pl-0">
          <h1 className="text-2xl font-bold tracking-normal">{fullname}</h1>
          <div className="flex gap-1">
            <h4 className="text-[15px]">{username}</h4>
            <span className="text-xm bg-primary ml-0.5 rounded-2xl px-1.5 py-1 text-[11px] font-medium text-[#777777]">
              threads.net
            </span>
          </div>
        </div>
        <Avatar className="outline-border relative h-[80px] w-[80px] overflow-visible outline-2 outline-solid">
          <AvatarImage
            src={image ?? ""}
            alt={fullname ?? ""}
            className="h-min w-full rounded-full object-cover"
          />
          <AvatarFallback></AvatarFallback>
          {isAdmin && (
            <div className="absolute bottom-0 -left-0.5">
              <Icons.verified2 className="text-background h-6 w-6" />
            </div>
          )}
        </Avatar>
      </div>

      {bio && (
        <span
          dangerouslySetInnerHTML={{
            __html: bio?.slice(1, -1).replace(/\\n/g, "\n"),
          }}
          className="text-[15px] whitespace-pre-line"
        />
      )}

      <div className="flex items-center justify-between">
        <div className="hidden w-full items-center -space-x-1 overflow-hidden sm:flex">
          <div className="flex items-center">
            <UserFollowers followers={followers} showImage={true} />

            {followers.length > 0 && link && (
              <span className="mx-2 text-[#777777]"> · </span>
            )}

            {link && (
              <Link
                href={link}
                className="cursor-pointer text-[15px] text-[#777777] hover:underline active:text-[#4d4d4d]"
              >
                {formatURL(link)}
              </Link>
            )}
          </div>
        </div>
        <div className="flex gap-4">
          <Instagram className="h-6 w-6" />
          {user?.id != id && <Icons.circleMenu className="h-6 w-6" />}
        </div>
      </div>
      {user?.id != id && (
        <div className="grid gap-2 pt-2 sm:grid-cols-2">
          <FollowButton
            className="px-6 text-[14px]"
            variant="default"
            author={props}
          />
          <Button
            size={"sm"}
            variant="outline"
            className="w-full cursor-not-allowed rounded-xl border-[#333333] py-1 text-[16px] font-semibold tracking-normal active:scale-95 sm:w-auto"
          >
            Mention
          </Button>
        </div>
      )}
      <div className="border-border flex w-full border-b">
        <Link
          href={`/${basePath}`}
          className={cn(
            "flex h-12 w-full items-center justify-center text-center font-medium text-neutral-600 duration-200",
            {
              "border-foreground text-foreground border-b-2":
                lastSegment === basePath,
            },
          )}
        >
          Threads
        </Link>
        <Link
          href={`/${basePath}/replies`}
          className={cn(
            "flex h-12 w-full items-center justify-center text-center font-medium text-neutral-600 duration-200",
            {
              "border-foreground text-foreground border-b-2":
                lastSegment === "replies",
            },
          )}
        >
          Replies
        </Link>
        <Link
          href={`/${basePath}/reposts`}
          className={cn(
            "flex h-12 w-full items-center justify-center text-center font-medium text-neutral-600 duration-200",
            {
              "border-foreground text-foreground border-b-2":
                lastSegment === "reposts",
            },
          )}
        >
          Reposts
        </Link>
      </div>
    </div>
  );
};

export default UserProfile;
