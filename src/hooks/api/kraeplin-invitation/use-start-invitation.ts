import { api, type RouterOutputs } from "@/trpc/react";
import { toast } from "sonner";

export type StartKraeplinInvitationResponseType =
  RouterOutputs["publicKraeplinInvitation"]["startInvitation"];
export const useStartInvitation = (
  onSuccessCallback?: (data: StartKraeplinInvitationResponseType) => void,
  onErrorCallback?: () => void,
) => {
  return api.publicKraeplinInvitation.startInvitation.useMutation({
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
