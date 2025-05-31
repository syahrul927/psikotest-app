import { api } from "@/trpc/react";

export const useGetDetailKraepelinInvitation = (id?: string) => {
  return api.kraepelinInvitation.getById.useQuery(id!, { enabled: !!id });
};
