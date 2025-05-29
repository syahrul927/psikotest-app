import { api } from "@/trpc/react";
import { toast } from "sonner";

export function useSaveUserAccess(onSuccessCallback?: () => void) {
  const mutation = api.userAccess.save.useMutation({
    onSuccess() {
      onSuccessCallback?.();
      toast.success("User created successfully");
    },
    onError(error) {
      toast.error("Oops...", { description: error.message });
    },
  });

  return mutation;
}
