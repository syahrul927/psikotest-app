import "~/styles/globals.css";

import { type Viewport } from "next";
import { cookies } from "next/headers";
import { env } from "~/env";
import { fontSans } from "~/lib/fonts";
import { cn } from "~/lib/utils";
import { TRPCReactProvider } from "~/trpc/react";
import { TailwindIndicator } from "./_components/tailwind-indicator";
import { Toaster } from "./_components/ui/toaster";
import NextAuthProvider from "./context/NextAuthProvider";

export const metadata = {
	title: env.APP_NAME,
	description: "App",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
		{ media: "(prefers-color-scheme: dark)", color: "black" },
	],
};
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="id">
			<body
				className={cn(
					"relative font-sans antialiased max-h-[100dvh] overflow-hidden",
					fontSans.className,
				)}
			>
				<NextAuthProvider>
					<TRPCReactProvider cookies={cookies().toString()}>
						<div className="flex flex-col">{children}</div>
					</TRPCReactProvider>
				</NextAuthProvider>
				<TailwindIndicator />
				<Toaster />
			</body>
		</html>
	);
}
