import { api } from "@/trpc/react";

export const useFindAllQuestions = () => {
  return api.papiKostickTest.findAllQuestions.useQuery();
};
