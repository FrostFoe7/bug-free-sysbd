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
        <div className="ring-border relative z-0 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ring-1 select-none">
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
              className="ring-border relative z-0 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ring-1 select-none"
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
        <div className="relative top-2 left-0 h-9 w-[48px]">
          <img
            src={author[0]?.image ?? ""}
            alt={author[1]?.username}
            className="ring-border absolute top-0 left-[25px] h-[16px] w-[16px] rounded-full ring-1"
          />

          <img
            src={author[1]?.image ?? ""}
            alt={author[1]?.username}
            className="ring-border absolute top-4 left-[18px] h-[12px] w-[12px] rounded-full ring-1"
          />

          <img
            src={author[2]?.image ?? ""}
            alt={author[2]?.username}
            className="ring-border absolute top-0.5 left-2 h-[14px] w-[14px] rounded-full ring-1"
          />
        </div>
      )}
    </div>
  );
};

export default UserRepliesImages;
