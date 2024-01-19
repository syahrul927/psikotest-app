/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type Metadata } from "next";
import DashboardWrapper from "./components/dashboard-wrapper";

export const metadata: Metadata = {
	title: "Dashboard",
	description: "Welcome to dashboard, what can i help you today?",
};
export default function DashboardLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return <DashboardWrapper>{children}</DashboardWrapper>;
}
