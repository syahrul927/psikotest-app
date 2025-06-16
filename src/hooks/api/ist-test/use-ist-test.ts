import { api } from "@/trpc/react";

export const useGetQuestionAndOptions = (id: string) => {
  return api.istSubtest.getIstQuestionTemplateById.useQuery({subtest: id});
};
