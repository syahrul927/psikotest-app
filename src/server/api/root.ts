import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { userAccessRouter } from "./routers/user-access-router";
import {
  kraepelinInvitationRouter,
  publicKraepelinInvitationRouter,
} from "./routers/kraepelin-invitation-router";
import { kraepelinTestRouter } from "./routers/kraepelin-test-router";
import { istInvitationRouter } from "./routers/ist-invitation-router/protected";
import { publicIstInvitationRouter } from "./routers/ist-invitation-router/public";
import { IstSubtestRouter } from "./routers/ist-test-router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  userAccess: userAccessRouter,
  kraepelinInvitation: kraepelinInvitationRouter,
  publicKraepelinInvitation: publicKraepelinInvitationRouter,
  kraepelinTest: kraepelinTestRouter,
  istInvitation: istInvitationRouter,
  istSubtest: IstSubtestRouter, 
  publicIstInvitation: publicIstInvitationRouter,
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
