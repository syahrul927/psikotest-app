import type { PageType } from "@/types/page-type";

export default async function ResultISTInvitationPage({ params }: PageType) {
  const { slug } = await params;
  return <div>Hello {slug}</div>;
}
