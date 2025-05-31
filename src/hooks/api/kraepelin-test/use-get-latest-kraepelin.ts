import { api } from "@/trpc/react";

export const useGetLatestKraepelin = (slug: string, resultId?: string) => {
  return api.kraepelinTest.getLatest.useQuery(
    { invitationId: slug, resultId: resultId ?? "" },
    {
      enabled: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  );
};
