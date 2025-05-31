import { api, type RouterOutputs } from "@/trpc/react";
import { toast } from "sonner";

export type StartKraepelinInvitationResponseType =
  RouterOutputs["publicKraepelinInvitation"]["startInvitation"];
export const useStartInvitation = (
  onSuccessCallback?: (data: StartKraepelinInvitationResponseType) => void,
  onErrorCallback?: () => void,
) => {
  return api.publicKraepelinInvitation.startInvitation.useMutation({
    onSuccess(resp) {
      onSuccessCallback?.(resp);
    },
    onError(e) {
      toast.error("Oops..", {
        description: e.message,
      });
      onErrorCallback?.();
    },
  });
};
