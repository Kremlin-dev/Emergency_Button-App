import React from "react";
import Text from "./Text";
import Image from "next/image";
import { Link } from "lucide-react";

interface MediaProps {
    logo: string;
    text: string;
    link: string;
}

const Media = ({text, link, logo}: MediaProps) => {
  return (
    <Link href={`/${link}`}>
       <{logo}/>
      <Text>{text}</Text>
    </Link>
  );
};

export default Media;
