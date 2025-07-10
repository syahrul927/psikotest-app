import { IstResultWrapper } from "@/features/ist-result";
import type { PageType } from "@/types/page-type";
export default async function IstInvitationResultPage({ params }: PageType) {
  const { slug } = await params;
  return (
    <div className="flex min-h-screen flex-col px-6">
      <IstResultWrapper slug={slug} />
    </div>
  );
}
