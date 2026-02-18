import React from "react";
import Link from "next/link";
import { formatURL } from "@/lib/utils";
import { Icons } from "@/components/icons";
import type { PostCardProps } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import FollowButton from "@/components/buttons/follow-button";
import UserFollowers from "@/components/user/user-followers";

type UserProfileCardProps = PostCardProps["author"];

const UserProfileCard: React.FC<UserProfileCardProps> = (props) => {
  const { bio, image, username, followers, fullname, link, isAdmin } = props;

  return (
    <div className="bg-background z-10 flex h-fit flex-col space-y-4 rounded-2xl p-6 shadow-xl dark:bg-[#181818]">
      <Link href={`/@${username}`} className="flex w-full items-center">
        <div className="flex w-full flex-col gap-1 truncate">
          <h1 className="truncate text-[25px] font-extrabold tracking-normal">
            {fullname}
          </h1>
          <div className="flex gap-1">
            <h4 className="truncate text-[15px]">{username}</h4>
            <span className="text-xm bg-primary ml-0.5 rounded-2xl px-1.5 py-1 text-[11px] font-medium text-[#777777]">
              sysm
            </span>
          </div>
        </div>
        <Avatar className="outline-border relative h-[64px] w-[64px] overflow-visible outline-2 outline-solid">
          <AvatarImage
            src={image ?? ""}
            alt={fullname ?? ""}
            className="h-min w-full rounded-full object-cover"
          />
          <AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>
          {isAdmin && (
            <div className="absolute bottom-0 -left-1">
              <Icons.verified2 className="text-background h-5 w-5" />
            </div>
          )}
        </Avatar>
      </Link>

      {bio && (
        <span
          dangerouslySetInnerHTML={{
            __html: bio.slice(1, -1).replace(/\\n/g, "\n"),
          }}
          className="text-overflow-ellipsis max-h-[100px] text-[15px] whitespace-pre-line"
        />
      )}
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
      <FollowButton variant="default" author={props} />
    </div>
  );
};

export default UserProfileCard;
