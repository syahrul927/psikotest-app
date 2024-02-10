"use server";
import { env } from "~/env";

export default async function getUrl() {
	return env.BASE_URL;
}
