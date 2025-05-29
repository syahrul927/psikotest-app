import { api } from "@/trpc/react";
import { toast } from "sonner";

export const useUpdateProfileKraeplinInvitation = (
  onSuccessCallback?: () => void,
  onErrorCallback?: () => void,
) => {
  return api.publicKraeplinInvitation.profileUpdate.useMutation({
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
