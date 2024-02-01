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
	useSession,
} from "next-auth/react";
import { type BuiltInProviderType } from "next-auth/providers/index";
import { useRouter } from "next/navigation";
import { useToast } from "./ui/use-toast";
import { z } from "zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
	csrfToken?: string;
}
const formSchema = z.object({
	email: z.string().email({ message: "Format email harus sesuai" }),
	password: z.string().min(6, {
		message: "Password minimal 6 karakter",
	}),
	csrfToken: z.string().optional(),
});

export function UserSigninForm({
	className,
	csrfToken,
	...props
}: Readonly<UserAuthFormProps>) {
	const [isLoading, setLoading] = React.useState<boolean>(false);
	const router = useRouter();
	const { toast } = useToast();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			csrfToken,
		},
	});
	const { data } = useSession();

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setLoading(true);
		void signIn("credentials", {
			email: values.email,
			password: values.password,
			redirect: false,
		})
			.then((resp) => {
				setLoading(false);
				if (!resp?.ok) {
					toast({
						title: "Gagal Login",
						description: "Username atau Password salah!",
					});
					return;
				}

				toast({
					title: `Hi,`,
					description: "Selamat Datang!",
				});
				void router.push("/");
			})
			.catch((e) => {
				console.log(e);
				setLoading(false);
				toast({
					title: "Maaf masalah terjadi",
					description: "Segera hubungi developer 😭",
				});
			});
	};

	return (
		<Form {...form}>
			<div className={cn("grid gap-6", className)} {...props}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className="grid gap-2">
						<div className="grid gap-1">
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel htmlFor="email">
											Email
										</FormLabel>
										<FormControl>
											<Input
												id="email"
												placeholder="name@example.com"
												type="email"
												autoCapitalize="none"
												autoComplete="email"
												autoCorrect="off"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="grid gap-1">
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel htmlFor="password">
											Password
										</FormLabel>
										<FormControl>
											<Input
												id="password"
												placeholder="password"
												type="password"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
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
			</div>
		</Form>
	);
}
