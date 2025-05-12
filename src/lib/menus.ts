import { BrainCog, CalculatorIcon, HomeIcon, UsersIcon } from "lucide-react";
import { type NavLinkProps } from "~/app/(dashboard)/components/nav";

const Menus: NavLinkProps[] = [
	{
		title: "Home",
		icon: HomeIcon,
		url: "/",
		variant: "ghost",
	},
	{
		title: "Invitation Kraeplin",
		icon: CalculatorIcon,
		url: "/invitation-kraeplin",
		variant: "ghost",
	},
	{
		title: "Invitation IST",
		icon: BrainCog,
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
