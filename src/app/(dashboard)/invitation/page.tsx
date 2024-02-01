"use client";
import {
	Layers2Icon,
	LayersIcon,
	PartyPopperIcon,
	SparkleIcon,
} from "lucide-react";
import { DataTable } from "~/app/_components/table/data-table";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "~/app/_components/ui/card";
import { api } from "~/trpc/react";
import { columnsPost } from "./components/table/column-invitation";
import { useToast } from "~/app/_components/ui/use-toast";
import {
	CheckCircledIcon,
	CircleIcon,
	InfoCircledIcon,
	StopwatchIcon,
} from "@radix-ui/react-icons";

export default function DashboardInvitationPage() {
	const { data, refetch } = api.invitation.getAll.useQuery();
	const { toast } = useToast();
	const { mutate: onDelete } = api.invitation.deleteById.useMutation({
		onSuccess: () => {
			toast({
				title: "Berhasil menghapus invitation",
			});
			void refetch();
		},
	});

	return (
		<div className="flex flex-col space-y-4">
			<div className="flex flex-col space-y-4">
				<SummaryInvitation
					total={data?.total}
					done={data?.done}
					onProgress={data?.onProgress}
					pending={data?.pending}
				/>
			</div>
			<Card>
				<CardHeader className="flex ">
					<CardTitle>List</CardTitle>
					<p className="text-muted-foreground text-sm">
						Undangan yang pernah dibuat
					</p>
				</CardHeader>
				<CardContent>
					<DataTable
						columns={columnsPost}
						data={
							data?.invitations?.map(
								({
									id,
									name,
									status,
									secretKey,
									testerProfile,
								}) => ({
									id,
									name,
									status,
									profileName: testerProfile?.name,
									secretKey,
									onDelete,
								}),
							) ?? []
						}
					/>
				</CardContent>
			</Card>
		</div>
	);
}

interface SummaryInvitationProps {
	pending?: number;
	onProgress?: number;
	done?: number;
	total?: number;
}
const SummaryInvitation = ({
	pending = 0,
	onProgress = 0,
	done = 0,
	total = 0,
}: SummaryInvitationProps) => {
	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<Card className="">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">
						Pending
					</CardTitle>
					<CircleIcon className="text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold max-w-max text-ellipsis overflow-hidden">
						{pending}
					</div>
					<p className="text-xs text-muted-foreground">
						Menunggu dikerjakan
					</p>
				</CardContent>
			</Card>
			<Card className="">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">
						On Progress
					</CardTitle>
					<StopwatchIcon className="text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{onProgress}</div>
					<p className="text-xs text-muted-foreground">
						Sedang dikerjakan
					</p>
				</CardContent>
			</Card>
			<Card className="">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Done</CardTitle>
					<CheckCircledIcon className="text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{done}</div>
					<p className="text-xs text-muted-foreground">
						Selesai dikerjakan
					</p>
				</CardContent>
			</Card>
			<Card className="">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Total</CardTitle>
					<InfoCircledIcon className="text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{total}</div>
					<p className="text-xs text-muted-foreground">
						Total keseluruhan
					</p>
				</CardContent>
			</Card>
		</div>
	);
};
