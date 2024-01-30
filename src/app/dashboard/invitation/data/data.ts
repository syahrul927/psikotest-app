import {
	CheckCircledIcon,
	CircleIcon,
	StopwatchIcon,
} from "@radix-ui/react-icons";

export const statuses = [
	{
		value: "PENDING",
		label: "Pending",
		icon: CircleIcon,
	},
	{
		value: "DONE",
		label: "Done",
		icon: CheckCircledIcon,
	},
	{
		value: "ONPROGRESS",
		label: "On Progress",
		icon: StopwatchIcon,
	},
];
