"use client";

import {
	ArchiveIcon,
	CheckCircledIcon,
	DotFilledIcon,
	StopwatchIcon,
} from "@radix-ui/react-icons";
import { useState } from "react";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/app/_components/ui/card";

export default function DashboardPage() {
	// State for active tab (filter)
	const [activeTab, setActiveTab] = useState("All");

	// Filter activities based on tab selection
	const filteredActivities = activityData.filter(
		(activity) => activeTab === "All" || activity.type === activeTab,
	);

	return (
		<div className="p-6 flex w-full gap-6">
			{/* Kraepelin Section */}
			<div className="flex flex-col space-y-6 w-full">
				<StatSection
					title="Kraepelin"
					stats={{ total: 200, pending: 45, progress: 15, done: 140 }}
				/>
				<StatSection
					title="IST"
					stats={{ total: 150, pending: 30, progress: 10, done: 110 }}
				/>
			</div>
			<Card className="flex flex-col basis-1/2 max-h-[60vh]">
				<CardHeader>
					<CardTitle>Recent Activity</CardTitle>
				</CardHeader>
				{/* Make content scrollable with max height */}
				<CardContent className="space-y-4 flex-1 overflow-y-auto max-h-max">
					{filteredActivities.map((activity, index) => (
						<Card key={index} className="border-muted bg-muted/50">
							<CardContent className="p-4">
								<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
									<div>
										<p className="text-sm font-medium">
											{activity.name}
										</p>
										<p className="text-xs text-muted-foreground">
											{activity.date}
										</p>
									</div>
									<div className="text-sm text-muted-foreground">
										<span className="mr-2">
											{activity.type}
										</span>
										<span
											className={`px-2 py-1 text-xs rounded font-medium ${
												activity.status === "Done"
													? "bg-green-100 text-green-700"
													: activity.status ===
														  "Pending"
														? "bg-yellow-100 text-yellow-700"
														: "bg-blue-100 text-blue-700"
											}`}
										>
											{activity.status}
										</span>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</CardContent>
			</Card>
		</div>
	);
}

// Section for each test
function StatSection({
	title,
	stats,
}: {
	title: string;
	stats: { total: number; pending: number; progress: number; done: number };
}) {
	return (
		<div className="space-y-2 shrink-0">
			<h3 className="text-lg font-semibold">{title}</h3>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<StatCard
					title="Total Created"
					icon={<ArchiveIcon />}
					value={stats.total}
					footer="All invitations"
				/>
				<StatCard
					title="Pending"
					icon={<DotFilledIcon className="text-yellow-500" />}
					value={stats.pending}
					footer="Waiting to be done"
				/>
				<StatCard
					title="On Progress"
					icon={<StopwatchIcon className="text-blue-500" />}
					value={stats.progress}
					footer="Currently being taken"
				/>
				<StatCard
					title="Done"
					icon={<CheckCircledIcon className="text-green-600" />}
					value={stats.done}
					footer="Tests completed"
				/>
			</div>
		</div>
	);
}

// Stat Card Component
function StatCard({
	title,
	icon,
	value,
	footer,
}: {
	title: string;
	icon: React.ReactNode;
	value: string | number;
	footer: string;
}) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">{title}</CardTitle>
				{icon}
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{value}</div>
			</CardContent>
			<CardFooter>
				<p className="text-xs text-muted-foreground">{footer}</p>
			</CardFooter>
		</Card>
	);
}

// Dummy activity data
const activityData = [
	{
		name: "Jane Smith",
		date: "May 10, 2025 - 10:32 AM",
		type: "IST",
		status: "Done",
	},
	{
		name: "John Doe",
		date: "May 10, 2025 - 09:15 AM",
		type: "Kraepelin",
		status: "Pending",
	},
	{
		name: "Alex Tan",
		date: "May 9, 2025 - 04:22 PM",
		type: "Kraepelin",
		status: "On Progress",
	},
	{
		name: "Lily Rose",
		date: "May 8, 2025 - 11:40 AM",
		type: "IST",
		status: "Pending",
	},
	{
		name: "Lily Rose",
		date: "May 8, 2025 - 11:40 AM",
		type: "IST",
		status: "Pending",
	},
	{
		name: "Lily Rose",
		date: "May 8, 2025 - 11:40 AM",
		type: "IST",
		status: "Pending",
	},
	{
		name: "Lily Rose",
		date: "May 8, 2025 - 11:40 AM",
		type: "IST",
		status: "Pending",
	},
	{
		name: "Lily Rose",
		date: "May 8, 2025 - 11:40 AM",
		type: "IST",
		status: "Pending",
	},
	{
		name: "Lily Rose",
		date: "May 8, 2025 - 11:40 AM",
		type: "IST",
		status: "Pending",
	},

	{
		name: "Lily Rose",
		date: "May 8, 2025 - 11:40 AM",
		type: "IST",
		status: "Pending",
	},
	{
		name: "Lily Rose",
		date: "May 8, 2025 - 11:40 AM",
		type: "IST",
		status: "Pending",
	},
	{
		name: "Lily Rose",
		date: "May 8, 2025 - 11:40 AM",
		type: "IST",
		status: "Pending",
	},
	{
		name: "Lily Rose",
		date: "May 8, 2025 - 11:40 AM",
		type: "IST",
		status: "Pending",
	},
	{
		name: "Lily Rose",
		date: "May 8, 2025 - 11:40 AM",
		type: "IST",
		status: "Pending",
	},
	{
		name: "Lily Rose",
		date: "May 8, 2025 - 11:40 AM",
		type: "IST",
		status: "Pending",
	},
	{
		name: "Lily Rose",
		date: "May 8, 2025 - 11:40 AM",
		type: "IST",
		status: "Pending",
	},
	{
		name: "Lily Rose",
		date: "May 8, 2025 - 11:40 AM",
		type: "IST",
		status: "Pending",
	},
	{
		name: "Lily Rose",
		date: "May 8, 2025 - 11:40 AM",
		type: "IST",
		status: "Pending",
	},
	{
		name: "Lily Rose",
		date: "May 8, 2025 - 11:40 AM",
		type: "IST",
		status: "Pending",
	},
];
