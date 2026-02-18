import React from "react";
import Link from "next/link";
import type { AuthorInfoProps } from "@/types";
import { Icons } from "@/components/icons";
import UserProfileCard from "@/components/cards/user-profile-card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface UserUsernameProps {
  author: AuthorInfoProps;
}

const UserUsername: React.FC<UserUsernameProps> = ({ author }) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Link
          href={`/@${author.username}`}
          className="flex w-fit cursor-pointer items-center justify-center gap-1.5 hover:underline"
        >
          <h1 className="text-[15px] font-semibold leading-0 text-accent-foreground">
            {author.username}
          </h1>
          {author.isAdmin && <Icons.verified className="h-3 w-3" />}
        </Link>
      </HoverCardTrigger>
      <HoverCardContent
        align={"start"}
        sideOffset={10}
        className="z-99999 w-[360px] rounded-2xl border-none bg-transparent p-0"
      >
        <UserProfileCard {...author} />
      </HoverCardContent>
    </HoverCard>
  );
};

export default UserUsername;
