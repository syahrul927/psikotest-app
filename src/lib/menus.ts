import {
	HomeIcon,
	MessageSquareShareIcon,
	SettingsIcon,
	Users2Icon,
} from "lucide-react";
import { type NavLinkProps } from "~/app/(dashboard)/components/nav";

const Menus: NavLinkProps[] = [
	{
		title: "Home",
		icon: HomeIcon,
		description: "Summary of the data you have",
		url: "/",
		variant: "ghost",
	},
	{
		title: "Products",
		description: "Manage your products with funny way",
		icon: MessageSquareShareIcon,
		url: "/products",
		variant: "ghost",
	},
	{
		title: "Customers",
		icon: Users2Icon,
		url: "/customers",
		description: "View all your customers here",
		variant: "ghost",
	},
	{
		title: "Settings",
		icon: SettingsIcon,
		url: "/",
		variant: "ghost",
	},
];
export default Menus;
