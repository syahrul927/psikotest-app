import { api } from "@/trpc/react";

export const useGetDetailPapiKostickInvitation = (id?: string) => {
  return api.papiKostickInvitation.getById.useQuery(
    { id: id! },
    { enabled: !!id },
  );
};
