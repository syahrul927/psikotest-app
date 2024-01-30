export type LabelType = { label: string; description?: string; url: string };
const PathLabel: LabelType[] = [
	{
		label: "Home",
		url: "/dashboard",
		description: "Aktifitas Terakhir",
	},
	{
		label: "Invitation",
		url: "/dashboard/invitation*",
		description: "Tempat mengatur undangan psikotest",
	},
];
export default PathLabel;
