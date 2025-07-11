import { api } from "@/trpc/react";

export const useGetStatusDistribution = () => {
  return api.dashboard.getStatusDistribution.useQuery();
};