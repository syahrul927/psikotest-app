import { api } from "@/trpc/react";

export const useGetDetailUserAccess = (id?: string) => {
  return api.userAccess.getById.useQuery(id!, {
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};
