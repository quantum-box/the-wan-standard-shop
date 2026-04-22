import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-grow max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
      <Footer />
    </>
  );
}
