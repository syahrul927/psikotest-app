import { api } from "@/trpc/react";
import { toast } from "sonner";

export const useSaveKraepelinInvitation = (onSuccessCallback?: () => void) => {
  return api.kraepelinInvitation.save.useMutation({
    onSuccess: () => {
      onSuccessCallback?.();
      toast.success("Undangan tes Kraepelin berhasil dibuat");
    },
    onError: (e) => {
      toast.error("Oops...", { description: e.message });
    },
  });
};
