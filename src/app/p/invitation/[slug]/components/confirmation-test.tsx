"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
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
import { cn } from "~/lib/utils";

const formSchema = z.object({
	secretKey: z.string({ required_error: "Secret Key wajib diisi!" }),
	invitationId: z.string(),
});

type FormValues = z.infer<typeof formSchema>;
interface ConfirmationTestProps {
	slug: string;
}
const ConfirmationTest = ({ slug }: ConfirmationTestProps) => {
	const router = useRouter();
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		mode: "onSubmit",
	});
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		form.setValue("invitationId", slug);
	}, [slug]);
	const onSubmit = async (data: FormValues) => {
		setLoading(true);
		setTimeout(() => setLoading(false), 1000);
		router.push(`/p/invitation/${slug}/profile`);
	};
	return (
		<div className={cn("flex flex-col py-2 space-y-12 max-w-xl h-full")}>
			<header className="p-4 flex flex-col px-6">
				<Label className="text-lg leading-tight">Halo Peserta,</Label>
				<Label className="text-xl font-bold leading-tight">
					Selamat Datang
				</Label>
			</header>
			<div
				className={cn(
					"h-48 relative transition-all ease-in-out w-full justify-center items-center flex px-4",
					// isKeyboardOpen ? "h-24" : "h-48",
				)}
			>
				<Image
					alt="invitation-image"
					src={"/images/invitation-image.svg"}
					fill
				/>
			</div>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-col space-y-2 py-4 px-6"
				>
					<FormField
						control={form.control}
						name="secretKey"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Secret Key</FormLabel>
								<FormControl>
									<Input
										placeholder="***"
										type="password"
										{...field}
									/>
								</FormControl>
								<FormDescription>
									Secretkey untuk memastikan kamu yang di
									undang mengikuti proses psikotest.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button isLoading={loading} type="submit">
						Lanjutkan
					</Button>
				</form>
			</Form>
		</div>
	);
};
export default ConfirmationTest;
