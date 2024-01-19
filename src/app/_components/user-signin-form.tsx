"use client";

import * as React from "react";
import { cn } from "~/lib/utils";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Icons } from "./ui/icons";
import { Button } from "./ui/button";
import {
	signIn,
	type ClientSafeProvider,
	type LiteralUnion,
} from "next-auth/react";
import { type BuiltInProviderType } from "next-auth/providers/index";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
	providers: Record<
		LiteralUnion<BuiltInProviderType, string>,
		ClientSafeProvider
	> | null;
}
export function UserSigninForm({
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
				<div className="grid gap-2">
					<div className="grid gap-1">
						<Label className="sr-only" htmlFor="email">
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
						<Label className="sr-only" htmlFor="email">
							Password
						</Label>
						<Input
							id="password"
							placeholder="password"
							type="password"
							autoCapitalize="none"
							autoComplete="email"
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
				Object.values(providers)
					.filter((item) => item.type !== "credentials")
					.map((item) => (
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
		</div>
	);
}
