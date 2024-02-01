"use client";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/app/_components/ui/select";
import { Textarea } from "~/app/_components/ui/textarea";
import { PageType } from "~/types/page-type";

const formSchema = z.object({
	name: z.string(),
	phone: z.string(),
	address: z.string(),
	education: z.string(),
	educationDescription: z.string().optional(),
	invitationId: z.string(),
});

type FormValues = z.infer<typeof formSchema>;
const ProfilePage = ({ params }: PageType) => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		mode: "onSubmit",
	});

	useEffect(() => {
		form.setValue("invitationId", params.slug);
	}, [params.slug]);
	const onSubmit = async (data: FormValues) => {
		setLoading(true);
		setTimeout(() => setLoading(false), 1000);
		router.push(`/p/invitation/${params.slug}`);
	};
	return (
		<div className="flex flex-col w-full max-h-[100dvh] p-6 overflow-y-auto ">
			<div className="flex flex-col gap-2">
				<p className="text-2xl leading-tight font-bold">Profil Kamu</p>
				<span className="text-muted-foreground">
					Periksa kembali pengisian informasi agar kami dapat menerima
					informasi yang valid.
				</span>
			</div>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-col space-y-2 py-4"
				>
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Nama</FormLabel>
								<FormControl>
									<Input
										placeholder="John Smith"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="phone"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Nomor Telepon</FormLabel>
								<FormControl>
									<div className="flex w-full gap-2">
										<div className="flex-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-not-allowed opacity-50">
											+62
										</div>
										<Input
											{...field}
											placeholder="8123123"
											inputMode="numeric"
											className="flex-1"
										/>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="address"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Alamat Lengkap</FormLabel>
								<FormControl>
									<Textarea
										placeholder="Jl. Agus Salim No.23"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="education"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Pendidikan</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue
												placeholder={
													field.value ??
													"Pilih Pendidikan"
												}
											/>
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="SMA/SMK">
											SMA / SMK
										</SelectItem>
										<SelectItem value="S1IPA">
											S1 IPA
										</SelectItem>
										<SelectItem value="S1IPS">
											S1 IPS
										</SelectItem>
									</SelectContent>
								</Select>
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="educationDescription"
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									Deskripsi Pendidikan{" "}
									<span className="text-muted-foreground italic inline">
										(optional)
									</span>
								</FormLabel>
								<FormControl>
									<Textarea
										placeholder="S1 Teknik Informatika Universitas Di Jakarta"
										{...field}
									/>
								</FormControl>
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
export default ProfilePage;
