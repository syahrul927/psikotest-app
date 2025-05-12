"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
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
import SortableList from "~/app/_components/ui/sortable-list";
import { Textarea } from "~/app/_components/ui/textarea";
import { useToast } from "~/app/_components/ui/use-toast";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import { type RouterOutputs } from "~/trpc/shared";
import { useEffect } from "react";

const invitationFormSchema = z.object({
	id: z.string().optional(),
	name: z.string().optional(),
	secretKey: z.string().min(3, { message: "Minimal 3 karakter" }),
});

type InvitationFormValues = z.infer<typeof invitationFormSchema>;

const defaultValues: Partial<InvitationFormValues> = {};

type InvitationFormProps =
	| {
			update?: false;
	  }
	| { update: true; data: RouterOutputs["invitation"]["getById"] };
export const InvitationForm = (props: InvitationFormProps) => {
	const { toast } = useToast();
	const router = useRouter();

	const { mutate, isLoading } = api.invitation.save.useMutation({
		onSuccess: () => {
			toast({
				title: "Berhasil",
				description: "Undangan berhasil dibuat",
			});
			router.push("/");
		},
		onError: (err) => {
			toast({
				title: "Gagal",
				description: "Terjadi kesalahan, segera hubungi developer.",
				variant: "destructive",
			});
		},
	});

	const form = useForm<InvitationFormValues>({
		resolver: zodResolver(invitationFormSchema),
		defaultValues,
		mode: "onSubmit",
	});

	useEffect(() => {
		if (props.update && props.data) {
			const { id, name, secretKey } = props.data;
			form.setValue("name", name ?? "");
			form.setValue("id", id ?? "");
			form.setValue("secretKey", secretKey);
		}
	}, []);
	async function onSubmit(data: InvitationFormValues) {
		const { id, name, secretKey } = data;
		mutate({
			id: id,
			name: name,
			secretKey,
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
								<FormLabel>
									Client Name{" "}
									<span className="inline italic text-muted-foreground">
										(optional)
									</span>
								</FormLabel>
								<FormControl>
									<Input
										placeholder="client name or something else"
										{...field}
									/>
								</FormControl>
								<FormDescription>
									Berikan nama yang mewakilkan siapa yang akan
									menerima undangan ini. Bisa nama
									client/perusahaan atau nama orang.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
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
									Secret key yang akan digunakan oleh calon
									peserta test yang digunakan untuk melakukan
									test
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<Button type="submit" isLoading={isLoading}>
					Simpan
				</Button>
			</form>
		</Form>
	);
};
