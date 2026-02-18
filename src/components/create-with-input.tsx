import { useUser } from "@clerk/nextjs";
import React from "react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const CreateWithInput: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  ...props
}) => {
  const { user } = useUser();

  return (
    <div className="flex w-full select-none flex-col" {...props}>
      <div className="my-4 flex w-full">
        <div className="flex w-full select-none">
          <Avatar className="mr-4 h-9 w-9 rounded-full outline-solid outline-1 outline-border">
            <AvatarImage
              src={user?.imageUrl}
              alt={user?.username ?? ""}
              className="object-cover"
            />
            <AvatarFallback>
              {user?.username?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <input
            className=" w-full resize-none bg-transparent outline-hidden placeholder:text-[15px] placeholder:text-[#777777]"
            placeholder="Start a thread..."
          />
        </div>
        <span className="inline-flex h-9 cursor-not-allowed select-none items-center justify-center rounded-full bg-foreground px-4 text-[15px] text-sm font-semibold text-primary-foreground text-white opacity-30 ring-offset-background transition-colors hover:bg-foreground focus-visible:outline-hidden focus-visible:ring-2  focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:text-black ">
          Post
        </span>
      </div>
      <Separator />
    </div>
  );
};

export default CreateWithInput;
