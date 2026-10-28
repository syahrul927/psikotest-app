import { api } from "@/trpc/server";

export const findWwqInvitation = async (id: string) => {
  return await api.publicWwqInvitation.findWwqInvitation(id);
};
