import { api, type RouterOutputs } from "@/trpc/react";

export type markSubtest9ImageViewedType =
  RouterOutputs["istSubtest"]["markSubtest9ImageViewed"];
export const useMarkSubtest9Image = (
  onSuccess: (data: markSubtest9ImageViewedType) => void,
  onError: () => void,
) => {
  return api.istSubtest.markSubtest9ImageViewed.useMutation({
    onSuccess,
    onError,
  });
};
