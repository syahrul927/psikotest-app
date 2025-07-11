import { api } from "@/trpc/react";

export const useGetCompletionTrends = (days = 30) => {
  return api.dashboard.getCompletionTrends.useQuery({ days });
};