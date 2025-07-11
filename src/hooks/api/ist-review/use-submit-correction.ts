import { api } from "@/trpc/react";

export const useSubmitCorrection = () => {
  return api.istReview.submitCorrection.useMutation();
};
