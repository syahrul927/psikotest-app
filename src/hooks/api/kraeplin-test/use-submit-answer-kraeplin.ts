import { api } from "@/trpc/react";

export const useSubmitAnswerKraeplin = () => {
  return api.kraeplinTest.submitAnswer.useMutation();
};
