import { z } from "zod";
import { StatusWwqInvitation } from "@prisma/client";

export const wwqInvitationFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  secretKey: z.string().min(3, { message: "Minimal 3 karakter" }),
});

export const invitationDetailSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  secretKey: z.string(),
  status: z.nativeEnum(StatusWwqInvitation),
  testerProfileId: z.string().nullable(),
  testerProfile: z
    .object({
      id: z.string(),
      name: z.string(),
      phone: z.string(),
      dateOfBirth: z.date(),
      createdAt: z.date(),
    })
    .nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type WwqInvitationForm = z.infer<typeof wwqInvitationFormSchema>;
export type InvitationDetail = z.infer<typeof invitationDetailSchema>;

export const getInvitationByIdSchema = z.object({ id: z.string() });
export const deleteInvitationSchema = z.object({ id: z.string() });
export const startInvitationSchema = z.object({ secretKey: z.string() });

export const createProfileSchema = z.object({
  invitationId: z.string(),
  name: z.string().min(1, { message: "Nama harus diisi" }),
  phone: z.string().min(1, { message: "Nomor telepon harus diisi" }),
  dateOfBirth: z.date(),
});
