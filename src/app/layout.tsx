import { ThemeProvider } from "@/components/theme-provider";
import { getSiteUrl } from "@/app/lib/site";
import type { Metadata, Viewport } from "next";
import { Geist, JetBrains_Mono, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const siteUrl = getSiteUrl();

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  style: ["normal", "italic"],
  variable: "--font-source-serif",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "David Dew Mallick",
  url: siteUrl,
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
  metadataBase: new URL(siteUrl),
  title: {
    default: "David Dew Mallick | Software Engineer",
    template: "%s | David Dew Mallick",
  },
  description:
    "Software engineer in Dhaka, Bangladesh building AI-driven SaaS infrastructure, cloud pipelines, and data-heavy features with Laravel and AWS.",
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
    types: {
      "application/rss+xml": "/feed.xml",
    },
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
    url: siteUrl,
    title: "David Dew Mallick | Software Engineer",
    description:
      "Software engineer in Dhaka, Bangladesh building AI-driven SaaS infrastructure, cloud pipelines, and data-heavy features with Laravel and AWS.",
    siteName: "David Dew Mallick",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "David Dew Mallick, Software Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "David Dew Mallick | Software Engineer",
    description:
      "Software engineer in Dhaka, Bangladesh building AI-driven SaaS infrastructure, cloud pipelines, and data-heavy features with Laravel and AWS.",
    creator: "@dew97_tech",
    images: ["/og.png"],
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
    { media: "(prefers-color-scheme: light)", color: "#f3e9d8" },
    { media: "(prefers-color-scheme: dark)", color: "#1b1512" },
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
        className={`${geistSans.variable} ${jetbrainsMono.variable} ${sourceSerif.variable} antialiased min-h-screen flex flex-col bg-background text-foreground`}
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
