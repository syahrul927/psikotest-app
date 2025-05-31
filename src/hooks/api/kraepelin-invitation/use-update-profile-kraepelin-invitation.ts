import { api } from "@/trpc/react";
import { toast } from "sonner";

export const useUpdateProfileKraepelinInvitation = (
  onSuccessCallback?: () => void,
  onErrorCallback?: () => void,
) => {
  return api.publicKraepelinInvitation.profileUpdate.useMutation({
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
