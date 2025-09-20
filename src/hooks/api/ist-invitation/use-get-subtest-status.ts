import { api } from "@/trpc/react";

export const useGetSubtestStatus = (invitationId: string) => {
  return api.istInvitation.getSubtestStatus.useQuery(invitationId, {
    enabled: !!invitationId,
  });
};