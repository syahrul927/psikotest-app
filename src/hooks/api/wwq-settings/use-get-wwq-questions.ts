import { api } from "@/trpc/react";

export const useGetWwqQuestions = () => {
  return api.wwqSettings.getAllQuestions.useQuery();
};
