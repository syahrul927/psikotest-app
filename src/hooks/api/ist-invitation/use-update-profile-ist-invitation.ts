import { api } from "@/trpc/react";
import { toast } from "sonner";

export const useUpdateProfileIstInvitation = (
  onSuccessCallback?: () => void,
  onErrorCallback?: () => void,
) => {
  return api.publicIstInvitation.profileUpdate.useMutation({
    onSuccess: () => {
      onSuccessCallback?.();
    },
    onError: (e) => {
      toast.error("Oops..", {
        description: e.message,
      });
      onErrorCallback?.();
    },
  });
};
  