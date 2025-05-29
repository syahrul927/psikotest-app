import { api } from "@/trpc/react";

export const useGetLatestKraeplin = (slug: string, resultId?: string) => {
  return api.kraeplinTest.getLatest.useQuery(
    { invitationId: slug, resultId: resultId ?? "" },
    {
      enabled: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  );
};
