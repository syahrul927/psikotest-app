import { api } from "@/trpc/react";

export const useGetAnswersPapiKostick = (id: string) => {
  return api.papiKostickInvitation.getDetailAnswers.useQuery(id);
};
