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
  return api.papiKostickInvitation.save.useMutation({
    onSuccess: () => {
      onSuccessCallback?.();
      toast.success("Invitation created successfully");
    },
    onError: (e) => {
      onErrorCallback?.(e);
      toast.error("Oops...", { description: e.message });
    },
  });
};
