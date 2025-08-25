import { api } from "@/trpc/server";

export const findPapiKostickInvitation = async (id: string) => {
  return await api.publicPapiKostickInvitation.findPapiKostickInvitation(id);
};
