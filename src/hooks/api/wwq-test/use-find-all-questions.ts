import { api } from "@/trpc/react";

export const useFindAllQuestions = () => {
  return api.wwqTest.findAllQuestions.useQuery();
};
