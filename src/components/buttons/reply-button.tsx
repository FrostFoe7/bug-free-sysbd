import React from "react";
import { Icons } from "@/components/icons";
import useDialog from "@/store/dialog";
import type { ParentPostInfo } from "@/types";
import { useSupabaseAuth } from "@/components/providers/supabase-provider";
import { useRouter } from "next/navigation";

interface ReplyButtonProps {
  replyThreadInfo: ParentPostInfo;
}

const ReplyButton: React.FC<ReplyButtonProps> = ({ replyThreadInfo }) => {
  const { setOpenDialog, setReplyPostInfo } = useDialog();
  const { user: loggedUser } = useSupabaseAuth();
  const router = useRouter();

  return (
    <div
      className="hover:bg-primary flex h-fit w-fit items-center justify-center rounded-full p-2 active:scale-95"
      onClick={() => {
        if (!loggedUser) {
          router.push("/login");
          return;
        }
        setOpenDialog(true);
        setReplyPostInfo(replyThreadInfo);
      }}
    >
      <Icons.reply className="h-5 w-5" />
    </div>
  );
};

export default ReplyButton;
