"use client";

import React from "react";
import { Icons } from "@/components/icons";
import { ChevronRight } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import { api } from "@/trpc/react";
import { usePathname, useRouter } from "next/navigation";
import Username from "@/components/user/user-username";
import Link from "next/link";
import FollowButton from "@/components/buttons/follow-button";

export default function SearchContainer() {
  const router = useRouter();
  const path = usePathname();
  const [searchValue, setSearchValue] = React.useState("");
  const debouncedSearch = useDebounce(searchValue, 2000);

  return (
    <>
      {searchValue !== "" && (
        <div className="bg-background/70 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 backdrop-blur-xs" />
      )}

      <div
        className={cn(
          "border-border bg-primary-foreground absolute z-80 mb-3 w-full max-w-xl rounded-2xl border transition-transform duration-300",
          {
            "bg-background dark:bg-primary-foreground scale-105":
              searchValue !== "",
            "scale-100": searchValue === "",
          },
        )}
      >
        <div className="ring-offset-background placeholder:text-muted-foreground relative flex h-[60px] w-full px-3 py-2 pl-14">
          <Icons.search className="absolute top-2/4 left-6 h-4 w-4 -translate-y-2/4 text-[#4D4D4D]" />
          <input
            value={searchValue}
            className="w-full resize-none bg-transparent text-base outline-hidden placeholder:text-[15px] placeholder:text-[#777777]"
            placeholder="Search"
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        {searchValue !== "" && (
          <div className="no-scrollbar border-border max-h-[60vh] flex-1 overflow-y-auto border-t">
            <div className="flex w-full items-center">
              <div className="mx-[30px]">
                <Icons.search className="h-4 w-4 text-[#4D4D4D]" />
              </div>
              <div
                onClick={() => {
                  router.push(`${path}?q=${searchValue}`);
                  setSearchValue("");
                }}
                className="mr-6 flex w-full cursor-pointer items-center justify-between py-5"
              >
                <div className="text-base font-semibold tracking-normal">
                  Search for <span>&quot;{searchValue}&quot;</span>
                </div>
                <ChevronRight className="h-5 w-5" />
              </div>
            </div>
            <DisplaySearchedResults debouncedSearch={debouncedSearch} />
          </div>
        )}
      </div>
    </>
  );
}

interface DisplaySearchedResultsProps {
  debouncedSearch: string;
}

const DisplaySearchedResults: React.FC<DisplaySearchedResultsProps> = ({
  debouncedSearch,
}) => {
  const { data, isLoading } = api.search.allUsers.useQuery({ debouncedSearch });

  if (isLoading) {
    return (
      <div className="flex h-[100px] w-full items-center justify-center">
        <Icons.loading className="h-11 w-11" />
      </div>
    );
  }

  if (data?.length === 0) return;
  return (
    <>
      {data?.map((user, index) => (
        <div key={index} className="flex w-full items-center">
          <button className="mx-5">
            <div className="outline-border h-9 w-9 rounded-full outline-1 outline-solid">
              <Avatar className="h-full w-full rounded-full">
                <AvatarImage src={user.image ?? ""} alt={user.fullname ?? ""} />
                <AvatarFallback>OG</AvatarFallback>
              </Avatar>
            </div>
          </button>
          <div className="border-border mr-6 flex w-full items-center justify-between border-t py-4">
            <Link href={`/@`} className="flex w-full flex-col gap-1.5">
              <div className="flex w-full flex-col">
                <div className="flex">
                  <Username author={user} />
                  {/* TODO: This is temp solution */}
                  <div className="invisible h-3 w-3">
                    <Icons.verified className="h-3 w-3" />
                  </div>
                </div>
                <span className="mt-1 text-[14px] tracking-wide text-[#6A6A6A]">
                  {user.fullname}
                </span>
              </div>
            </Link>
            <FollowButton
              className="px-6 text-[14px]"
              variant="outline"
              author={{ ...user }}
            />
          </div>
        </div>
      ))}
    </>
  );
};
