import { api } from "@/trpc/react";

export const useGetResultPapiKostickInvitation = (id: string) => {
  return api.papiKostickInvitation.getResult.useQuery(id);
};
