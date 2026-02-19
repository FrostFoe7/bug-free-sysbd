import "@/styles/globals.css";

import { Inter, Hind_Siliguri } from "next/font/google";
import { headers } from "next/headers";
import { TRPCReactProvider } from "@/trpc/react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { SupabaseProvider } from "@/components/providers/supabase-provider";
import { Suspense } from "react";
import FullscreenImageView from "@/components/fullscreen-image-view";
import Loading from "@/app/(pages)/loading";
import { siteConfig } from "@/config/site";
import type { Metadata, Viewport } from "next";
import { SmoothCursor } from "@/components/ui/smooth-cursor";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-bengali",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://threads.codebustar.com"),
  title: {
    default: siteConfig.name,
    template: `%s • ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "nextjs",
    "prisma",
    "tRPC",
    "sujjeee",
    "sysm",
    "social",
    "t3-stack",
    "supabase",
    "shadcn ui",
  ],
  authors: [
    {
      name: "sujjeee",
      url: "https://x.com/sujjeeee",
    },
  ],
  creator: "sujjeee",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@sujjeeee",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`no-scrollbar font-sans cursor-none ${inter.variable} ${hindSiliguri.variable}`}
      >
        <SmoothCursor />
        <SupabaseProvider>
          <TRPCReactProvider headers={headers()}>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
              <Suspense fallback={<Loading />}>
                <FullscreenImageView />
              </Suspense>
            </ThemeProvider>
          </TRPCReactProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
