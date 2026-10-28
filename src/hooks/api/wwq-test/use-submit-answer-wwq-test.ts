import { api } from "@/trpc/react";
import { toast } from "sonner";

export const useSubmitAnswerWwqTest = (onSuccessCallback: () => void) => {
  return api.wwqTest.submitAnswers.useMutation({
    onSuccess: () => {
      toast.success("Test successfully submitted!");
      onSuccessCallback();
    },
    onError: (e) => {
      toast.error("Oops..", { description: e.message });
    },
  });
};
