import { api } from "@/trpc/react";
import { toast } from "sonner";

export const useDeleteKraeplinInvitation = () => {
  return api.kraeplinInvitation.deleteById.useMutation({
    onSuccess: () => {
      toast.success("Invitation deleted successfully");
    },
    onError: (e) => {
      toast.error("Oops..", { description: e.message });
    },
  });
};
