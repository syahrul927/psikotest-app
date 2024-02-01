import { redirect } from "next/navigation";
import { type PageType } from "~/types/page-type";
import { InvitationForm } from "../components/invitation-form";
import { api } from "~/trpc/server";

export default async function UpdateInvitationPage({ searchParams }: PageType) {
	const id = searchParams.id;
	if (!id || id instanceof Array) {
		redirect("/invitation");
	}
	const data = await api.invitation.getById.query(id);
	return (
		<div className="flex flex-col h-full max-w-xl">
			<InvitationForm update={true} data={data} />
		</div>
	);
}
