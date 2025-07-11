import { api } from "@/trpc/react";
import { toast } from "sonner";

export const useUpdateSubtestTemplate = () => {
  const utils = api.useUtils();
  
  return api.istSettings.updateSubtestTemplate.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      // Invalidate and refetch templates list
      void utils.istSettings.getAllSubtestTemplates.invalidate();
      void utils.istSettings.getSubtestTemplatesSummary.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};