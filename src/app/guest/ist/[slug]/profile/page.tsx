import { IstProfileForm } from "@/features/ist-subtest";
import { type PageType } from "@/types/page-type";
import { notFound } from "next/navigation";

export default async function IstProfilePage({ params }: PageType) {
  const { slug } = await params;
  if (!slug) {
    return notFound();
  }
  return <IstProfileForm id={slug} />;
}
