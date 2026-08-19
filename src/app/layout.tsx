import "~/styles/globals.css";

import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { type Metadata } from "next";
import { extractRouterConfig } from "uploadthing/server";

import { ourFileRouter } from "~/app/api/uploadthing/core";
import { getSiteUrl } from "~/lib/site";
import { TRPCReactProvider } from "~/trpc/react";

const siteUrl = getSiteUrl();
const description =
  "Tvorba priestorov s dôrazom na detail, funkčnosť a estetiku.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Mirka Moravcová — Interiérový dizajn",
    template: "%s | Mirka Moravcová",
  },
  description,
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    type: "website",
    locale: "sk_SK",
    siteName: "Mirka Moravcová",
    title: "Mirka Moravcová — Interiérový dizajn",
    description,
    images: [{ url: "/images/hero.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mirka Moravcová — Interiérový dizajn",
    description,
    images: ["/images/hero.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sk">
      <body>
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
