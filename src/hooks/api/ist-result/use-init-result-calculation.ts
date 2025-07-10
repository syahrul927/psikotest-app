import { api } from "@/trpc/react";

export const useInitIstResultCalculation = (id: string) => {
  return api.istResult.initResult.useQuery(id, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
