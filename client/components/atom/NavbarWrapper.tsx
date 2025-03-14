"use client";

import { usePathname } from "next/navigation";
import Navbar from "../molecule/Navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();

  const noNavbarRoutes = ["/login"];

  if (noNavbarRoutes.includes(pathname)) return null;

  return <Navbar />;
}
