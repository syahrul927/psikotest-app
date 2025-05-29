import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { userAccessRouter } from "./routers/user-access-router";
import {
  kraeplinInvitationRouter,
  publicKraeplinInvitationRouter,
} from "./routers/kraeplin-invitation-router";
import { kraeplinTestRouter } from "./routers/kraeplin-test-router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  userAccess: userAccessRouter,
  kraeplinInvitation: kraeplinInvitationRouter,
  publicKraeplinInvitation: publicKraeplinInvitationRouter,
  kraeplinTest: kraeplinTestRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
