import { api } from "@/trpc/react";
import { toast } from "sonner";

export const useSubmitAnswerPapiKostickTest = (
  onSuccessCallback: () => void,
) => {
  return api.papiKostickTest.submitAnswers.useMutation({
    onSuccess: () => {
      toast.success("Test successfully submitted!");
      onSuccessCallback();
    },
    onError: (e) => {
      toast.error("Oops..", { description: e.message });
    },
  });
};
