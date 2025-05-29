import { api } from "@/trpc/react";
import { toast } from "sonner";

export const useDeleteUserAccess = (onSuccessCallback?: () => void) => {
  return api.userAccess.deleteById.useMutation({
    onSuccess: () => {
      toast.success("User deleted successfully");
      onSuccessCallback?.();
    },
    onError: (e) => {
      toast.error("Oops..", { description: e.message });
    },
  });
};
