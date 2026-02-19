import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useSupabaseAuth } from "@/components/providers/supabase-provider";
import AreYouSure from "@/components/cards/confirmation-card";
import { useRouter } from "next/navigation";

interface PostActionMenuProps {
  threadId: string;
  authorId: string;
}

const PostActionMenu: React.FC<PostActionMenuProps> = ({
  authorId,
  threadId,
}) => {
  const { user } = useSupabaseAuth();
  const router = useRouter();
  const isLoggedUser = authorId === user?.id;
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          asChild
          onClick={(e) => {
            if (!user) {
              e.preventDefault();
              router.push("/login");
            }
          }}
        >
          <div className='hover:before:bg-primary relative flex cursor-pointer items-center justify-center hover:before:absolute hover:before:-inset-2 hover:before:z-[-1] hover:before:rounded-full hover:before:content-[""]'>
            <MoreHorizontal className="aspect-square h-4 w-4 flex-1 overflow-hidden object-cover object-center" />
          </div>
        </DropdownMenuTrigger>
        {!isLoggedUser ? (
          <DropdownMenuContent
            align="end"
            className="bg-background mt-1 w-[190px] rounded-2xl p-0 shadow-xl dark:bg-[#181818]"
          >
            <DropdownMenuItem className="active:bg-primary-foreground cursor-pointer rounded-none px-4 py-3 text-[15px] font-semibold tracking-normal select-none focus:bg-transparent">
              Mute
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-0 h-[1.2px]" />
            <DropdownMenuItem className="active:bg-primary-foreground cursor-pointer rounded-none px-4 py-3 text-[15px] font-bold tracking-normal text-red-700 select-none focus:bg-transparent focus:text-red-700">
              Block
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-0 h-[1.2px]" />
            <DropdownMenuItem className="active:bg-primary-foreground cursor-pointer rounded-none px-4 py-3 text-[15px] font-semibold tracking-normal select-none focus:bg-transparent">
              Hide
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-0 h-[1.2px]" />
            <DropdownMenuItem className="active:bg-primary-foreground cursor-pointer rounded-none px-4 py-3 text-[15px] font-bold tracking-normal text-red-700 select-none focus:bg-transparent focus:text-red-700">
              Report
            </DropdownMenuItem>
          </DropdownMenuContent>
        ) : (
          <DropdownMenuContent
            align="end"
            className="bg-background mt-1 w-[190px] rounded-2xl p-0 shadow-xl dark:bg-[#181818]"
          >
            <DropdownMenuItem className="active:bg-primary-foreground cursor-pointer rounded-none px-4 py-3 text-[15px] font-semibold tracking-normal select-none focus:bg-transparent">
              Who can reply
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-0 h-[1.2px]" />
            <DropdownMenuItem className="active:bg-primary-foreground cursor-pointer rounded-none px-4 py-3 text-[15px] font-semibold tracking-normal select-none focus:bg-transparent">
              Hide like count
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-0 h-[1.2px]" />
            <AreYouSure id={threadId} />
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </>
  );
};

export default PostActionMenu;
