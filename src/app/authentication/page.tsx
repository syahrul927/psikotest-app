import { type Metadata } from "next";
import { getCsrfToken } from "next-auth/react";
import Link from "next/link";
import { env } from "~/env";
import { cn } from "~/lib/utils";
import { buttonVariants } from "../_components/ui/button";
import { UserSigninForm } from "../_components/user-signin-form";
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";
import Image from "next/image";

export const metadata: Metadata = {
	title: "Authentication",
	description: "You need to be authenticated",
};

const AuthenticationPage = async () => {
	const token = await getCsrfToken();
	const session = await getServerAuthSession();
	if (session) {
		redirect("/");
	}
	return (
		<div className="container h-screen relative flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
			<div className="relative hidden h-full flex-col bg-muted p-10  lg:flex dark:border-r">
				<Image
					alt="Welcome"
					src={"/images/welcome.svg"}
					className="object-contain p-24"
					fill
				/>
				<div className="relative z-20 flex items-center text-lg font-medium">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="mr-2 h-6 w-6"
					>
						<path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
					</svg>
					{env.APP_NAME}
				</div>
			</div>
			<div className="lg:p-8">
				<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
					<div className="flex flex-col space-y-2 text-center">
						<h1 className="bg-gradient-to-r from-slate-500 to-slate-800 text-7xl text-transparent bg-clip-text font-extrabold tracking-tight">
							Welcome Back!
						</h1>
						<p className="text-sm text-muted-foreground">
							Enter your email and password below to login
						</p>
					</div>
					<UserSigninForm csrfToken={token} />
				</div>
			</div>
		</div>
	);
};
export default AuthenticationPage;
