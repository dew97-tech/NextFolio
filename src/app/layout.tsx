import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "David Dew Mallick",
  url: "https://david-dew-mallick.vercel.app",
  jobTitle: "Software Engineer",
  sameAs: [
    "https://github.com/dew97-tech",
    "https://www.linkedin.com/in/david-dew-mallick-618a6223b/",
  ],
  worksFor: {
    "@type": "Organization",
    name: "JB Connect Ltd.",
  },
};

export const metadata: Metadata = {
  metadataBase: new URL("https://david-dew-mallick.vercel.app"),
  title: {
    default: "David Dew Mallick | Software Engineer",
    template: "%s | David Dew Mallick",
  },
  description:
    "Software engineer in Dhaka, Bangladesh. Builds full-stack web applications with Next.js, Laravel, and AI-assisted automation.",
  keywords: [
    "Software Engineer",
    "Next.js",
    "React",
    "PHP",
    "Laravel",
    "Full Stack Developer",
    "Portfolio",
    "David Dew Mallick",
  ],
  authors: [{ name: "David Dew Mallick" }],
  creator: "David Dew Mallick",
  publisher: "David Dew Mallick",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://david-dew-mallick.vercel.app",
    title: "David Dew Mallick | Software Engineer",
    description:
      "Software engineer in Dhaka, Bangladesh. Builds full-stack web applications with Next.js, Laravel, and AI-assisted automation.",
    siteName: "David Dew Mallick",
  },
  twitter: {
    card: "summary_large_image",
    title: "David Dew Mallick | Software Engineer",
    description:
      "Software engineer in Dhaka, Bangladesh. Builds full-stack web applications with Next.js, Laravel, and AI-assisted automation.",
    creator: "@dew97_tech",
  },
  verification: {
    google: "PfnsS0haOH5hKybjZAz_cQoqfEi6BmwL-xj0kyl2rNo",
  },
  icons: {
    icon: [
      { url: "/icon.svg?v=3", type: "image/svg+xml" },
      { url: "/favicon.svg?v=3", type: "image/svg+xml" },
    ],
    apple: [{ url: "/icon.svg?v=3" }],
  },
  other: {
    "application/ld+json": JSON.stringify(jsonLd),
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f4f1" },
    { media: "(prefers-color-scheme: dark)", color: "#141512" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/icon.svg?v=3" />
        <link rel="alternate icon" href="/icon.svg?v=3" />
        <link rel="apple-touch-icon" href="/icon.svg?v=3" />
        <link rel="preconnect" href="https://github.com" />
        <link rel="preconnect" href="https://linkedin.com" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      </head>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} antialiased min-h-screen flex flex-col bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
