import { api } from "@/trpc/react";

export const useGetTemplateKraeplin = () => {
  return api.kraeplinTest.getTemplate.useQuery(undefined, {
    enabled: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
