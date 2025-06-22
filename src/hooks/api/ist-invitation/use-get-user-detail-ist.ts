import { api } from "@/trpc/react";

export const useGetDetailUser = (id?: string) => {
  return api.istInvitation.getUserDetail.useQuery(id!, { enabled: !!id });
};
