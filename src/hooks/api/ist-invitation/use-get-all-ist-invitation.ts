import { api } from "@/trpc/react";

export const useGetAllIstInvitation = () => {
  return api.istInvitation.getAll.useQuery();
};
