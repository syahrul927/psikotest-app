import { api } from "@/trpc/react";

export const useGetAllSubtest = () => {
  return api.istSubtest.getAllSubtest.useQuery();
};
