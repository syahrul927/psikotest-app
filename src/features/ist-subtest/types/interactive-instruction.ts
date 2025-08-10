import { z } from "zod";

export const InteractiveOptionDataSchema = z.object({
  id: z.string(),
  text: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  label: z.string().optional(),
});

export const InteractiveQuestionDataSchema = z.object({
  id: z.string(),
  text: z.string().nullable().optional(),
  video: z.string().optional(),
  imageUrl: z.string().nullable().optional(),
  options: z.array(InteractiveOptionDataSchema).optional(),
});

export const InteractiveExampleDataSchema = z.object({
  type: z.string(),
  subtestType: z.string(),
  question: InteractiveQuestionDataSchema,
  correctAnswer: z.string().optional().or(z.array(z.number())),
  explanation: z.string().optional(),
  exampleAnswer: z.string().optional(),
  instruction: z.string().optional(),
});
export type InteractiveExampleData = z.infer<
  typeof InteractiveExampleDataSchema
>;

export type InteractiveQuestionData = z.infer<
  typeof InteractiveQuestionDataSchema
>;

export type InteractiveOptionData = z.infer<typeof InteractiveOptionDataSchema>;
