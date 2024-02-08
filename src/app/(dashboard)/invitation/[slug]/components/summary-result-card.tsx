import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
} from "~/app/_components/ui/card";
import {
	TableBody,
	TableRow,
	TableHead,
	TableCell,
	Table,
} from "~/app/_components/ui/table";
import Text from "~/app/_components/ui/text";

interface SummaryResultCartProps {
	isLoading?: boolean;
	totalAnswered: number;
	wrongAnswered: number;
	highest: number;
	lowest: number;
	deciel: number;
}
export function SummaryResultCart({
	deciel,
	highest,
	lowest,
	isLoading,
	totalAnswered,
	wrongAnswered,
}: SummaryResultCartProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Hasil Penilaian</CardTitle>
			</CardHeader>
			<CardContent>
				<Table>
					<TableBody>
						<TableRow>
							<TableHead>
								Jumlah Hitungan (total terjawab)
							</TableHead>
							<TableCell className="text-right">
								<Text
									str={totalAnswered}
									isLoading={isLoading}
								/>
							</TableCell>
						</TableRow>

						<TableRow>
							<TableHead>Jumlah Kesalahan</TableHead>
							<TableCell className="text-right">
								<Text
									str={wrongAnswered}
									isLoading={isLoading}
								/>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableHead>Puncak Tertinggi</TableHead>
							<TableCell className="text-right">
								<Text str={highest} isLoading={isLoading} />
							</TableCell>
						</TableRow>

						<TableRow>
							<TableHead>Puncak Terendah</TableHead>
							<TableCell className="text-right">
								<Text str={lowest} isLoading={isLoading} />
							</TableCell>
						</TableRow>

						<TableRow>
							<TableHead>
								Deciel{" "}
								<span className="text-muted-foreground text-xs inline italic">
									((Puncak Tertinggi + Puncak Terendah )/ 2)
								</span>
							</TableHead>
							<TableCell className="text-right">
								<Text str={deciel} isLoading={isLoading} />
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
