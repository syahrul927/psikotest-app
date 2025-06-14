import { IstSelectedTest } from "@/features/ist-subtest/ist-test-page";
import { type PageType } from "@/types/page-type";
import { notFound } from "next/navigation";

export default async function IstTestPage({ params }: PageType) {
  const { slug, type } = await params;
  if (!slug || !type) {
    return notFound();
  }
  console.log(await params)
  return <IstSelectedTest slug={slug}/>;
}
