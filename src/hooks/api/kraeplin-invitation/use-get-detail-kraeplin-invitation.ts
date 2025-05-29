import { api } from "@/trpc/react";

export const useGetDetailKraeplinInvitation = (id?: string) => {
  return api.kraeplinInvitation.getById.useQuery(id!, { enabled: !!id });
};
