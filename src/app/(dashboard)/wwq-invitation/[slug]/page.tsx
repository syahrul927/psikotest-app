import { WwqInvitationResultWrapper } from "@/features/wwq-invitation";
import { WwqResultProvider } from "@/hooks/use-wwq-result-context";
import type { PageType } from "@/types/page-type";

export default async function WwqInvitationResultPage({ params }: PageType) {
  const { slug } = await params;
  return (
    <WwqResultProvider slug={slug}>
      <WwqInvitationResultWrapper />
    </WwqResultProvider>
  );
}
