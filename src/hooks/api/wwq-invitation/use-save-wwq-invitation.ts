import type { AppRouter } from "@/server/api/root";
import { api } from "@/trpc/react";
import type { TRPCClientErrorLike } from "@trpc/client";
import { toast } from "sonner";

interface UseSaveWwqInvitationProps {
  onSuccessCallback?: () => void;
  onErrorCallback?: (error: TRPCClientErrorLike<AppRouter>) => void;
}

export const useSaveWwqInvitation = ({
  onSuccessCallback,
  onErrorCallback,
}: UseSaveWwqInvitationProps = {}) => {
  return api.wwqInvitation.save.useMutation({
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
