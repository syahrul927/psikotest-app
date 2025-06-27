import { IstReviewFormParent, IstReviewInfoCard } from "@/features/ist-review";
import { ReviewFormProvider } from "@/hooks/use-review-form-context";
import type { PageType } from "@/types/page-type";

export default async function IstInvitationReviewPage({ params }: PageType) {
  const { slug } = await params;

  return (
    <div className="flex flex-col gap-4 p-4">
      <IstReviewInfoCard invitationId={slug} />
      <ReviewFormProvider slug={slug}>
        <IstReviewFormParent slug={slug} />
      </ReviewFormProvider>
    </div>
  );
}
