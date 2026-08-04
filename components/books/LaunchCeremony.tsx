"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Mic2,
  Navigation,
  ArrowRight,
} from "lucide-react";

import Container from "./Container";

const eventDetails = [
  {
    label: "Date",
    value: "Coming Soon",
    icon: CalendarDays,
  },
  {
    label: "Time",
    value: "To Be Announced",
    icon: Clock3,
  },
  {
    label: "Venue",
    value: "Addis Ababa, Ethiopia",
    icon: MapPin,
  },
  {
    label: "Speakers",
    value: "Author, EvaSUE Leadership & Special Guests",
    icon: Mic2,
  },
];

export default function LaunchCeremony() {
  return (
    <section
      id="launch"
      className="relative overflow-hidden bg-[#fff7ed] py-20 sm:py-24 lg:py-28"
    >
      {/* Decorative background */}
      <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-orange-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-amber-200/50 blur-3xl" />

      <Container className="relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-600">
            Official Book Launch
          </p>

          <h2 className="mt-4 text-4xl font-black leading-tight text-slate-900 sm:text-5xl">
            Join Us for the
            <span className="block text-orange-600">
              Launch Ceremony
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Celebrate the release of EvaSUE&apos;s first published book with
            the author, ministry leaders, invited guests, students, and
            graduates.
          </p>
        </motion.div>

        {/* Main content */}
        <div className="mt-14 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
          {/* Event details card */}
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-orange-100 bg-white p-6 shadow-[0_20px_55px_-30px_rgba(194,65,12,0.4)] sm:p-8"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {eventDetails.map((detail, index) => {
                const Icon = detail.icon;

                return (
                  <motion.div
                    key={detail.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.45,
                      delay: index * 0.08,
                    }}
                    className="rounded-2xl border border-orange-100 bg-[#fffaf5] p-5"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                      <Icon className="h-5 w-5" />
                    </div>

                    <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-orange-600">
                      {detail.label}
                    </p>

                    <p className="mt-2 font-bold leading-6 text-slate-900">
                      {detail.value}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-7 rounded-2xl bg-orange-50 p-5">
              <h3 className="text-lg font-black text-slate-900">
                Reserve Your Place
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Registration details will be updated once the official launch
                date and venue are confirmed.
              </p>

              <Link
                href="/registrations"
                className="group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-orange-600 px-7 py-3.5 font-bold text-white shadow-lg shadow-orange-600/20 transition hover:-translate-y-1 hover:bg-orange-700 sm:w-auto"
              >
                Register for the Launch

                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>

          {/* Map placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative min-h-[420px] overflow-hidden rounded-3xl border border-orange-100 bg-gradient-to-br from-orange-100 via-amber-50 to-white shadow-[0_20px_55px_-30px_rgba(194,65,12,0.4)]"
          >
            {/* Fake map pattern */}
            <div className="absolute inset-0 opacity-40">
              <div className="absolute left-[12%] top-0 h-full w-3 rotate-12 bg-white" />
              <div className="absolute right-[20%] top-0 h-full w-2 -rotate-6 bg-white" />
              <div className="absolute left-0 top-[30%] h-3 w-full -rotate-3 bg-white" />
              <div className="absolute left-0 top-[68%] h-2 w-full rotate-6 bg-white" />
            </div>

            <div className="relative z-10 flex h-full min-h-[420px] flex-col items-center justify-center p-8 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-600 text-white shadow-xl shadow-orange-600/25">
                <MapPin className="h-9 w-9" />
              </div>

              <p className="mt-6 text-xs font-bold uppercase tracking-[0.22em] text-orange-600">
                Venue Map
              </p>

              <h3 className="mt-3 text-3xl font-black text-slate-900">
                Location Coming Soon
              </h3>

              <p className="mt-4 max-w-sm leading-7 text-slate-600">
                The official venue address and interactive map will appear
                here once the launch location is confirmed.
              </p>

              <button
                type="button"
                disabled
                className="mt-6 inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-orange-200 bg-white px-6 py-3 font-bold text-orange-400 opacity-80"
              >
                <Navigation className="h-4 w-4" />
                Open in Maps
              </button>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}