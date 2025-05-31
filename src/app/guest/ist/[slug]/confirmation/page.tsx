import { notFound } from "next/navigation";
import type { PageType } from "@/types/page-type";
import { Logo } from "@/components/ui/logo";
import { AnimatedWrapper } from "@/components/ui/animated-wrapper";
import { findKraepelinInvitation } from "@/hooks/api/kraepelin-invitation/use-find-kraepelin-invitation";
import { KraepelinInvitationConfirmation } from "@/features/kraepelin-test";

const KraepelinConfirmationPage = async ({ params }: PageType) => {
  const { slug } = await params;
  if (!slug) {
    notFound();
  }
  const data = await findKraepelinInvitation(slug);
  if (!data) notFound();
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-3 md:p-10">
      <AnimatedWrapper>
        <div className="mb-3">
          <Logo />
        </div>
      </AnimatedWrapper>
      <KraepelinInvitationConfirmation
        slug={slug}
        name={data.invitationName ?? ""}
      />
    </div>
  );
};
export default KraepelinConfirmationPage;
