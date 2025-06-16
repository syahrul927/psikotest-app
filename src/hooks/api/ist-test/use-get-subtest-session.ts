import { api } from "@/trpc/react";

export const useGetSubtestSession = (id: string) => {
  return api.istSubtest.getSubtestSession.useQuery(id);
};
