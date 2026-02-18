import React from "react";
import { Icons } from "@/components/icons";
import type { PostCardProps } from "@/types";
import useDialog from "@/store/dialog";

interface QuoteButtonProps {
  quoteInfo: Pick<PostCardProps, "id" | "text" | "author"> & {
    createdAt?: Date;
  };
}

const QuoteButton: React.FC<QuoteButtonProps> = ({ quoteInfo }) => {
  const { setOpenDialog, setQuoteInfo } = useDialog();
  return (
    <div
      className="flex w-full items-center justify-between"
      onClick={() => {
        setOpenDialog(true);
        setQuoteInfo(quoteInfo);
      }}
    >
      Quote
      <Icons.quote className="h-5 w-5" />
    </div>
  );
};

export default QuoteButton;
