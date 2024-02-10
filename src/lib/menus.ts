import { SendIcon, UsersIcon } from "lucide-react";
import { type NavLinkProps } from "~/app/(dashboard)/components/nav";

const Menus: NavLinkProps[] = [
	{
		title: "Invitation",
		icon: SendIcon,
		url: "/",
		variant: "ghost",
	},
	{
		title: "User Access",
		icon: UsersIcon,
		url: "/user",
		variant: "ghost",
	},
];
export default Menus;
