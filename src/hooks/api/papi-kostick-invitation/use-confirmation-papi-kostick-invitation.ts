import { api, type RouterOutputs } from "@/trpc/react";
import { toast } from "sonner";

export type ConfirmationPapiKostickInvitationResponseType =
  RouterOutputs["publicPapiKostickInvitation"]["confirmationSecretKey"];

export const useConfirmationPapiKostickInvitation = (
  onSuccessCallback?: (
    data: ConfirmationPapiKostickInvitationResponseType,
  ) => void,
  onErrorCallback?: () => void,
) => {
  return api.publicPapiKostickInvitation.confirmationSecretKey.useMutation({
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
