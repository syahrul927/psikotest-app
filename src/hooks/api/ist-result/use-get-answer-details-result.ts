import { api } from "@/trpc/react";

export const useGetAnswerDetailsResult = (id: string) => {
  return api.istResult.getAnswerDetailsResult.useQuery(id);
};
