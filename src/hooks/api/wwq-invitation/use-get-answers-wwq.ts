import { api } from "@/trpc/react";

export const useGetAnswersWwq = (id: string) => {
  return api.wwqInvitation.getDetailAnswers.useQuery(id);
};
