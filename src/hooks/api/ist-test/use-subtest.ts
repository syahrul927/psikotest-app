import { api } from "@/trpc/react";

export const useAllSubtest = () => {
  return api.istSubtest.getAllSubtest.useQuery();
};
