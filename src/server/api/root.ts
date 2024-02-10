import { createTRPCRouter } from "~/server/api/trpc";
import { testKrapelinRouter } from "./routers/testKraepelin";
import { invitationRouter } from "./routers/invitation";
import { pubInvitationRouter } from "./routers/pubInvitation";
import { resultRouter } from "./routers/result";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	testKraepelin: testKrapelinRouter,
	invitation: invitationRouter,
	user: userRouter,
	result: resultRouter,
	publicInvitation: pubInvitationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
