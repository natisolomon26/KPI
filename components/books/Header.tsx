import Link from "next/link";
import Container from "./Container";

export default function Header() {
  return (
    <header className="border-b border-orange-100 bg-white">
      <Container className="flex items-center justify-between py-5">
        <Link
          href="/"
          className="text-xl font-black text-orange-600"
        >
          EvaSUE Books
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-700 md:flex">
          <a href="#book" className="transition hover:text-orange-600">
            Book
          </a>

         

          <a href="#launch" className="transition hover:text-orange-600">
            Launch
          </a>

        
        </nav>

        {/* <Link
          href="/register"
          className="rounded-full bg-orange-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-orange-700"
        >
          Register
        </Link> */}
      </Container>
    </header>
  );
}