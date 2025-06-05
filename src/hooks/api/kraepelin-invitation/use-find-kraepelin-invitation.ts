import { api } from "@/trpc/server";

export const findKraepelinInvitation = async (id: string) => {
  return await api.publicKraepelinInvitation.findInvitation(id);
};
