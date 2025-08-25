import type { AppRouter } from "@/server/api/root";
import { api } from "@/trpc/react";
import type { TRPCClientErrorLike } from "@trpc/client";
import { toast } from "sonner";

interface UseSavePapiKostickInvitationProps {
  onSuccessCallback?: () => void;
  onErrorCallback?: (error: TRPCClientErrorLike<AppRouter>) => void;
}

export const useSavePapiKostickInvitation = ({
  onSuccessCallback,
  onErrorCallback,
}: UseSavePapiKostickInvitationProps = {}) => {
  const utils = api.useUtils();
  return api.papiKostickInvitation.save.useMutation({
    onSuccess: () => {
      utils.papiKostickInvitation.getAll.invalidate();
      onSuccessCallback?.();
      toast.success("Invitation created successfully");
    },
    onError: (e) => {
      onErrorCallback?.(e);
      toast.error("Oops...", { description: e.message });
    },
  });
};
