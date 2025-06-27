import { api } from "@/trpc/react";

export const useGetDetailUser = (id?: string) => {
  return api.publicIstInvitation.getUserDetail.useQuery(id!, { enabled: !!id });
};
