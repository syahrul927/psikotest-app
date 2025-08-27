import type { AppRouter } from "@/server/api/root";
import { api } from "@/trpc/react";
import type { TRPCClientErrorLike } from "@trpc/client";
import { toast } from "sonner";

interface Props {
  onSuccessCallback?: () => void;
}
export const useDeletePapiKostickInvitation = ({
  onSuccessCallback,
}: Props) => {
  return api.papiKostickInvitation.deleteById.useMutation({
    onSuccess: () => {
      toast.success("Invitation deleted successfully");
      onSuccessCallback?.();
    },
    onError: (e) => {
      toast.error("Oops..", { description: e.message });
    },
  });
};
