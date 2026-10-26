import WwqTestForm from "@/features/wwq-test/test-form/test-form";
import type { PageType } from "@/types/page-type";

export default async function WwqTestPage({ params }: PageType) {
  const { slug } = await params;
  return <WwqTestForm invitationId={slug} />;
}
