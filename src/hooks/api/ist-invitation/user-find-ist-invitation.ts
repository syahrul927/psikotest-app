import { api } from "@/trpc/server";

export const findIstInvitation = async (id: string) => {
  return await api.publicIstInvitation.findIstInvitation(id);
};
