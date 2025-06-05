import { KraepelinScreenWrapper } from "@/features/kraepelin-test";
import type { PageType } from "@/types/page-type";

export default async function KraepelinTestPage({ params }: PageType) {
  const { slug } = await params;
  return <h1>Page testing</h1>;
}
