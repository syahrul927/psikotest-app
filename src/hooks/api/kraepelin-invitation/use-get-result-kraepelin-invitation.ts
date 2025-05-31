import { api } from "@/trpc/react";

export const useGetResultKraepelinInvitation = (slug: string) => {
  return api.kraepelinInvitation.getResult.useQuery(slug);
};
