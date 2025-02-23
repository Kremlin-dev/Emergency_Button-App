'use client';

import React from "react";
import Link from "next/link";
import Text from "./Text";
import { usePathname } from "next/navigation";

interface MediaProps {
  children: React.ReactNode;
  text: string;
  link: string;
}

const Media = ({ children, text, link }: MediaProps) => {
  const pathname = usePathname();
  const isActive = pathname === `/${link}`;

  return (
    <Link
      href={`/${link}`}
      className={`flex items-center space-x-2 cursor-pointer transition-colors duration-200 ${
        isActive ? "text-blue-500" : "text-white hover:text-blue-400"
      }`}
    >
      {children}
      <Text>{text}</Text>
    </Link>
  );
};

export default Media;
