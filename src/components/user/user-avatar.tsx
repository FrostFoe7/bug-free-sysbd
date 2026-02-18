import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface UserAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  image: string | null | undefined;
  username: string;
  fullname: string | null | undefined;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  username,
  image,
  fullname,
  className,
}) => {
  return (
    <Link
      href={`/@${username}`}
      className={cn(
        "outline-border h-9 w-9 overflow-visible rounded-full outline-[1.5px] outline-solid",
        className,
      )}
    >
      <Avatar className="h-min w-full rounded-full object-cover">
        <AvatarImage
          src={image ?? ""}
          alt={fullname ?? ""}
          className="h-full w-full rounded-full object-cover"
        />
        <AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
    </Link>
  );
};

export default UserAvatar;
