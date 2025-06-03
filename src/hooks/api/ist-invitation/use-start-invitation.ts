import { api, type RouterOutputs } from "@/trpc/react";
import { toast } from "sonner";

export type StartIstInvitationResponseType =
  RouterOutputs["publicIstInvitation"]["startInvitation"];
export const useStartInvitation = (
  onSuccessCallback?: (data: StartIstInvitationResponseType) => void,
  onErrorCallback?: () => void,
) => {
  return api.publicIstInvitation.startInvitation.useMutation({
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
