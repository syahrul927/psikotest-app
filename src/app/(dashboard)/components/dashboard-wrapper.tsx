"use client";

import { useState } from "react";
import { ModeToggle } from "~/app/_components/mode-toggle";
import Menus from "~/lib/menus";
import { cn } from "~/lib/utils";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "../../_components/ui/resizable";
import { Separator } from "../../_components/ui/separator";
import { TooltipProvider } from "../../_components/ui/tooltip";
import { Nav } from "./nav";
import UserProfileNav from "./user-profile-nav";

interface DashboardWrapperProps {
	children: React.ReactNode;
}

const DashboardWrapper = ({ children }: DashboardWrapperProps) => {
	const [isCollapsed, setIsCollapsed] = useState(false);
	return (
		<>
			<div className="hidden sm:block w-full">
				<TooltipProvider delayDuration={0}>
					<ResizablePanelGroup
						direction="horizontal"
						className="rounded-lg border"
					>
						<ResizablePanel
							defaultSize={14}
							maxSize={14}
							minSize={14}
							collapsedSize={5}
							collapsible
							onExpand={() => {
								setIsCollapsed(false);
							}}
							onCollapse={() => {
								setIsCollapsed(true);
							}}
							className={cn(
								isCollapsed
									? "min-w-[50px] transition-all duration-300 ease-in-out"
									: "max-w-[14%]",
								"flex flex-col",
							)}
						>
							<UserProfileNav isCollapsed={isCollapsed} />
							<Separator />
							<Nav links={Menus} isCollapsed={isCollapsed} />
							<div className="mt-auto flex flex-col">
								<Separator />
								<div className="py-4 flex justify-center items-center ">
									<ModeToggle />
								</div>
							</div>
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel>
							<div className="h-screen p-8 overflow-y-auto pb-16">
								{children}
							</div>
						</ResizablePanel>
					</ResizablePanelGroup>
				</TooltipProvider>
			</div>
			<div className="h-screen overflow-y-auto pb-16">
				<div className="container pt-8 block sm:hidden ">
					{children}
				</div>
			</div>
		</>
	);
};

export default DashboardWrapper;
