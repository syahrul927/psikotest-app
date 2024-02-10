import { CopyIcon } from "lucide-react";
import { Button } from "~/app/_components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "~/app/_components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
} from "~/app/_components/ui/table";
import Text from "~/app/_components/ui/text";
import { EducationLabel } from "../data/data";

interface InformationTesterCardProps {
	name: string;
	phone: string;
	educationId: string;
	educationDescription: string;
	address: string;
	isLoading?: boolean;
}

export default function InformationTesterCard({
	name,
	address,
	educationDescription,
	educationId,
	phone,
	isLoading,
}: InformationTesterCardProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Informasi Peserta</CardTitle>
				<p className="text-muted-foreground text-sm">
					Data di isi sendiri oleh peserta
				</p>
			</CardHeader>
			<CardContent>
				<Table>
					<TableBody>
						<TableRow>
							<TableHead>Nama</TableHead>
							<TableCell className="text-right">
								<Text str={name} isLoading={isLoading} />
							</TableCell>
						</TableRow>
						<TableRow>
							<TableHead>No Telepon</TableHead>
							<TableCell className="text-right">
								<Button variant={"link"} className="px-0">
									<CopyIcon size={16} />
									<Text str={phone} isLoading={isLoading} />
								</Button>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableHead>Pendidikan</TableHead>
							<TableCell className="text-right ">
								<Text
									str={
										EducationLabel.find(
											(item) => item.id === educationId,
										)?.label ?? "Unknown"
									}
									isLoading={isLoading}
								/>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableHead>Jurusan/Deskripsi Pendidikan</TableHead>
							<TableCell className="text-right max-w-sm">
								<Text
									str={educationDescription}
									isLoading={isLoading}
								/>
							</TableCell>
						</TableRow>

						<TableRow>
							<TableHead>Alamat</TableHead>
							<TableCell className="text-right max-w-sm">
								<Text str={address} isLoading={isLoading} />
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
