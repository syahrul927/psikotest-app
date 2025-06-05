"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { NavigationMainConstant } from "./navigation-menu";
import { Logo } from "@/components/ui/logo";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data, status } = useSession();
  const isLoading = status === "loading";
  return (
    <Sidebar variant="inset" collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Logo />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={NavigationMainConstant} isLoading={isLoading} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data?.user} isLoading={isLoading} />
      </SidebarFooter>
    </Sidebar>
  );
}
