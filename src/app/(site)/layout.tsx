import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-grow">
        {children}
      </main>
      <Footer />
    </>
  );
}
