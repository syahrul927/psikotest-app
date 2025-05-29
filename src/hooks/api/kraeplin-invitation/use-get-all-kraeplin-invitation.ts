import { api } from "@/trpc/react";

export const useGetAllKraeplinInvitation = () => {
  return api.kraeplinInvitation.getAll.useQuery();
};
