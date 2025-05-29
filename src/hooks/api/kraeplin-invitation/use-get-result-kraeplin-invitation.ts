import { api } from "@/trpc/react";

export const useGetResultKraeplinInvitation = (slug: string) => {
  return api.kraeplinInvitation.getResult.useQuery(slug);
};
