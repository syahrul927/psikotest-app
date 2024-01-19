import "~/styles/globals.css";

import { type Viewport } from "next";
import { cookies } from "next/headers";
import { env } from "~/env";
import { fontSans } from "~/lib/fonts";
import { cn } from "~/lib/utils";
import { TRPCReactProvider } from "~/trpc/react";
import { TailwindIndicator } from "./_components/tailwind-indicator";
import { ThemeProvider } from "./_components/theme-provider";
import { Toaster } from "./_components/ui/toaster";
import NextAuthProvider from "./context/NextAuthProvider";

export const metadata = {
	title: env.APP_NAME,
	description: "App",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export const viewport: Viewport = {
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
		<html lang="en">
			<body
				className={cn(
					"relative font-sans antialiased max-h-[100dvh] overflow-hidden",
					fontSans.className,
				)}
			>
				{/* <div className="absolute w-80 -z-20 blur-3xl rounded-full h-80 bg-pink-400 left-[30%] -translate-x-[50%] top-[20%] -translate-y-[50%]" />
				<div className="absolute w-80 -z-20 blur-3xl rounded-full h-80 bg-purple-800 left-[40%] -translate-x-[50%] top-[35%] -translate-y-[50%]" />
				<div className="absolute w-full h-screen -z-10 backdrop-blur-2xl bg-background/90" /> */}
				<NextAuthProvider>
					<TRPCReactProvider cookies={cookies().toString()}>
						<ThemeProvider
							attribute="class"
							defaultTheme="light"
							enableSystem
							disableTransitionOnChange
						>
							<div className="flex flex-col">{children}</div>
						</ThemeProvider>
					</TRPCReactProvider>
				</NextAuthProvider>
				<TailwindIndicator />
				<Toaster />
			</body>
		</html>
	);
}
