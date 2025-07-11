import { api } from "@/trpc/react";

export const useGetAllSubtestTemplates = () => {
  return api.istSettings.getAllSubtestTemplates.useQuery();
};