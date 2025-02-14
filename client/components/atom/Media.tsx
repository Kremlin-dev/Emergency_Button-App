import React from "react";
import Text from "./Text";
import Image from "next/image";
import { Link } from "lucide-react";

interface MediaProps {
    src: string;
    alt: string;
    text: string;
    link: string;
}

const Media = ({src, alt, text, link}: MediaProps) => {
  return (
    <Link href={`/${link}`}>
      <Image
        src={src}
        alt={alt}
        width={300}
        height={100}
      />
      <Text>{text}</Text>
    </Link>
  );
};

export default Media;
