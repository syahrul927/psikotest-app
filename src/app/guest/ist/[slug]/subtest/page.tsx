import { IstSubtests, IstWrapper } from "@/features/ist-subtest";
import { type PageType } from "@/types/page-type";
import { notFound } from "next/navigation";

export default async function IstSubtestSelectionPage({ params }: PageType) {
  const { slug } = await params;
  if (!slug) {
    return notFound();
  }
  return (
    <IstWrapper>
      <IstSubtests id={slug} />
    </IstWrapper>
  );
}
