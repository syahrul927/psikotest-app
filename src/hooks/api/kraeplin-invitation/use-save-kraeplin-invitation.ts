import { api } from "@/trpc/react";
import { toast } from "sonner";

export const useSaveKraeplinInvitation = (onSuccessCallback?: () => void) => {
  return api.kraeplinInvitation.save.useMutation({
    onSuccess: () => {
      onSuccessCallback?.();
      toast.success("Invitation created successfully");
    },
    onError: (e) => {
      toast.error("Oops...", { description: e.message });
    },
  });
};
