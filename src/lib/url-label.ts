export type LabelType = { label: string; description?: string; url: string };
const PathLabel: LabelType[] = [
	{
		label: "Invitation IST",
		url: "/invitation-ist*",
		description: "Manage invitations for the IST test",
	},
	{
		label: "Invitation Kraeplin",
		url: "/invitation-kraeplin*",
		description: "Manage invitations for the Kraeplin test",
	},
	{
		label: "User Access",
		url: "/user*",
		description: "Manage user access to the system",
	},
	{
		label: "Home",
		url: "/*",
		description: "The main page for managing psychometric test invitations",
	},
];
export default PathLabel;
