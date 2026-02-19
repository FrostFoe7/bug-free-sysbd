"use client";

import React from "react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { api } from "@/trpc/react";
import Loading from "@/app/(pages)/loading";
import Username from "@/components/user/user-username";
import { cn, formatTimeAgo, truncateText } from "@/lib/utils";
import UserNotificationAvtar from "@/components/user/user-notification-avatar";
import Error from "@/app/error";
import FollowButton from "@/components/buttons/follow-button";

export default function ActivityPage() {
  const { data, isLoading, isError } =
    api.notification.getNotification.useQuery();

  if (isLoading) return <Loading />;
  if (isError || !data) return <Error />;

  const { notifications } = data;
  const reversedNotifications = [...notifications].reverse();

  return (
    <>
      {data && data.notifications.length > 0 ? (
        reversedNotifications.map((activity, index) => (
          <div
            key={index}
            className={cn("mt-4 flex w-full", {
              "mb-[15vh]": index == reversedNotifications.length - 1,
            })}
          >
            <UserNotificationAvtar
              username={activity.senderUser.username}
              image={activity.senderUser.image ?? ""}
              fullname={activity.senderUser.fullname ?? ""}
              type={activity.type}
            />
            <div className="ml-3 flex w-full flex-col">
              <div className="flex w-full items-center justify-between">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <Username author={activity.senderUser} />
                    <time className="text-muted-foreground ml-3 text-[15px] leading-none">
                      {formatTimeAgo(activity.createdAt)}
                    </time>
                  </div>
                  <Link href={`/@${activity.senderUser.username}`}>
                    {activity.type !== "ADMIN" ? (
                      <div className="text-[15px] leading-0 tracking-wide whitespace-pre-line text-[#6A6A6A]">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: truncateText(activity.message, 100)
                              .slice(1, -1)
                              .replace(/\\n/g, "\n"),
                          }}
                        />
                      </div>
                    ) : (
                      <span className="text-accent-foreground text-[15px] leading-5 tracking-wide">
                        {activity.message}
                      </span>
                    )}
                  </Link>
                </div>
                {activity.type === "FOLLOW" && (
                  <FollowButton
                    className="px-6 text-[14px]"
                    variant="outline"
                    author={activity.senderUser}
                  />
                )}
              </div>
              <Separator className="mt-3" />
            </div>
          </div>
        ))
      ) : (
        <div className="flex h-[50vh] w-full items-center justify-center text-[#777777]">
          <p>No notifications.</p>
        </div>
      )}
    </>
  );
}
