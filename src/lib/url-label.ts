export type LabelType = { label: string; description?: string; url: string };
const PathLabel: LabelType[] = [
	{
		label: "Home",
		url: "/",
		description: "Aktifitas Terakhir",
	},
	{
		label: "Invitation",
		url: "/invitation*",
		description: "Tempat mengatur undangan psikotest",
	},
];
export default PathLabel;
