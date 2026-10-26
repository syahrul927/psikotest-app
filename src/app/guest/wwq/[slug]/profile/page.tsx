import { WwqProfileForm } from "@/features/wwq-test";
import type { PageType } from "@/types/page-type";
import { notFound } from "next/navigation";

export default async function WwqProfilePage({ params }: PageType) {
  const { slug } = await params;
  if (!slug) return notFound();

  return <WwqProfileForm id={slug} />;
}
