import { KraeplinScreenWrapper } from "@/features/kraeplin-test";
import type { PageType } from "@/types/page-type";

export default async function KraeplinTestPage({ params }: PageType) {
  return <KraeplinScreenWrapper slug={params.slug} />;
}
