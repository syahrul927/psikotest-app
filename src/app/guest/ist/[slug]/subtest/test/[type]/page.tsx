import { IstWrapper } from "@/features/ist-subtest";
import { IstSelectedTest } from "@/features/ist-subtest/ist-test-page";
import { type PageType } from "@/types/page-type";
import { notFound } from "next/navigation";

export default async function IstTestPage({ params }: PageType) {
  const { slug, type } = await params;
  if (!slug || !type) {
    return notFound();
  }

  return (
    <IstWrapper>
      <IstSelectedTest slug={slug} type={type} />
    </IstWrapper>
  );
}
