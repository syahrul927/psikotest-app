import { api } from "@/trpc/react";

export const useGetDashboardMetrics = () => {
  return api.dashboard.getMetrics.useQuery();
};