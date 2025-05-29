import { KraeplinProfileForm } from "@/features/kraeplin-test";
import { type PageType } from "@/types/page-type";
import { notFound } from "next/navigation";

export default async function KraeplinProfilePage({ params }: PageType) {
  const { slug } = await params;
  if (!slug) {
    return notFound();
  }
  return <KraeplinProfileForm id={slug} />;
}
