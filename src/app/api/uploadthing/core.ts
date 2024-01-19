import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerAuthSession } from "~/server/auth";
import { db } from "~/server/db";

const f = createUploadthing();

const auth = async (req: Request) => {
	const session = await getServerAuthSession();
	if (session) return { ...session.user };
	return null;
};
export const ourFileRouter = {
	imageUploader: f({ image: { maxFileSize: "4MB" } })
		.middleware(async ({ req }) => {
			const user = await auth(req);
			if (!user) throw new Error("Unauthorized");

			return { userId: user.id };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			await db.assetUser.create({
				data: {
					id: file.key,
					key: file.key,
					name: file.name,
					size: file.size,
					url: file.url,
					userId: metadata.userId,
				},
			});
			return { uploadedBy: metadata.userId };
		}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
