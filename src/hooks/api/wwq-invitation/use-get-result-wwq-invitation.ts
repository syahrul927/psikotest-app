import { api } from "@/trpc/react";

export const useGetResultWwqInvitation = (id: string) => {
  return api.wwqInvitation.getResult.useQuery(id);
};
