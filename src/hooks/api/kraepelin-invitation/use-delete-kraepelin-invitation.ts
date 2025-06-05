import { api } from "@/trpc/react";
import { toast } from "sonner";

export const useDeleteKraepelinInvitation = (
  onSuccessCallback?: () => void,
) => {
  return api.kraepelinInvitation.deleteById.useMutation({
    onSuccess: () => {
      toast.success("Invitation deleted successfully");
      onSuccessCallback?.();
    },
    onError: (e) => {
      toast.error("Oops..", { description: e.message });
    },
  });
};
