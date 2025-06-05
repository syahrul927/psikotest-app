import { notFound } from "next/navigation";
import type { PageType } from "@/types/page-type";
import { Logo } from "@/components/ui/logo";
import { AnimatedWrapper } from "@/components/ui/animated-wrapper";
import { findIstInvitation } from "@/hooks/api/ist-invitation/user-find-ist-invitation";
import { IstInvitationConfirmation } from "@/features/ist-subtest/ist-invitation-confirmation";

const IstConfirmationPage = async ({ params }: PageType) => {
  const { slug } = await params;
  if (!slug) {
    notFound();
  }
  const data = await findIstInvitation(slug);
  if (!data) notFound();
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-3 md:p-10">
      <AnimatedWrapper>
        <div className="mb-3">
          <Logo />
        </div>
      </AnimatedWrapper>
      <IstInvitationConfirmation
        slug={slug}
        name={data.invitationName ?? ""}
      />
    </div>
  );
};
export default IstConfirmationPage;
