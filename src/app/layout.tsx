import "@/styles/globals.css";

import { type Metadata, type Viewport } from "next";

import { Toaster } from "@/components/ui/sonner";
import { TRPCReactProvider } from "@/trpc/react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { TailwindIndicator } from "@/components/ui/tailwind-indicator";

/**
 * Search-facing copy for the app. Its SEO is deliberately not maintained here —
 * https://selsafical.app is the site built for that — but these tags are still what Google
 * shows for this domain, and the old description ("Capture your moments!") was left over
 * from a different product: it described nothing a recruiter or candidate searches for.
 * Metadata only; no routes, robots.txt, sitemap or rendering touched.
 */
export const metadata: Metadata = {
  title: "Selsafical — Aplikasi Psikotes Online",
  description:
    "Aplikasi tempat kandidat mengerjakan psikotes online: Kraepelin, IST, PAPI-Kostick, dan WWQ dibuka lewat link undangan, tanpa install.",
  applicationName: "Selsafical",
  icons: [{ rel: "icon", url: "/favicon.svg" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <TRPCReactProvider>{children}</TRPCReactProvider>
          </SessionProvider>
          <Toaster />
          <TailwindIndicator />
        </ThemeProvider>
      </body>
    </html>
  );
}
