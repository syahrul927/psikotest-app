import PapiKostickTestForm from "@/features/papi-kostick-test/test-form/test-form";
import type { PageType } from "@/types/page-type";

export default async function PapiKostickTestPage({ params }: PageType) {
  const { slug } = await params;
  return <PapiKostickTestForm invitationId={slug} />;
}
