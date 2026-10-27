// Feature toggles read from NEXT_PUBLIC_* env vars. These are inlined at
// BUILD time by Next.js — changing a value requires a rebuild, not just a
// restart. Default false when unset.
//
// Note the asymmetry: `navigation-menu.ts` is imported by a "use client"
// component, so the flag there is baked into the browser bundle at build
// time. A server component (e.g. the /wwq-settings page guard) evaluates this
// module once per server process, from the server's actual runtime env — so a
// restart can change the guard's behaviour without a rebuild while the sidebar
// stays stale. Both sides default to false unless the value is exactly "true";
// set the var once and rebuild to keep menu and guard in lockstep.
export const wwqSettingsEnabled =
  process.env.NEXT_PUBLIC_WWQ_SETTINGS_ENABLED === "true";
