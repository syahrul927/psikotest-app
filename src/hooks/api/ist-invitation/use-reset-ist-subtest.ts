import { api } from "@/trpc/react";
import { toast } from "sonner";
import { type ResetIstSubtestRouterResponseType } from "@/server/api/routers/ist-invitation-router/protected/type";

export const useResetIstSubtest = (successCallback?: (data: ResetIstSubtestRouterResponseType) => void) => {
  return api.istInvitation.resetSubtest.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      successCallback?.(data);
    },
    onError: (error) => {
      toast.error(error.message || "Gagal mereset subtest");
    },
  });
};