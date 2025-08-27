import { AnimatedWrapper } from "@/components/ui/animated-wrapper";
import { Logo } from "@/components/ui/logo";
import { IstInvitationConfirmation } from "@/features/ist-subtest/ist-invitation-confirmation";
import { findIstInvitation } from "@/hooks/api/ist-invitation/user-find-ist-invitation";
import type { PageType } from "@/types/page-type";
import { notFound } from "next/navigation";

const IstConfirmationPage = async ({ params }: PageType) => {
  const { slug } = await params;
  if (!slug) {
    notFound();
  }
  const data = await findIstInvitation(slug).catch((_e) => {
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
      <IstInvitationConfirmation
        invitationId={slug}
        invitationName={data.invitationName ?? ""}
      />
    </div>
  );
};
export default IstConfirmationPage;
