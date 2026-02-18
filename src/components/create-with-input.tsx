import { useSupabaseAuth } from "@/components/providers/supabase-provider";
import React from "react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const CreateWithInput: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  ...props
}) => {
  const { user } = useSupabaseAuth();

  return (
    <div className="flex w-full flex-col select-none" {...props}>
      <div className="my-4 flex w-full">
        <div className="flex w-full select-none">
          <Avatar className="outline-border mr-4 h-9 w-9 rounded-full outline-1 outline-solid">
            <AvatarImage
              src={
                (user?.user_metadata?.avatar_url as string) ?? user?.email ?? ""
              }
              alt={(user?.user_metadata?.username as string) ?? ""}
              className="object-cover"
            />
            <AvatarFallback>
              {((user?.user_metadata?.username as string) ?? user?.email ?? "")
                ?.slice(0, 2)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <input
            className="w-full resize-none bg-transparent outline-hidden placeholder:text-[15px] placeholder:text-[#777777]"
            placeholder="Start a thread..."
          />
        </div>
        <span className="bg-foreground text-primary-foreground ring-offset-background hover:bg-foreground focus-visible:ring-ring inline-flex h-9 cursor-not-allowed items-center justify-center rounded-full px-4 text-sm text-[15px] font-semibold text-white opacity-30 transition-colors select-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 dark:text-black">
          Post
        </span>
      </div>
      <Separator />
    </div>
  );
};

export default CreateWithInput;
