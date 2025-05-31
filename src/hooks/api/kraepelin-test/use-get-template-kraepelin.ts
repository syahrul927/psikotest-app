import { api } from "@/trpc/react";

export const useGetTemplateKraepelin = () => {
  return api.kraepelinTest.getTemplate.useQuery(undefined, {
    enabled: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
