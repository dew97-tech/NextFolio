import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { ReadingProgress } from "@/components/reading-progress";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ReadingProgress />
      <Navbar />
      <main id="main-content" className="paper-canvas flex-grow">
        {children}
      </main>
      <Footer />
    </>
  );
}
