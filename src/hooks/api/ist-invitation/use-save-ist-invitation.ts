import { api } from "@/trpc/react";
import { toast } from "sonner";

export const useSaveIstInvitation = (onSuccessCallback?: () => void) => {
  return api.istInvitation.save.useMutation({
    onSuccess: () => {
      onSuccessCallback?.();
      toast.success("Invitation created successfully");
    },
    onError: (e) => {
      toast.error("Oops...", { description: e.message });
    },
  });
};
