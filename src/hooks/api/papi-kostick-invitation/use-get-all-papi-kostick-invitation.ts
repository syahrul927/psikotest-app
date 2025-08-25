import { api } from "@/trpc/react";

export const useGetAllPapiKostickInvitation = () => {
  return api.papiKostickInvitation.getAll.useQuery();
};
