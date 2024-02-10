"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/app/_components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/app/_components/ui/form";
import { Input } from "~/app/_components/ui/input";
import { Label } from "~/app/_components/ui/label";
import { useToast } from "~/app/_components/ui/use-toast";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import { type RouterOutputs } from "~/trpc/shared";

const userFormSchema = z
	.object({
		id: z.string().optional(),
		email: z.string().email({ message: "please check your email format" }),
		name: z.string(),
		password: z
			.string()
			.min(6, { message: "Password must be at least 6 characters" })
			.optional(),
		repassword: z
			.string()
			.min(6, { message: "Repassword must be at least 6 characters" })
			.optional(),
	})
	.refine((data) => data.password === data.repassword, {
		message: "Password doesn't match",
		path: ["repassword"],
	});

type UserFormValues = z.infer<typeof userFormSchema>;

const defaultValues: Partial<UserFormValues> = {};

type UserFormProps =
	| {
			update?: false;
	  }
	| { update: true; data: RouterOutputs["user"]["getById"] };
export const UserForm = (props: UserFormProps) => {
	const { toast } = useToast();
	const router = useRouter();
	const [show, setShow] = useState(false);

	const { mutate, isLoading } = api.user.save.useMutation({
		onSuccess: () => {
			toast({
				title: "Success",
				description: "User added successfully",
			});
			router.push("/user");
		},
		onError: (err) => {
			if (err.data?.code === "BAD_REQUEST") {
				toast({
					title: "Failed",
					description: err.message,
					variant: "destructive",
				});
				return;
			}
			toast({
				title: "Failed",
				description: "Something is wrong. Please Contact Admin!",
				variant: "destructive",
			});
		},
	});

	const form = useForm<UserFormValues>({
		resolver: zodResolver(userFormSchema),
		defaultValues,
		mode: "onSubmit",
	});

	useEffect(() => {
		if (props.update && props.data) {
			const { email, name, id } = props.data;
			form.setValue("id", id);
			form.setValue("email", email ?? "");
			form.setValue("name", name ?? "");
		}
	}, []);
	async function onSubmit(data: UserFormValues) {
		mutate({
			...data,
		});
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<div className="flex flex-col space-y-8">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Full Name</FormLabel>
								<FormControl>
									<Input placeholder="full name" {...field} />
								</FormControl>
								<FormDescription>
									Mada kono sekai wa...
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										type="email"
										placeholder="example@email.com"
										{...field}
										disabled={props.update}
									/>
								</FormControl>
								<FormDescription>
									Pastikan email yang kamu gunakan masih
									aktif.{" "}
									{props.update && (
										<span className="italic font-semibold">
											Kamu tidak mengubah email yang sudah
											ada
										</span>
									)}
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => {
							return (
								<FormItem
									className={cn(props.update ? "hidden" : "")}
								>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<div className="relative">
											<Input
												type={
													show ? "text" : "password"
												}
												placeholder="Password"
												{...field}
											/>
											<Label
												onClick={() => setShow(!show)}
												className="absolute text-muted-foreground right-4 cursor-pointer top-[50%] -translate-y-[50%]"
											>
												{show ? (
													<EyeIcon size={16} />
												) : (
													<EyeOffIcon size={16} />
												)}
											</Label>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							);
						}}
					/>
					<FormField
						control={form.control}
						name="repassword"
						render={({ field }) => {
							return (
								<FormItem
									className={cn(props.update ? "hidden" : "")}
								>
									<FormLabel>Re-type Password</FormLabel>
									<FormControl>
										<div className="relative">
											<Input
												type={
													show ? "text" : "password"
												}
												placeholder="Re-type Password"
												{...field}
											/>
											<Label
												onClick={() => setShow(!show)}
												className="absolute text-muted-foreground right-4 cursor-pointer top-[50%] -translate-y-[50%]"
											>
												{show ? (
													<EyeIcon size={16} />
												) : (
													<EyeOffIcon size={16} />
												)}
											</Label>
										</div>
									</FormControl>

									<FormMessage />
								</FormItem>
							);
						}}
					/>
				</div>
				<Button type="submit" isLoading={isLoading}>
					Save User
				</Button>
			</form>
		</Form>
	);
};
