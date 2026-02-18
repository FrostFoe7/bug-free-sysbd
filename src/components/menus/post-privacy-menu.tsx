import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import usePost from "@/store/post";

const PostPrivacyMenu: React.FC = ({}) => {
  const { postPrivacy, setPostPrivacy } = usePost();

  const privacyText = {
    ["ANYONE"]: "Anyone can reply",
    ["FOLLOWED"]: "Profiles you follow can reply",
    ["MENTIONED"]: "Profiles you mention can reply",
  };

  const privacyDisplayText = React.useMemo(() => {
    return privacyText[postPrivacy];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postPrivacy]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="z-50 cursor-pointer select-none text-[15px] tracking-normal text-[#777777] outline-hidden">
          {privacyDisplayText}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className=" z-1000 mt-1 w-[190px] rounded-2xl bg-background p-0 shadow-2xl dark:bg-[#181818]"
      >
        <DropdownMenuItem
          className="cursor-pointer select-none rounded-none  px-4 py-3 text-[15px] font-semibold tracking-normal focus:bg-transparent active:bg-primary-foreground"
          onClick={() => setPostPrivacy("ANYONE")}
        >
          Anyone
        </DropdownMenuItem>
        <DropdownMenuSeparator className=" my-0 h-[1.2px]" />
        <DropdownMenuItem
          className="cursor-pointer select-none rounded-none  px-4 py-3 text-[15px] font-semibold tracking-normal focus:bg-transparent active:bg-primary-foreground"
          onClick={() => setPostPrivacy("FOLLOWED")}
        >
          Profiles you follow
        </DropdownMenuItem>
        <DropdownMenuSeparator className=" my-0 h-[1.2px]" />
        <DropdownMenuItem
          className="cursor-pointer select-none rounded-none  px-4 py-3 text-[15px] font-semibold tracking-normal focus:bg-transparent active:bg-primary-foreground"
          onClick={() => setPostPrivacy("MENTIONED")}
        >
          Mentioned only
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PostPrivacyMenu;
