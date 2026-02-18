import React from "react";

export type UserRepliesImagesProps = {
  author: {
    id: string;
    username: string;
    image: string | null;
  }[];
};

const UserRepliesImages: React.FC<UserRepliesImagesProps> = ({ author }) => {
  return (
    <div>
      {author?.length === 1 && (
        <div className="relative z-0 flex h-4 w-4 shrink-0 select-none items-center justify-center rounded-full ring-1 ring-border">
          <img
            className="h-full w-full rounded-full object-cover object-center"
            src={author[0]?.image ?? ""}
            alt={author[0]?.username}
          />
        </div>
      )}

      {author?.length === 2 && (
        <div className="z-0 flex items-center -space-x-2">
          {author.map((authorData, index) => (
            <div
              key={index}
              className="relative z-0 flex h-4 w-4 shrink-0 select-none items-center justify-center rounded-full ring-1 ring-border"
            >
              <img
                className="h-full w-full rounded-full object-cover object-center"
                src={authorData.image ?? ""}
                alt={authorData.username}
              />
            </div>
          ))}
        </div>
      )}

      {author?.length >= 3 && (
        <div className="relative left-0 top-2 h-9 w-[48px] ">
          <img
            src={author[0]?.image ?? ""}
            alt={author[1]?.username}
            className="absolute left-[25px] top-0 h-[16px] w-[16px] rounded-full ring-1 ring-border"
          />

          <img
            src={author[1]?.image ?? ""}
            alt={author[1]?.username}
            className=" absolute left-[18px] top-4 h-[12px] w-[12px] rounded-full  ring-1 ring-border"
          />

          <img
            src={author[2]?.image ?? ""}
            alt={author[2]?.username}
            className="absolute left-2 top-0.5 h-[14px] w-[14px] rounded-full ring-1 ring-border"
          />
        </div>
      )}
    </div>
  );
};

export default UserRepliesImages;
