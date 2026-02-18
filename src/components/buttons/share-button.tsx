import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/icons";

interface ShareButtonProps {
  id: string;
  author: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ id, author }) => {
  const copyLinkToClipboard = async () => {
    const url = window.location.origin;
    const link = `${url}/@${author}/post/${id}`;

    await navigator.clipboard.writeText(link);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex h-fit w-fit items-center justify-center rounded-full p-2 hover:bg-primary active:scale-95">
          <Icons.share className="h-5 w-5 " />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-[190px] rounded-2xl bg-background p-0 shadow-xl  dark:bg-[#181818]"
      >
        <DropdownMenuItem
          onClick={copyLinkToClipboard}
          className="cursor-pointer select-none rounded-none px-4 py-3 text-[15px] font-semibold tracking-normal  focus:bg-transparent  active:bg-primary-foreground"
        >
          Copy link
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-0 h-[1.2px]" />
        <DropdownMenuItem
          onClick={copyLinkToClipboard}
          className="cursor-pointer select-none rounded-none px-4 py-3 text-[15px] font-semibold tracking-normal focus:bg-transparent active:bg-primary-foreground "
        >
          Copy embed code
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareButton;
