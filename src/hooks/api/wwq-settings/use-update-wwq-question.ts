import { api } from "@/trpc/react";
import { toast } from "sonner";

export const useUpdateWwqQuestion = () => {
  const utils = api.useUtils();

  return api.wwqSettings.updateQuestion.useMutation({
    onSuccess: () => {
      toast.success("Teks soal tersimpan");
      void utils.wwqSettings.getAllQuestions.invalidate();
    },
    onError: (e) => {
      toast.error("Oops..", { description: e.message });
    },
  });
};
