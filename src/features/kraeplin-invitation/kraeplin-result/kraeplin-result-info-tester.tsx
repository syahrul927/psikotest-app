import { CopyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { EducationLabel } from "@/types/kraeplin-invitation-constanta";

interface KraeplinResultInfoTesterProps {
	name: string;
	phone: string;
	educationId: string;
	educationDescription: string;
	address: string;
	isLoading?: boolean;
}

export function KraeplinResultInfoTester({
	name,
	address,
	educationDescription,
	educationId,
	phone,
	isLoading,
}: KraeplinResultInfoTesterProps) {
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
							<TableCell className="text-right">{name}</TableCell>
						</TableRow>
						<TableRow>
							<TableHead>No Telepon</TableHead>
							<TableCell className="text-right">
								<Button
									variant={"link"}
									onClick={async () => {
										toast.success("Berhasil Copy Contact ke Clipboard");
										return navigator.clipboard.writeText(phone);
									}}
									className="px-0"
								>
									<CopyIcon size={16} />
									{phone}
								</Button>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableHead>Pendidikan</TableHead>
							<TableCell className="text-right">
								{EducationLabel.find((item) => item.id === educationId)
									?.label ?? "Unknown"}
							</TableCell>
						</TableRow>
						<TableRow>
							<TableHead>Jurusan/Deskripsi Pendidikan</TableHead>
							<TableCell className="max-w-sm text-right">
								{educationDescription}
							</TableCell>
						</TableRow>

						<TableRow>
							<TableHead>Alamat</TableHead>
							<TableCell className="max-w-sm text-right">{address}</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
