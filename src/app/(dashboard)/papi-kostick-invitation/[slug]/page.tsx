import { PapiKostickInvitationResultWrapper } from "@/features/papi-kostick-invitation";
import { PapiKostickResultProvider } from "@/hooks/use-papi-kostick-result-context";
import type { PageType } from "@/types/page-type";

export default async function PapiKostickInvitationResultPage({
  params,
}: PageType) {
  const { slug } = await params;
  return (
    <PapiKostickResultProvider slug={slug}>
      <PapiKostickInvitationResultWrapper />
    </PapiKostickResultProvider>
  );
}
