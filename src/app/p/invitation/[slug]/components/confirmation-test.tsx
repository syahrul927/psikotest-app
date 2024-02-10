"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
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
import { useAccessInvitation } from "../../hooks/use-access";
import Link from "next/link";

const formSchema = z.object({
	secretKey: z.string({ required_error: "Secret Key wajib diisi!" }),
	invitationId: z.string(),
});

type FormValues = z.infer<typeof formSchema>;
interface ConfirmationTestProps {
	slug: string;
	name: string;
}
const ConfirmationTest = ({ slug, name }: ConfirmationTestProps) => {
	const router = useRouter();
	const { toast } = useToast();
	const { setAccess, resetAccess } = useAccessInvitation();
	const form = useForm<FormValues>({
		defaultValues: {
			invitationId: "",
			secretKey: "",
		},
		resolver: zodResolver(formSchema),
		mode: "onSubmit",
	});
	const { mutate, isLoading: loading } =
		api.publicInvitation.confirmationSecretKey.useMutation({
			onSuccess: (data) => {
				if (data.step === 0) {
					setAccess(slug, true);
					return router.push(`/p/invitation/${slug}/profile`);
				}
				if (data.step === 1) {
					setAccess(data.resultId, true);
					return router.push(`/p/invitation/${slug}/`);
				}
			},
			onError: (_err) => {
				toast({
					variant: "destructive",
					title: "Password salah atau Link tidak valid",
					description:
						"Periksa kembali link atau hubungi kembali admin.",
				});
				resetAccess();
			},
		});

	useEffect(() => {
		form.setValue("invitationId", slug);
	}, [slug]);
	const onSubmit = async (data: FormValues) => {
		mutate({ id: data.invitationId, secretKey: data.secretKey });
	};
	return (
		<div
			className={cn("flex flex-col py-2 space-y-20 max-w-xl h-[100dvh]")}
		>
			<header className="p-4 flex flex-col px-6">
				<Label className="leading-tight ">Halo Peserta,</Label>
				<Label className="text-xl font-bold leading-tight">
					Selamat Datang
				</Label>
				{name ? (
					<p className="leading-tight text-sm text-muted-foreground">
						Undangan psikotest Kraepelin&nbsp;
						<span className="font-bold">{name}</span>
					</p>
				) : null}
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
					className="flex flex-col py-4 px-6 flex-1 space-y-6"
				>
					<FormField
						control={form.control}
						name="secretKey"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Secret Key</FormLabel>
								<FormControl>
									<Input
										placeholder="secret key"
										{...field}
									/>
								</FormControl>
								<FormDescription>
									Secretkey untuk memastikan kamu yang di
									undang mengikuti proses psikotest.
									Perhatikan juga huruf besar, huruf kecil dan
									juga angka.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button isLoading={loading} type="submit">
						Lanjutkan
					</Button>
					<div className="w-full flex flex-col">
						<Link href={"/p/invitation/training"}>
							<Button
								className="w-full"
								isLoading={loading}
								variant={"outline"}
								type="button"
							>
								Coba Latihan
							</Button>
						</Link>
						<p className="text-muted-foreground text-sm">
							Disarankan untuk mencoba terlebih dahulu sebelum
							memulai agar tau bagaimana cara kerja kraepelin
							online.
						</p>
					</div>
				</form>
			</Form>
		</div>
	);
};
export default ConfirmationTest;
