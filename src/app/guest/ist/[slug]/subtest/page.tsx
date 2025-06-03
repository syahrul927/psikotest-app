import { IstProfileForm } from "@/features/ist-subtest/ist-profile-form/form";
import IstSubtestsPage from "@/features/ist-subtest/ist-subtest-choice/choice";
import { type PageType } from "@/types/page-type";
import { notFound } from "next/navigation";

export default async function KraepelinProfilePage({ params }: PageType) {
  const { slug } = await params;
  if (!slug) {
    return notFound();
  }
  return <IstSubtestsPage id={slug} />;
}
