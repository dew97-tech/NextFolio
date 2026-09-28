import { LegalPage } from "@/components/legal-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie policy",
  description:
    "davidmallick.dev uses no tracking cookies. Only a theme preference in localStorage and, for the site owner, a sign-in cookie in the admin area.",
  alternates: {
    canonical: "/cookies",
  },
};

export default function CookiesPage() {
  return (
    <LegalPage
      title="Cookie policy"
      updated="Sep 28, 2026"
      intro="This site uses no analytics, advertising, or tracking cookies, so there is no consent banner to dismiss. Here is everything that is stored in your browser."
      sections={[
        {
          heading: "Functional storage",
          paragraphs: [
            "Theme preference: the light or dark mode you choose is written to localStorage under a single key and never leaves your browser. It is not a cookie and is not shared.",
          ],
        },
        {
          heading: "Authentication cookie",
          paragraphs: [
            "The private admin area uses an authentication cookie (__Host-authjs.session-token) issued by Auth.js when the site owner signs in. It is HttpOnly, Secure, and SameSite=Lax.",
            "Public visitors never receive this cookie; it exists only to keep the owner signed in to publish posts.",
          ],
        },
        {
          heading: "Third parties",
          paragraphs: [
            "No third-party analytics, embeds, or ad networks run on this site, so no third-party cookies are set.",
          ],
        },
        {
          heading: "Managing storage",
          paragraphs: [
            "You can clear the theme preference at any time by clearing site data in your browser. The site will fall back to your system color scheme.",
          ],
        },
      ]}
    />
  );
}
