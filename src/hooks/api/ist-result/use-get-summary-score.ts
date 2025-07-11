import { api } from "@/trpc/react";

export const useGetSummaryScore = (id: string) => {
  return api.istResult.getSummaryScoreResult.useQuery(id);
};
