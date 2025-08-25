import { z } from "zod";

// Base schemas following IST pattern
export const papiKostickInvitationFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  secretKey: z.string().min(3, { message: "Minimal 3 karakter" }),
});

export const invitationDetailSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  secretKey: z.string(),
  status: z.enum(["PENDING", "ONPROGRESS", "DONE"]),
  testerProfile: z
    .object({
      id: z.string(),
      name: z.string(),
      phone: z.string(),
      address: z.string(),
      placeOfBirth: z.string(),
      dateOfBirth: z.date(),
      educationDescription: z.string().nullable(),
    })
    .nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type PapiKostickInvitationForm = z.infer<
  typeof papiKostickInvitationFormSchema
>;
export type InvitationDetail = z.infer<typeof invitationDetailSchema>;

// Input schemas for API endpoints
export const getInvitationByIdSchema = z.object({
  id: z.string(),
});

export const deleteInvitationSchema = z.object({
  id: z.string(),
});

export const startInvitationSchema = z.object({
  secretKey: z.string(),
});

export const createProfileSchema = z.object({
  invitationId: z.string(),
  name: z.string().min(1, { message: "Nama harus diisi" }),
  phone: z.string().min(1, { message: "Nomor telepon harus diisi" }),
  dateOfBirth: z.date(),
});
