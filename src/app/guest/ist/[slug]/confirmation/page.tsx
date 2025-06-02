import { AnimatedWrapper } from "@/components/ui/animated-wrapper";
import { Logo } from "@/components/ui/logo";
import type { PageType } from "@/types/page-type";
import { notFound } from "next/navigation";

const KraepelinConfirmationPage = async ({ params }: PageType) => {
  // example validation invitation
  const { slug } = await params;
  if (!slug) {
    notFound();
  }
  // const data = await findKraepelinInvitation(slug);
  // if (!data) notFound();
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-3 md:p-10">
      <AnimatedWrapper>
        <div className="mb-3">
          <Logo />
        </div>
      </AnimatedWrapper>
      {/* Create form */}
    </div>
  );
};
export default KraepelinConfirmationPage;
