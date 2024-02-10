import { redirect } from "next/navigation";
import { api } from "~/trpc/server";
import { type PageType } from "~/types/page-type";
import { UserForm } from "../components/user-form";

export default async function UpdateUserPage({ searchParams }: PageType) {
	const id = searchParams.id;
	if (!id || id instanceof Array) {
		redirect("/user");
	}
	const data = await api.user.getById.query(id).catch((err) => {
		redirect("/user");
	});
	return (
		<div className="flex flex-col h-full max-w-xl">
			<UserForm update={true} data={data} />
		</div>
	);
}
