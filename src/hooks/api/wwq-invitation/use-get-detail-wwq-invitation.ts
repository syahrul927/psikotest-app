import { api } from "@/trpc/react";

export const useGetDetailWwqInvitation = (id?: string) => {
  return api.wwqInvitation.getById.useQuery({ id: id! }, { enabled: !!id });
};
