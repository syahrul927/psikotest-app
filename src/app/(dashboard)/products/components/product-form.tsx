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
import ImageUploader from "./form/image-uploader";
import { useEffect } from "react";

const productFormSchema = z.object({
	name: z.string().min(2, {
		message: "Name must be at least 2 characters.",
	}),
	description: z.string().optional(),
	slug: z.string().optional(),
	images: z.array(
		z.object({
			key: z.string(),
			name: z.string(),
			url: z.string().url(),
		}),
	),
	status: z.string({
		required_error: "Please select a status of product.",
	}),
	price: z
		.number()
		.or(z.string().regex(/\d+/).transform(Number))
		.refine((n) => n >= 0),
	addon: z
		.array(
			z.object({
				value: z.string().min(2, {
					message: "Addon name must be at least 2 characters.",
				}),
				price: z
					.number()
					.default(0)
					.or(z.string().regex(/\d+/).transform(Number))
					.refine((n) => n >= 0),
			}),
		)
		.optional(),
	variants: z
		.array(
			z.object({
				value: z.string().min(2, {
					message: "variant name must be at least 2 characters.",
				}),
			}),
		)
		.optional(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

const defaultValues: Partial<ProductFormValues> = {};

type ProductFormProps =
	| {
			update?: false;
	  }
	| { update: true; data: RouterOutputs["product"]["getById"] };
export const ProductForm = (props: ProductFormProps) => {
	const { toast } = useToast();
	const router = useRouter();

	const mutate = api.product.save.useMutation({
		onSuccess: () => {
			toast({
				title: "Success",
				description: "Product added successfully",
			});
			router.push("/products");
		},
		onError: (err) => {
			console.log(err);
			toast({
				title: "Failed",
				description: "Something is wrong. Please Contact Admin!",
				variant: "destructive",
			});
		},
	});

	const form = useForm<ProductFormValues>({
		resolver: zodResolver(productFormSchema),
		defaultValues,
		mode: "onSubmit",
	});

	const {
		fields: fieldsAddon,
		append: appendAddon,
		remove: removeAddon,
	} = useFieldArray({
		name: "addon",
		control: form.control,
	});

	const {
		fields: fieldsImages,
		append: appendImages,
		remove: removeImages,
		move: moveImage,
	} = useFieldArray({
		name: "images",
		control: form.control,
	});
	const {
		fields: fieldsVariant,
		append: appendVariant,
		remove: removeVariant,
	} = useFieldArray({
		name: "variants",
		control: form.control,
	});

	useEffect(() => {
		if (props.update && props.data) {
			const {
				name,
				price,
				status,
				description,
				images,
				variants,
				addon,
			} = props.data;
			form.setValue("name", name);
			form.setValue("price", price);
			form.setValue("status", status);
			form.setValue("description", description ?? "");
			form.setValue(
				"variants",
				variants.map((variant) => ({ value: variant })),
			);
			form.setValue(
				"addon",
				addon.map(({ price, value }) => ({ price, value })),
			);
			form.setValue(
				"images",
				images.map(({ key, url, name }) => ({
					key,
					url,
					name,
				})),
			);
		}
	}, []);
	async function onSubmit(data: ProductFormValues) {
		const {
			addon,
			slug,
			images,
			name,
			price,
			status,
			description,
			variants,
		} = data;
		mutate.mutate({
			addon: addon,
			images,
			name,
			price,
			slug,
			status,
			description,
			variants: variants,
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
								<FormLabel>Product Name</FormLabel>
								<FormControl>
									<Input
										placeholder="your product name"
										{...field}
									/>
								</FormControl>
								<FormDescription>
									This is your public display name. It can be
									your real name or a pseudonym.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Description</FormLabel>
								<FormControl>
									<Textarea {...field} />
								</FormControl>
								<FormDescription>
									Describe your product here.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="space-y-8">
						<SortableList
							title="Images"
							data={fieldsImages.map((image) => image.url)}
							onRemove={removeImages}
							onMove={moveImage}
						/>
						<ImageUploader appendImages={appendImages} />
					</div>
					<FormField
						control={form.control}
						name="price"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Price</FormLabel>
								<FormControl>
									<Input
										{...field}
										placeholder="17500"
										type="number"
									/>
								</FormControl>
								<FormDescription>
									Use only number.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="status"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Status</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select status product" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="ACTIVE">
											Active
										</SelectItem>
										<SelectItem value="INACTIVE">
											Inactive
										</SelectItem>
									</SelectContent>
								</Select>
								<FormDescription>
									This is the status used to display your
									product or not.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div>
						{fieldsVariant.map((field, index) => (
							<FormField
								control={form.control}
								key={field.id}
								name={`variants.${index}.value`}
								render={({ field }) => (
									<FormItem>
										<FormLabel
											className={cn(
												index !== 0 && "sr-only",
											)}
										>
											Variants of product
										</FormLabel>
										<FormDescription
											className={cn(
												index !== 0 && "sr-only",
											)}
										>
											Add variants of the product you want
											to differentiate
										</FormDescription>
										<FormControl>
											<div className="flex gap-2">
												<Input {...field} />
												<Button
													variant={"ghost"}
													className="text-muted-foreground"
													onClick={() =>
														removeVariant(index)
													}
												>
													<TrashIcon size={16} />
												</Button>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						))}
						<Button
							type="button"
							variant="outline"
							size="sm"
							className="mt-2"
							onClick={() => appendVariant({ value: "" })}
						>
							Add Variant
						</Button>
					</div>
					<div>
						{fieldsAddon.map((field, index) => (
							<div
								key={field.id}
								className="flex flex-col space-y-2"
							>
								<FormLabel
									className={cn(index !== 0 && "sr-only")}
								>
									Addon
								</FormLabel>
								<FormDescription
									className={cn(index !== 0 && "sr-only")}
								>
									"Addon" will be used as an optional addition
									when purchasing the product
								</FormDescription>
								<div className={cn("grid grid-flow-col gap-2")}>
									<FormField
										control={form.control}
										key={field.id}
										name={`addon.${index}.value`}
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<Input
														{...field}
														placeholder="addon name"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										key={field.id}
										name={`addon.${index}.price`}
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<Input
														{...field}
														type="number"
														pattern="[0-9]*"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<Button
										variant={"ghost"}
										className={cn("text-muted-foreground")}
										onClick={() => removeAddon(index)}
									>
										<TrashIcon size={16} />
									</Button>
								</div>
							</div>
						))}
						<Button
							type="button"
							variant="outline"
							size="sm"
							className="mt-2"
							onClick={() => appendAddon({ value: "", price: 0 })}
						>
							Add Addon
						</Button>
					</div>
				</div>
				<Button type="submit">Save Product</Button>
			</form>
		</Form>
	);
};
