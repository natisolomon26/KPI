import AboutBook from "./AboutBook";
import Footer from "./Footer";
import Header from "./Header";
import Hero from "./Hero";
import AboutAuthor from "./AboutAuthor";
import WhyBookMatters from "./WhyBookMatters";
export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fff9f4] text-slate-900">
      <Header />

      <main className="flex-1">
        <Hero />
        <AboutBook />
        <AboutAuthor />
        <WhyBookMatters />
      </main>

      <Footer />
    </div>
  );
}