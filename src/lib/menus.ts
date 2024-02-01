import { HomeIcon, SendIcon } from "lucide-react";
import { type NavLinkProps } from "~/app/(dashboard)/components/nav";

const Menus: NavLinkProps[] = [
	{
		title: "Home",
		icon: HomeIcon,
		url: "/",
		variant: "ghost",
	},
	{
		title: "Invitation",
		icon: SendIcon,
		url: "/invitation",
		variant: "ghost",
	},
];
export default Menus;
