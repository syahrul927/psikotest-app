"use client";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { NavigationMainConstant } from "./navigation-menu";

function getActiveMenuTitle(pathname: string): string | undefined {
  // Sort menus by longest path first to prioritize specific matches
  const sortedMenus = [...NavigationMainConstant].sort(
    (a, b) => b.url.length - a.url.length,
  );

  const match = sortedMenus.find((menu) => {
    if (menu.url === "/") {
      return pathname === "/";
    }
    return pathname === menu.url || pathname.startsWith(`${menu.url}/`);
  });

  return match?.title;
}
export function SiteHeader() {
  const pathname = usePathname();
  const title = getActiveMenuTitle(pathname);
  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{title}</h1>
      </div>
    </header>
  );
}
