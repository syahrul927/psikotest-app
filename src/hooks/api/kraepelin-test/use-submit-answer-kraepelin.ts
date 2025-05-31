import { api } from "@/trpc/react";

export const useSubmitAnswerKraepelin = () => {
  return api.kraepelinTest.submitAnswer.useMutation();
};
