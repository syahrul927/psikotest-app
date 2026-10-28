import { api } from "@/trpc/react";
import { toast } from "sonner";

export const useUpdateProfileWwqInvitation = (
  onSuccessCallback: () => void,
) => {
  return api.publicWwqInvitation.updateProfile.useMutation({
    onSuccess: () => {
      toast.success("Data berhasil disimpan, silahkan mengerjakan test");
      onSuccessCallback();
    },
    onError: (e) => {
      toast.error("Oops..", { description: e.message });
    },
  });
};
