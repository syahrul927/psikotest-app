import { api } from "@/trpc/react";

export const useUpdateSession = () => {
  return api.istSubtest.setStartTime.useMutation();
};
