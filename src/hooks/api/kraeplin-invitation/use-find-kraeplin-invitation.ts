import { api } from "@/trpc/server";

export const useFindKraeplinInvitation = async (id: string) => {
  return await api.publicKraeplinInvitation.findInvitation(id);
};
