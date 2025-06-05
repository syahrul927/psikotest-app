import { api, type RouterOutputs } from "@/trpc/react";
import { toast } from "sonner";

export type ConfirmationIstInvitationResponseType =
  RouterOutputs["publicIstInvitation"]["confirmationSecretKey"];

export const useConfirmationIstInvitation = (
  onSuccessCallback?: (
    data: ConfirmationIstInvitationResponseType,
  ) => void,
  onErrorCallback?: () => void,
) => {
  return api.publicIstInvitation.confirmationSecretKey.useMutation({
    onSuccess: (data) => {
      toast.success("Password confirmed", {
        description:
          "Please complete your information to continue to the test.",
      });
      onSuccessCallback?.(data);
    },
    onError: (_err) => {
      toast.error("Invalid password or link", {
        description:
          "Please double-check the link or contact the administrator for assistance.",
      });
      onErrorCallback?.();
    },
  });
};
