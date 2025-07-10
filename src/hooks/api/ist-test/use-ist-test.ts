import { api } from "@/trpc/react";

export const useGetQuestionAndOptions = (invitationId: string, subtestId: string) => {
  return api.istSubtest.getIstQuestionTemplateById.useQuery({invitationId: invitationId,subtestId: subtestId});
};
