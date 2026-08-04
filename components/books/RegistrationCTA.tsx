"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Mail,
  Sparkles,
} from "lucide-react";

import Container from "./Container";

export default function RegistrationCTA() {
  return (
    <section
      id="registration"
      className="relative overflow-hidden bg-[#fff7ed] py-20 sm:py-24 lg:py-28"
    >
      {/* Background illustration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-orange-300/35 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-amber-300/40 blur-3xl" />

        <div className="absolute left-[10%] top-[22%] h-16 w-16 rotate-12 rounded-2xl border border-orange-300/40 bg-white/40" />
        <div className="absolute right-[12%] top-[18%] h-24 w-24 -rotate-12 rounded-full border border-orange-300/40 bg-white/30" />
        <div className="absolute bottom-[12%] left-[35%] h-10 w-10 rotate-45 rounded-xl bg-orange-300/25" />
      </div>

      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-orange-600 via-orange-500 to-amber-400 px-6 py-14 text-center shadow-[0_30px_80px_-30px_rgba(194,65,12,0.55)] sm:px-10 sm:py-16 lg:px-16"
        >
          {/* Decorative shapes inside card */}
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full border-[35px] border-white/10" />
          <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full border-[40px] border-orange-900/10" />

          <div className="relative z-10 mx-auto max-w-3xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur-sm">
              <Sparkles className="h-8 w-8" />
            </div>

            <p className="mt-6 text-sm font-bold uppercase tracking-[0.25em] text-orange-100">
              Join the Celebration
            </p>

            <h2 className="mt-4 text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
              Be Part of the Official
              <span className="block text-orange-100">
                Book Launch
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-orange-50">
              Register to receive launch updates, event information, and news
              about EvaSUE&apos;s first published book.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/registrations"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 font-bold text-orange-700 shadow-lg transition hover:-translate-y-1 hover:bg-orange-50"
              >
                Register Now

                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>

              <a
                href="mailto:info@evasue.net"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/50 bg-white/10 px-8 py-4 font-bold text-white backdrop-blur-sm transition hover:-translate-y-1 hover:bg-white/20"
              >
                <Mail className="h-5 w-5" />
                Contact Us
              </a>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
