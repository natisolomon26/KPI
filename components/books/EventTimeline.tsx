"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  MessageCircle,
  Mic2,
  Users,
} from "lucide-react";

import Container from "./Container";

const scheduleItems = [
  {
    time: "09:00 AM",
    title: "Guest Arrival and Registration",
    description:
      "Guests arrive, complete registration, and connect with members of the EvaSUE community.",
    icon: Users,
  },
  {
    time: "10:00 AM",
    title: "Opening Ceremony",
    description:
      "Welcome remarks, prayer, and an introduction to the purpose of the book launch.",
    icon: CalendarDays,
  },
  {
    time: "10:45 AM",
    title: "Author Presentation",
    description:
      "The author shares the inspiration, message, and journey behind the publication.",
    icon: Mic2,
  },
  {
    time: "11:30 AM",
    title: "Official Book Launch",
    description:
      "The book is officially presented to the EvaSUE community and invited guests.",
    icon: BookOpen,
  },
  {
    time: "12:00 PM",
    title: "Discussion and Q&A",
    description:
      "Guests participate in an interactive conversation with the author and speakers.",
    icon: MessageCircle,
  },
  {
    time: "01:00 PM",
    title: "Closing and Fellowship",
    description:
      "Closing remarks, networking, fellowship, and opportunities to learn more about the publication.",
    icon: CheckCircle2,
  },
];

export default function EventTimeline() {
  return (
    <section
      id="schedule"
      className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-28"
    >
      <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-orange-100/70 blur-3xl" />

      <div className="pointer-events-none absolute -right-32 bottom-20 h-96 w-96 rounded-full bg-amber-100/70 blur-3xl" />

      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-600">
            Event Schedule
          </p>

          <h2 className="mt-4 text-4xl font-black leading-tight text-slate-900 sm:text-5xl">
            Launch Ceremony
            <span className="block text-orange-600">Timeline</span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            A placeholder schedule for the official book launch. Times and
            activities will be updated when the event program is confirmed.
          </p>
        </motion.div>

        <div className="relative mx-auto mt-16 max-w-4xl">
          <div className="absolute bottom-0 left-6 top-0 w-px bg-orange-200 md:left-1/2 md:-translate-x-1/2" />

          <div className="space-y-10">
            {scheduleItems.map((item, index) => {
              const Icon = item.icon;
              const isLeft = index % 2 === 0;

              return (
                <motion.article
                  key={item.title}
                  initial={{
                    opacity: 0,
                    x: isLeft ? -35 : 35,
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.25,
                  }}
                  transition={{
                    duration: 0.55,
                    delay: index * 0.08,
                  }}
                  className={`relative flex md:w-1/2 ${
                    isLeft
                      ? "md:justify-end md:pr-12"
                      : "md:ml-auto md:justify-start md:pl-12"
                  }`}
                >
                  <div className="ml-16 w-full rounded-3xl border border-orange-100 bg-[#fffaf5] p-6 shadow-[0_16px_40px_-28px_rgba(194,65,12,0.4)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-25px_rgba(194,65,12,0.5)] md:ml-0">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                        <Icon className="h-6 w-6" />
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">
                          {item.time}
                        </p>

                        <h3 className="mt-2 text-xl font-black text-slate-900">
                          {item.title}
                        </h3>

                        <p className="mt-3 leading-7 text-slate-600">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="absolute left-1 top-6 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-orange-600 text-sm font-black text-white shadow-lg md:left-auto md:right-[-20px]">
                    {index + 1}
                  </div>

                  {!isLeft && (
                    <div className="absolute top-6 hidden h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-orange-600 text-sm font-black text-white shadow-lg md:left-[-20px] md:flex">
                      {index + 1}
                    </div>
                  )}
                </motion.article>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}