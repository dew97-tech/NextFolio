import { CursorTrail } from "@/components/cursor-trail";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { PerformanceMonitor } from "@/components/performance-monitor";
import { ThemeProvider } from "@/components/theme-provider";
import { PhysicsProvider } from "@/lib/motion/physics-context";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
  description: "Portfolio of David Dew Mallick, a Software Engineer specializing in Next.js, AI-driven solutions, and full-stack development.",
  keywords: ["Software Engineer", "Next.js", "React", "AI", "Web Developer", "Portfolio", "David Dew Mallick"],
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
    description: "Portfolio of David Dew Mallick, a Software Engineer specializing in Next.js and AI-driven solutions.",
    siteName: "David Dew Mallick Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "David Dew Mallick | Software Engineer",
    description: "Portfolio of David Dew Mallick, a Software Engineer specializing in Next.js and AI-driven solutions.",
    creator: "@dew97_tech",
  },
  verification: {
    google: "PfnsS0haOH5hKybjZAz_cQoqfEi6BmwL-xj0kyl2rNo",
  },
  icons: {
    icon: [
      { url: '/icon.svg?v=3', type: 'image/svg+xml' },
      { url: '/favicon.svg?v=3', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/icon.svg?v=3' },
    ],
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
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0e17" },
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PhysicsProvider>
            <PerformanceMonitor />
            <CursorTrail />
            <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md">
              Skip to main content
            </a>
            <Navbar />
            <main id="main-content" className="flex-grow pt-16 md:pt-20" tabIndex={-1}>
              {children}
            </main>
            <Footer />
          </PhysicsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
