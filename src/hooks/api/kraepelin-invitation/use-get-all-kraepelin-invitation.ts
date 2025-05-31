import { api } from "@/trpc/react";

export const useGetAllKraepelinInvitation = () => {
  return api.kraepelinInvitation.getAll.useQuery();
};
