import {
	ResponsiveContainer,
	CartesianGrid,
	XAxis,
	YAxis,
	Tooltip,
	Legend,
	Line,
	LineChart,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface KraeplinResultStatisticProps {
	avarage: number;
	data: {
		name: string;
		answered: number;
	}[];
}
export function KraeplinResultStatistic({
	data,
	avarage,
}: KraeplinResultStatisticProps) {
	return (
		<Card className="col-span-2">
			<CardHeader>
				<CardTitle className="leading-tight">Statistik</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="h-80 w-full">
					<ResponsiveContainer width="100%" height="100%">
						<LineChart
							width={800}
							height={300}
							data={Array.from({ length: 40 }).map((_, idx) => {
								const index: string = (idx + 1).toString();
								const exist = data.find((d) => d.name === index);
								if (exist) {
									return {
										...exist,
										avarage,
									};
								}
								return {
									answered: 0,
									avarage,
									name: index,
								};
							})}
							margin={{
								top: 5,
								right: 30,
								left: 20,
								bottom: 5,
							}}
						>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="name" />
							<YAxis />
							<Tooltip />
							<Legend />
							<Line
								type="monotone"
								dataKey="avarage"
								name="Rata - Rata"
								strokeWidth={1}
								stroke="#94a3b8"
							/>
							<Line
								type="monotone"
								strokeWidth={2}
								activeDot={{ r: 8 }}
								dataKey="answered"
								name="Total Jawaban"
								stroke="#475569"
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>
			</CardContent>
		</Card>
	);
}
