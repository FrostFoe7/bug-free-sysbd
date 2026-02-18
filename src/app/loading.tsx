import Image from "next/image";
import React from "react";

export default function RootLoading() {
  const LogoImage = "/logo.png";
  const MetaImage = "/meta.png";

  return (
    <div className="flex h-screen flex-col justify-between">
      <div className="flex grow items-center justify-center">
        <Image
          alt="Sysm"
          src={LogoImage}
          width={100}
          height={100}
          priority
        />
      </div>
      <div className="mb-6 flex w-full items-center justify-center">
        <Image
          priority
          alt="Meta"
          src={MetaImage}
          width={90}
          height={90}
          className="w-auto"
        />
      </div>
    </div>
  );
}
