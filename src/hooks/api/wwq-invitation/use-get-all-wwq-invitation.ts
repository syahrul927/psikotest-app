import { api } from "@/trpc/react";

export const useGetAllWwqInvitation = () => {
  return api.wwqInvitation.getAll.useQuery();
};
