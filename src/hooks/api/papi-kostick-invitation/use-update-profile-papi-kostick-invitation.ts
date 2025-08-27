import { api } from "@/trpc/react";
import { toast } from "sonner";

export const useUpdateProfilePapiKostickInvitation = (
  onSuccessCallback: () => void,
) => {
  return api.publicPapiKostickInvitation.updateProfile.useMutation({
    onSuccess: (data) => {
      toast.success("Data berhasil disimpan, silahkan mengerjakan test");
      onSuccessCallback();
    },
  });
};
