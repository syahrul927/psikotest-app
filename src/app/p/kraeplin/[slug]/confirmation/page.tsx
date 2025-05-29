import { notFound } from "next/navigation";
import type { PageType } from "@/types/page-type";
import { useFindKraeplinInvitation } from "@/hooks/api/kraeplin-invitation/use-find-kraeplin-invitation";
import { Logo } from "@/components/ui/logo";
import { AnimatedWrapper } from "@/components/ui/animated-wrapper";
import { KraeplinInvitationConfirmation } from "@/features/kraeplin-test";

const KraeplinConfirmationPage = async ({ params }: PageType) => {
  const { slug } = await params;
  if (!slug) {
    notFound();
  }
  const data = await useFindKraeplinInvitation(slug);
  if (!data) notFound();
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-3 md:p-10">
      <AnimatedWrapper>
        <div className="mb-3">
          <Logo />
        </div>
      </AnimatedWrapper>
      <KraeplinInvitationConfirmation
        slug={slug}
        name={data.invitationName ?? ""}
      />
    </div>
  );
};
export default KraeplinConfirmationPage;
