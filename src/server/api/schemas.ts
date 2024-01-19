import { z } from "zod";
export const AddonSchema = z.array(
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
);
export const SaveProductRouterSchema = z.object({
	id: z.string().optional(),
	name: z.string(),
	slug: z.string().optional(),
	description: z.string().optional(),
	images: z.array(
		z.object({
			key: z.string(),
			name: z.string(),
			url: z.string().url(),
		}),
	),
	status: z.string(),
	price: z.number(),
	addon: z
		.array(
			z.object({
				value: z.string(),
				price: z.number().optional().default(0),
			}),
		)
		.optional(),
	variants: z
		.array(
			z.object({
				value: z.string(),
			}),
		)
		.optional(),
});
