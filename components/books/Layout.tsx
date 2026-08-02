import Footer from "./Footer";
import Header from "./Header";
import Hero from "./Hero";

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fff9f4] text-slate-900">
      <Header />

      <main className="flex-1">
        <Hero />
      </main>

      <Footer />
    </div>
  );
}