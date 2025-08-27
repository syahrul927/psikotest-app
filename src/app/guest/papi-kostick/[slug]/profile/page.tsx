import { PapiKostickProfileForm } from "@/features/papi-kostick-test";
import type { PageType } from "@/types/page-type";
import { notFound } from "next/navigation";

export default async function PapiKostickProfilePage({ params }: PageType) {
  const { slug } = await params;
  if (!slug) return notFound();

  return <PapiKostickProfileForm id={slug} />;
}
