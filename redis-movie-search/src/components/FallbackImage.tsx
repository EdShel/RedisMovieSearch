"use client";

import React from "react";

interface Props {
  src: string | null;
  alt: string;
}

const FallbackImage: React.FC<Props> = ({ src, alt }) => {
  const [failedLoading, setFailedLoading] = React.useState<boolean>(false);

  if (failedLoading || !src) {
    return <span className="text-gray-500">No Image Available</span>;
  }

  return (
    // Next.js can't optimize these image
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="h-full w-full object-cover"
      onError={() => {
        setFailedLoading(true);
      }}
    />
  );
};

export default FallbackImage;
