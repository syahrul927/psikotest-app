import { api } from "@/trpc/react";

export const useGetProfilePapiKostickInvitation = (invitationId: string) => {
  return api.publicPapiKostickInvitation.getProfile.useQuery(invitationId);
};
