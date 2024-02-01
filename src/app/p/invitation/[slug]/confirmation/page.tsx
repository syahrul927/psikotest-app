import { notFound } from "next/navigation";
import { type PageType } from "~/types/page-type";
import ConfirmationTest from "../components/confirmation-test";
import { api } from "~/trpc/server";

const StartInvitation = async ({ params }: PageType) => {
	if (!params.slug) {
		notFound();
	}
	const data = await api.publicInvitation.findInvitation.query(params.slug);
	if (!data) notFound();
	return (
		<div className="flex justify-center bg-white/80 backdrop-blur-lg">
			<ConfirmationTest slug={params.slug} />
		</div>
	);
};
export default StartInvitation;
