import { type User, type DefaultSession } from "next-auth";
import { type DefaultJWT } from "next-auth/jwt";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface User extends DefaultSession.user {}
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & User;
  }
}
declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    user: User;
  }
}
