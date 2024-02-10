"use client";
import { ChevronRight, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { Button } from "../../_components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../../_components/ui/dropdown-menu";
import { Label } from "../../_components/ui/label";
import AvatarUser from "~/app/_components/avatar-user";

interface UserProfileNavProps {
	isCollapsed: boolean;
}
const UserProfileNav = ({ isCollapsed }: UserProfileNavProps) => {
	const { data } = useSession();
	return (
		<div className="w-full px-2">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant={"ghost"}
						data-collapsed={isCollapsed}
						className="px-2 group flex gap-3 items-center my-4 py-6 w-full"
					>
						<AvatarUser
							name={data?.user.name ?? ""}
							img={data?.user.image}
						/>
						<Label className="font-semibold group-[[data-collapsed=true]]:hidden text-ellipsis overflow-hidden">
							{data?.user.name}
						</Label>
						<ChevronRight
							size={20}
							className="ml-auto group-[[data-collapsed=true]]:hidden"
						/>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-56">
					<DropdownMenuLabel>Setting Profile</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={() => signOut()}>
						<LogOut className="mr-2 h-4 w-4" />
						<span>Log out</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};
export default UserProfileNav;
