import React from "react";
import Link from "next/link";
import type { NotificationType } from "@prisma/client";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface UserNotificationAvtarProps {
  username: string;
  image: string;
  fullname: string;
  type: NotificationType;
}

const iconsMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  QUOTE: Icons.quote2,
  REPLY: Icons.reply2,
  REPOST: Icons.repost2,
  LIKE: Icons.like,
  FOLLOW: Icons.follow,
  ADMIN: Icons.logo,
};

const UserNotificationAvtar: React.FC<UserNotificationAvtarProps> = ({
  username,
  image,
  fullname,
  type,
}) => {
  const IconComponent = iconsMap[type];

  return (
    <Link href={`/@${username}`}>
      <div className="outline-border ml-px rounded-full outline-1 outline-solid">
        <Avatar className="relative h-10 w-10 cursor-pointer overflow-visible">
          <AvatarImage
            src={image}
            alt={fullname}
            className="h-full w-full rounded-full object-cover"
          />
          <AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>
          <div
            className={cn(
              "border-background absolute -right-1 -bottom-1 rounded-2xl border-2 text-white",
              {
                "bg-[#fe0169]": type === "LIKE",
                "bg-[#6e3def]": type === "FOLLOW",
                "bg-[#24c3ff]": type === "REPLY",
                "bg-[#c329bf]": type === "REPOST",
                "bg-[#fe7900]": type === "QUOTE",
              },
            )}
          >
            {type !== "ADMIN" && IconComponent && (
              <IconComponent className="h-[20px] w-[20px]" fill="white" />
            )}
          </div>
        </Avatar>
      </div>
    </Link>
  );
};

export default UserNotificationAvtar;
