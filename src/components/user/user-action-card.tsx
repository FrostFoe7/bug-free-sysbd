import React from "react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import type { UserCardProps } from "@/types";
import Username from "@/components/user/user-username";
import { Icons } from "@/components/icons";
import FollowButton from "@/components/buttons/follow-button";
import UserFollowers from "@/components/user/user-followers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserActionCard: React.FC<UserCardProps> = ({
  id,
  bio,
  fullname,
  createdAt,
  image,
  link,
  isAdmin,
  username,
  followers,
}) => {
  return (
    <div className="flex w-full flex-col">
      <div className="mt-5 flex w-full">
        <Link href={`/@${username}`}>
          <Avatar className="relative h-10 w-10 cursor-pointer overflow-visible outline-solid outline-1 outline-border ">
            <AvatarImage
              src={image ?? ""}
              alt={fullname ?? ""}
              className="rounded-full object-cover"
            />
            <AvatarFallback>
              {username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className="ml-3 flex w-full flex-col">
          <div className="flex w-full  justify-between">
            <Link
              href={`/@${username}`}
              className="flex w-full flex-col gap-1.5"
            >
              <div className="flex w-full flex-col">
                <div className="flex">
                  <Username
                    author={{
                      id,
                      image,
                      createdAt,
                      username,
                      fullname,
                      isAdmin,
                      link,
                      bio,
                      followers,
                    }}
                  />
                  {/* TODO: This is temp solution */}
                  <div className="invisible h-3 w-3">
                    <Icons.verified className="h-3 w-3" />
                  </div>
                </div>
                <span className="mt-1  text-[15px] tracking-wide text-[#6A6A6A]">
                  {fullname}
                </span>
              </div>
            </Link>
            <FollowButton
              className="px-6 text-[14px]"
              variant="outline"
              author={{
                id,
                image,
                createdAt,
                username,
                fullname,
                isAdmin,
                link,
                bio,
                followers,
              }}
            />
          </div>
          <UserFollowers
            followers={followers}
            showImage={false}
            className="mt-1 pl-0 text-[16px] text-black dark:text-white"
          />
          <Separator className="mt-4" />
        </div>
      </div>
    </div>
  );
};

export default UserActionCard;
