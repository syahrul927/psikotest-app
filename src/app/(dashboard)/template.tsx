"use client";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import PathLabel, { type LabelType } from "~/lib/url-label";
import { fuzzyComparison } from "~/lib/utils";
import { Separator } from "../_components/ui/separator";

type TemplateDashboardProps = {
	children: React.ReactNode;
};
const TemplateDashboard = ({ children }: Readonly<TemplateDashboardProps>) => {
	const pathname = usePathname();
	const header = useMemo<LabelType>(
		() =>
			PathLabel.find((item) => fuzzyComparison(pathname, item.url)) ?? {
				label: "undefined",
				url: "",
			},
		[pathname],
	);
	return (
		<div className="container flex flex-col">
			{header && (
				<div className="flex flex-col py-2">
					<p className="text-4xl font-bold">{header.label}</p>
					{header.description && (
						<p className="text-muted-foreground">
							{header.description}
						</p>
					)}
				</div>
			)}

			<Separator className="my-4" />
			{children}
		</div>
	);
};
export default TemplateDashboard;
