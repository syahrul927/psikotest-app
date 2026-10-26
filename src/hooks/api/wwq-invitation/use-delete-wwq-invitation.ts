import { api } from "@/trpc/react";
import { toast } from "sonner";

interface Props {
  onSuccessCallback?: () => void;
}
export const useDeleteWwqInvitation = ({ onSuccessCallback }: Props) => {
  return api.wwqInvitation.deleteById.useMutation({
    onSuccess: () => {
      toast.success("Invitation deleted successfully");
      onSuccessCallback?.();
    },
    onError: (e) => {
      toast.error("Oops..", { description: e.message });
    },
  });
};
