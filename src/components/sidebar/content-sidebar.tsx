"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import { NavigationType } from "./types";

interface ContentSidebarProps extends React.HTMLAttributes<HTMLElement> {
  items: Omit<NavigationType, "code" | "icon">[];
}

export function ContentSidebar({
  className,
  items,
  ...props
}: ContentSidebarProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className,
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.url}
          href={item.url}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === item.url
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline",
            "justify-start",
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
