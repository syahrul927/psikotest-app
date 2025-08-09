import { api } from "@/trpc/react";

export function useCheckSubtest9Access(
  istInvitationId: string,
  subtestType: string,
) {
  return api.istSubtest.checkSubtest9ImageAccess.useQuery(
    {
      istInvitationId: istInvitationId,
      subtestId: subtestType,
    },
    {
      enabled: subtestType === "9" && !!istInvitationId,
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    },
  );
}
