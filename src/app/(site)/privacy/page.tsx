import { LegalPage } from "@/components/legal-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "How davidmallick.dev handles data: no analytics, no tracking, no advertising, and a single sign-in cookie for the private admin area.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      updated="Sep 28, 2026"
      intro="This site is a personal portfolio and technical blog. It is built to collect as little as possible: no analytics, no advertising, and no tracking scripts."
      sections={[
        {
          heading: "What is collected",
          paragraphs: [
            "Visiting the public site does not require an account and does not create a profile of you. The hosting platform, Vercel, processes standard request logs (IP address, user agent, requested URL) to serve and protect the site, as any web server does.",
            "The blog and sitemap are stored in a PostgreSQL database hosted by Supabase. The database holds article content only, never visitor data.",
          ],
        },
        {
          heading: "Cookies",
          paragraphs: [
            "The public site sets no tracking cookies. The only state stored in your browser is the light or dark theme preference, which lives in localStorage, not in a cookie.",
            "The private admin area sets an authentication cookie (__Host-authjs.session-token) when the site owner signs in. It is marked HttpOnly, Secure, and SameSite=Lax, and it is never served to public visitors. See the cookie policy for details.",
          ],
        },
        {
          heading: "Email",
          paragraphs: [
            "If you contact me by email, your message and address are used to reply and nothing else. They are not added to a mailing list and are not shared with anyone.",
          ],
        },
        {
          heading: "Your choices",
          paragraphs: [
            "Because the public site does not collect personal data, there is nothing to export or delete. If you believe a specific record exists, email david.dew.mallick@g.bracu.ac.bd and I will answer or remove it within 30 days.",
          ],
        },
        {
          heading: "Changes",
          paragraphs: [
            "If tracking is ever added (for example, privacy-friendly analytics), this page will describe it before it ships and the date above will change.",
          ],
        },
      ]}
    />
  );
}
