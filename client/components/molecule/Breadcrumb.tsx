"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Breadcrumb() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);

  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/");
    const label = segment.charAt(0).toUpperCase() + segment.slice(1);
    return { href, label };
  });

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center space-x-2 text-sm text-gray-600">
        <li>
          <Link href="/" className="cursor-pointer hover:underline">
            Home
          </Link>
        </li>
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.href}>
            <li>/</li>
            <li>
              {index === breadcrumbs.length - 1 ? (
                <span className="font-medium text-gray-800">
                  {crumb.label}
                </span>
              ) : (
                <Link href={crumb.href} className="cursor-pointer hover:underline">
                  {crumb.label}
                </Link>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
