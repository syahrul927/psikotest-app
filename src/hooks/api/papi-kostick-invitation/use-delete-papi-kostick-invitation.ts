import { api } from "@/trpc/react";
import { toast } from "sonner";

interface UseDeletePapiKostickInvitationProps { }

export const useDeletePapiKostickInvitation =
  ({ }: UseDeletePapiKostickInvitationProps = {}) => {
    const utils = api.useUtils();
    return api.papiKostickInvitation.deleteById.useMutation({
      onSuccess: () => {
        utils.papiKostickInvitation.getAll.invalidate();
        toast.success("Invitation deleted successfully");
      },
      onError: (e) => {
        toast.error("Oops..", { description: e.message });
      },
    });
  };
