import { api } from "@/trpc/react";
import { toast } from "sonner";

export const useCompleteReview = () => {
  return api.istReview.completeReview.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};