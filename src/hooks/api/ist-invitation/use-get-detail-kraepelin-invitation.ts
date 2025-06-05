import { api } from "@/trpc/react";

export const useGetDetailIstInvitation = (id?: string) => {
  return api.istInvitation.getById.useQuery(id!, { enabled: !!id });
};
