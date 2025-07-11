import { api } from "@/trpc/react";

export const useGetSubtestTemplatesSummary = () => {
  return api.istSettings.getSubtestTemplatesSummary.useQuery();
};