import { AnimatedWrapper } from "@/components/ui/animated-wrapper";
import { Logo } from "@/components/ui/logo";
import { PapiKostickInvitationFormConfirmation } from "@/features/papi-kostick-test";
import { findPapiKostickInvitation } from "@/hooks/api/papi-kostick-invitation/use-find-papi-kostick-invitation";
import type { PageType } from "@/types/page-type";
import { notFound } from "next/navigation";

const PapiKostickConfirmationPage = async ({ params }: PageType) => {
  const { slug } = await params;

  if (!slug) notFound();

  const data = await findPapiKostickInvitation(slug).catch((_e) => {
    notFound();
  });

  if (!data) notFound();

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-3 md:p-10">
      <AnimatedWrapper>
        <div className="mb-3">
          <Logo />
        </div>
      </AnimatedWrapper>
      {/* form confirmation */}
      <PapiKostickInvitationFormConfirmation
        invitationName={data.invitationName ?? ""}
        invitationId={slug}
      />
    </div>
  );
};
export default PapiKostickConfirmationPage;
