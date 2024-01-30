import { HomeIcon, SendIcon } from "lucide-react";
import { type NavLinkProps } from "~/app/dashboard/components/nav";

const Menus: NavLinkProps[] = [
	{
		title: "Home",
		icon: HomeIcon,
		url: "/dashboard/",
		variant: "ghost",
	},
	{
		title: "Invitation",
		icon: SendIcon,
		url: "/dashboard/invitation",
		variant: "ghost",
	},
];
export default Menus;
