import type { Metadata } from "next";
import Link from "next/link";

import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Sparkles,
} from "lucide-react";

import BookLaunchForm from "@/components/books/BookLaunchForm";
import Container from "@/components/books/Container";
import Footer from "@/components/books/Footer";
import Header from "@/components/books/Header";

export const metadata: Metadata = {
  title: "Book Launch Registration",
  description:
    "Reserve your place at the official EvaSUE book launch ceremony.",
};

export default function RegistrationsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fffaf5] text-slate-900">
      <Header />

      <main className="relative flex-1 overflow-hidden">
        {/* Blurred background decoration */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 -top-24 h-[28rem] w-[28rem] rounded-full bg-orange-300/35 blur-[110px]" />

          <div className="absolute -right-32 top-[20%] h-[34rem] w-[34rem] rounded-full bg-amber-300/35 blur-[130px]" />

          <div className="absolute bottom-[-10rem] left-[30%] h-[30rem] w-[30rem] rounded-full bg-orange-200/40 blur-[120px]" />

          <div className="absolute left-[8%] top-[28%] h-20 w-20 rotate-12 rounded-3xl border border-orange-300/30 bg-white/30 backdrop-blur-sm" />

          <div className="absolute right-[10%] top-[18%] h-28 w-28 -rotate-12 rounded-full border border-amber-300/30 bg-white/30 backdrop-blur-sm" />

          <div className="absolute bottom-[15%] right-[18%] h-14 w-14 rotate-45 rounded-2xl bg-orange-300/20" />
        </div>

        {/* Soft overlay */}
        <div className="pointer-events-none absolute inset-0 bg-white/35 backdrop-blur-[2px]" />

        <section className="relative z-10 py-12 sm:py-16 lg:py-20">
          <Container>
            {/* Back link */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/75 px-5 py-2.5 text-sm font-bold text-orange-700 shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white hover:text-orange-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to book page
            </Link>

            {/* Page heading */}
            <div className="mx-auto mt-10 max-w-3xl text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-600 text-white shadow-lg shadow-orange-600/25">
                <Sparkles className="h-7 w-7" />
              </div>

              <p className="mt-6 text-sm font-black uppercase tracking-[0.25em] text-orange-600">
                Book Launch Registration
              </p>

              <h1 className="mt-4 text-4xl font-black leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Register for the
                <span className="block text-orange-600">
                  Book Launch Ceremony
                </span>
              </h1>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                Complete the form below to reserve your place at EvaSUE&apos;s
                first official book launch ceremony.
              </p>

              {/* Event information */}
              <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/75 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-xl">
                  <CalendarDays className="h-4 w-4 text-orange-600" />
                  Date coming soon
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/75 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-xl">
                  <MapPin className="h-4 w-4 text-orange-600" />
                  Addis Ababa, Ethiopia
                </div>
              </div>
            </div>

            {/* Floating registration card */}
            <div className="mx-auto mt-12 max-w-3xl">
              <div className="rounded-[2.5rem] border border-white/70 bg-white/70 p-2 shadow-[0_35px_100px_-35px_rgba(194,65,12,0.45)] backdrop-blur-2xl sm:p-3">
                <BookLaunchForm />
              </div>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
}