import { IstSelectedTest } from "@/features/ist-subtest/ist-test-page";
import { type PageType } from "@/types/page-type";
import { notFound } from "next/navigation";

export default async function IstTestPage({ params }: PageType) {
  const { slug, type } = await params;
  if (!slug || !type) {
    return notFound();
  }

  // TODO: select ist session by istInvitationId and subtestTemplateId and startedAt == null
  // if not found return notFound()
  // when session already started, user can't open this page again.
  return <IstSelectedTest slug={slug} type={type} />;
}
