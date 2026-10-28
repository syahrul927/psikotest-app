import { api } from "@/trpc/react";

export const useGetProfileWwqInvitation = (invitationId: string) => {
  return api.publicWwqInvitation.getProfile.useQuery(invitationId);
};
