import { api } from "@/trpc/react";

export const useGetSubtestTemplate = (id: string) => {
  return api.istSettings.getSubtestTemplate.useQuery(id, {
    enabled: !!id,
  });
};