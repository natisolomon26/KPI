import Container from "./Container";

export default function Footer() {
  return (
    <footer className="border-t border-orange-100 bg-white">
      <Container className="flex flex-col items-center justify-between gap-4 py-8 text-sm text-slate-500 md:flex-row">
        <p className="font-semibold text-slate-700">
          EvaSUE Books
        </p>

        <p>
          © {new Date().getFullYear()} EvaSUE. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}