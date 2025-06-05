import { api } from "@/trpc/react";

export const useGetAllUserAccess = () => {
  return api.userAccess.getAllUser.useQuery();
};
