import { api } from "@/trpc/react";

export const useGetProfileIstReview = (id: string) => {
  return api.istReview.getProfileInvitation.useQuery(id);
};
