import { KraepelinProfileForm } from "@/features/kraepelin-test";
import { type PageType } from "@/types/page-type";
import { notFound } from "next/navigation";

export default async function KraepelinProfilePage({ params }: PageType) {
  const { slug } = await params;
  if (!slug) {
    return notFound();
  }
  return <KraepelinProfileForm id={slug} />;
}
