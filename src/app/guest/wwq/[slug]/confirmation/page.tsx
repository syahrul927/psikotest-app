import { AnimatedWrapper } from "@/components/ui/animated-wrapper";
import { Logo } from "@/components/ui/logo";
import { WwqInvitationFormConfirmation } from "@/features/wwq-test";
import { api } from "@/trpc/server";
import type { PageType } from "@/types/page-type";
import { notFound } from "next/navigation";

const WwqConfirmationPage = async ({ params }: PageType) => {
  const { slug } = await params;

  if (!slug) notFound();

  const data = await api.publicWwqInvitation
    .findWwqInvitation(slug)
    .catch((_e) => {
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
      <WwqInvitationFormConfirmation
        invitationName={data.invitationName ?? ""}
        invitationId={slug}
      />
    </div>
  );
};
export default WwqConfirmationPage;
