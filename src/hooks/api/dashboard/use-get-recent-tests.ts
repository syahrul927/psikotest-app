import { api } from "@/trpc/react";

export const useGetRecentTests = (limit = 10) => {
  return api.dashboard.getRecentTests.useQuery({ limit });
};