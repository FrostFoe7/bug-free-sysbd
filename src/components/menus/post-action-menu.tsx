import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import AreYouSure from "@/components/cards/confirmation-card";

interface PostActionMenuProps {
  threadId: string;
  authorId: string;
}

const PostActionMenu: React.FC<PostActionMenuProps> = ({
  authorId,
  threadId,
}) => {
  const { user } = useUser();
  const isLoggedUser = authorId === user?.id;
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className='relative flex cursor-pointer items-center justify-center hover:before:absolute hover:before:-inset-2 hover:before:z-[-1] hover:before:rounded-full hover:before:bg-primary hover:before:content-[""] '>
            <MoreHorizontal className="aspect-square h-4 w-4 flex-1 overflow-hidden object-cover object-center  " />
          </div>
        </DropdownMenuTrigger>
        {!isLoggedUser ? (
          <DropdownMenuContent
            align="end"
            className="mt-1 w-[190px] rounded-2xl bg-background p-0 shadow-xl dark:bg-[#181818]"
          >
            <DropdownMenuItem className="cursor-pointer select-none rounded-none px-4 py-3 text-[15px] font-semibold tracking-normal  focus:bg-transparent active:bg-primary-foreground">
              Mute
            </DropdownMenuItem>
            <DropdownMenuSeparator className=" my-0 h-[1.2px]" />
            <DropdownMenuItem className="cursor-pointer select-none rounded-none  px-4 py-3 text-[15px] font-bold tracking-normal text-red-700 focus:bg-transparent focus:text-red-700 active:bg-primary-foreground">
              Block
            </DropdownMenuItem>
            <DropdownMenuSeparator className=" my-0 h-[1.2px]" />
            <DropdownMenuItem className="cursor-pointer select-none rounded-none px-4 py-3 text-[15px] font-semibold tracking-normal focus:bg-transparent active:bg-primary-foreground">
              Hide
            </DropdownMenuItem>
            <DropdownMenuSeparator className=" my-0 h-[1.2px] " />
            <DropdownMenuItem className="cursor-pointer select-none rounded-none px-4 py-3 text-[15px] font-bold tracking-normal text-red-700 focus:bg-transparent focus:text-red-700 active:bg-primary-foreground">
              Report
            </DropdownMenuItem>
          </DropdownMenuContent>
        ) : (
          <DropdownMenuContent
            align="end"
            className="mt-1 w-[190px] rounded-2xl bg-background p-0 shadow-xl dark:bg-[#181818]"
          >
            <DropdownMenuItem className="cursor-pointer select-none rounded-none px-4 py-3 text-[15px] font-semibold tracking-normal focus:bg-transparent active:bg-primary-foreground">
              Who can reply
            </DropdownMenuItem>
            <DropdownMenuSeparator className=" my-0 h-[1.2px]" />
            <DropdownMenuItem className="cursor-pointer select-none rounded-none  px-4 py-3 text-[15px] font-semibold tracking-normal focus:bg-transparent active:bg-primary-foreground ">
              Hide like count
            </DropdownMenuItem>
            <DropdownMenuSeparator className=" my-0 h-[1.2px] " />
            <AreYouSure id={threadId} />
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </>
  );
};

export default PostActionMenu;
