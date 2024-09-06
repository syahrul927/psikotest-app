import { NextResponse } from "next/server";
import { env } from "../../../env";
import { db } from "../../../server/db";

export async function GET(request: Request) {
	await db.$queryRaw`SELECT 1`;
	return NextResponse.json({
		message: `Healthy ${env.APP_NAME}`,
	});
}
