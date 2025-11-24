import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://david-dew-mallick.vercel.app", // Placeholder URL
    title: "David Dew Mallick | Software Engineer",
    description: "Portfolio of David Dew Mallick, a Software Engineer specializing in Next.js and AI-driven solutions.",
    siteName: "David Dew Mallick Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "David Dew Mallick | Software Engineer",
    description: "Portfolio of David Dew Mallick, a Software Engineer specializing in Next.js and AI-driven solutions.",
    creator: "@dew97_tech", // Placeholder handle
  },
  verification: {
    google: "PfnsS0haOH5hKybjZAz_cQoqfEi6BmwL-xj0kyl2rNo",
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon.png', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '192x192',
        url: '/android-chrome-192x192.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '512x512',
        url: '/android-chrome-512x512.png',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex-grow pt-16 md:pt-20">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
