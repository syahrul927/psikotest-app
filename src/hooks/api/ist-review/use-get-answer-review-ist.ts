import { api } from "@/trpc/react";

export const useGetAnswerReviewIst = (istInvitationId: string) => {
  return api.istReview.getAnswerReview.useQuery(istInvitationId);
};
