import { api } from "@/trpc/react";
import { toast } from "sonner";

export const useDeleteIstInvitation = () => {
  return api.istInvitation.deleteById.useMutation({
    onSuccess: () => {
      toast.success("Invitation deleted successfully");
    },
    onError: (e) => {
      toast.error("Oops..", { description: e.message });
    },
  });
};
