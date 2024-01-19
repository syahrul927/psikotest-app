"use client";

import * as React from "react";
import { cn } from "~/lib/utils";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Icons } from "./ui/icons";
import { Button, buttonVariants } from "./ui/button";
import {
	signIn,
	type ClientSafeProvider,
	type LiteralUnion,
} from "next-auth/react";
import { type BuiltInProviderType } from "next-auth/providers/index";
import Link from "next/link";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
	providers: Record<
		LiteralUnion<BuiltInProviderType, string>,
		ClientSafeProvider
	> | null;
}
export function UserRegisterForm({
	className,
	providers,
	...props
}: Readonly<UserAuthFormProps>) {
	const [isLoading, setIsLoading] = React.useState<boolean>(false);

	async function onSubmit(event: React.SyntheticEvent) {
		event.preventDefault();
		setIsLoading(true);

		setTimeout(() => {
			setIsLoading(false);
		}, 3000);
	}

	return (
		<div className={cn("grid gap-6", className)} {...props}>
			<form onSubmit={onSubmit}>
				<div className="grid gap-4">
					<div className="grid grid-cols-2 gap-2">
						<div className="grid gap-1">
							<Label className="" htmlFor="firstName">
								First Name
							</Label>
							<Input
								id="firstname"
								placeholder="First Name"
								autoCapitalize="none"
								autoCorrect="off"
								disabled={isLoading}
							/>
						</div>
						<div className="grid gap-1">
							<Label className="" htmlFor="lastName">
								Last Name
							</Label>
							<Input
								id="lastname"
								placeholder="Last Name"
								autoCapitalize="none"
								autoCorrect="off"
								disabled={isLoading}
							/>
						</div>
					</div>
					<div className="grid gap-1">
						<Label className="" htmlFor="email">
							Email
						</Label>
						<Input
							id="email"
							placeholder="name@example.com"
							type="email"
							autoCapitalize="none"
							autoComplete="email"
							autoCorrect="off"
							disabled={isLoading}
						/>
					</div>
					<div className="grid gap-1">
						<Label className="" htmlFor="password">
							Password
						</Label>
						<Input
							id="password"
							placeholder="password"
							type="password"
							autoCapitalize="none"
							autoCorrect="off"
							disabled={isLoading}
						/>
					</div>
					<div className="grid gap-1">
						<Label className="" htmlFor="re-password">
							Re-Password
						</Label>
						<Input
							id="re-password"
							placeholder="re-password"
							type="password"
							autoCapitalize="none"
							autoCorrect="off"
							disabled={isLoading}
						/>
					</div>
					<Button disabled={isLoading}>
						{isLoading && (
							<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
						)}
						Sign In
					</Button>
				</div>
			</form>
			<div className="relative">
				<div className="absolute inset-0 flex items-center">
					<span className="w-full border-t" />
				</div>
				<div className="relative flex justify-center text-xs uppercase">
					<span className="bg-background px-2 text-muted-foreground">
						Or continue with
					</span>
				</div>
			</div>
			{providers &&
				Object.values(providers).map((item) => (
					<Button
						key={item.id}
						variant="outline"
						type="button"
						onClick={() =>
							signIn(item.id, {
								redirect: true,
								callbackUrl: "/",
							})
						}
						disabled={isLoading}
					>
						{isLoading ? (
							<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
						) : (
							<Icons.google className="mr-2 h-4 w-4" />
						)}{" "}
						{item.name}
					</Button>
				))}
			<p className="text-sm text-muted-foreground text-center">
				Already have an account?&nbsp;
				<Link
					href="/authentication/"
					className={cn(buttonVariants({ variant: "link" }), "p-0")}
				>
					Signin
				</Link>
			</p>
		</div>
	);
}
