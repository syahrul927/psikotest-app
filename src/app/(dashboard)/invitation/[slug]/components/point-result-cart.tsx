import {
	EyeOpenIcon,
	FaceIcon,
	LightningBoltIcon,
	BarChartIcon,
} from "@radix-ui/react-icons";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "~/app/_components/ui/card";
import Text from "~/app/_components/ui/text";
import { DataNorma, type NormaType } from "~/server/data/norma";

interface PointResultCartProps {
	educationId: string;
	panker: number;
	janker: number;
	tianker: number;
	hanker: number;
	isLoading?: boolean;
}
export default function PointResultCart({
	educationId,
	hanker,
	janker,
	panker,
	tianker,
	isLoading,
}: PointResultCartProps) {
	const data = educationSelector(educationId);
	const labelPanker = getLabel(panker, data);
	const labelJanker = getLabel(janker, data);
	const labelTianker = getLabel(tianker, data);
	const labelHanker = getLabel(hanker, data);
	return (
		<div className="col-span-2 grid grid-cols-4 gap-6">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">
						Panker
						<span className="inline italic text-muted-foreground text-sm">
							(Kecepatan Kerja)
						</span>
					</CardTitle>
					<LightningBoltIcon className="text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
						<Text isLoading={isLoading} str={panker} />
					</div>
					<p className="text-xs text-muted-foreground">
						{labelPanker}
					</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">
						Janker
						<span className="inline italic text-muted-foreground ">
							(Emosi)
						</span>
					</CardTitle>
					<FaceIcon className="text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
						<Text isLoading={isLoading} str={janker} />
					</div>
					<p className="text-xs text-muted-foreground">
						{labelJanker}
					</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">
						Tianker
						<span className="inline italic text-muted-foreground ">
							(Konsentrasi)
						</span>
					</CardTitle>
					<EyeOpenIcon className="text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
						<Text isLoading={isLoading} str={tianker} />
					</div>
					<p className="text-xs text-muted-foreground">
						{labelTianker}
					</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">
						Hanker
						<span className="inline italic text-muted-foreground ">
							(Ketahanan Kerja)
						</span>
					</CardTitle>
					<BarChartIcon className="text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
						<Text isLoading={isLoading} str={hanker} />
					</div>
					<p className="text-xs text-muted-foreground">
						{labelHanker}
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
const educationSelector = (id: string) => {
	return DataNorma.find((data) => data.id === id);
};
const getLabel = (value: number, data?: NormaType) => {
	if (!data) {
		return "-";
	}
	return data.panker.reduce((prev, aft) => {
		if (operator(value, aft.value, aft.operator)) {
			return aft.label;
		}
		return prev;
	}, "-");
};
const operator = (a: number, b: number, operator: string) => {
	switch (operator) {
		case ">=":
			return a >= b;

		case "<=":
			return a <= b;
		default:
			return false;
	}
};
