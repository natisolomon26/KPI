"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  GraduationCap,
  Lightbulb,
  Users,
} from "lucide-react";

import Container from "./Container";

const features = [
  {
    title: "Biblical Foundation",
    description:
      "The book reflects on God’s faithfulness across generations and preserves the spiritual legacy that has shaped EvaSUE for more than fifty years.",
    icon: BookOpen,
  },
  {
    title: "Student Focus",
    description:
      "It tells the story of students and graduates whose lives, service, and witness have helped shape the fellowship and strengthen the church.",
    icon: GraduationCap,
  },
  {
    title: "Leadership Development",
    description:
      "The book honors leaders and servants of Christ whose prayers, sacrifices, and service carried the ministry forward across generations.",
    icon: Users,
  },
  {
    title: "Living Legacy",
    description:
      "More than a record of events, this history encourages today’s generation to continue the legacy of faith, service, and impact.",
    icon: Lightbulb,
  },
];

export default function WhyBookMatters() {
  return (
    <section
      id="impact"
      className="relative overflow-hidden bg-[#fffdf8] py-20 sm:py-24 lg:py-28"
    >
      <div className="pointer-events-none absolute -left-32 top-12 h-80 w-80 rounded-full bg-orange-200/40 blur-3xl" />

      <div className="pointer-events-none absolute -right-32 bottom-12 h-96 w-96 rounded-full bg-amber-200/40 blur-3xl" />

      <Container className="relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-600">
            Why This Book Matters
          </p>

          <h2 className="mt-4 text-4xl font-black leading-tight text-slate-900 sm:text-5xl">
            More Than a Record,
            <span className="block text-orange-600">
              It Is Our History
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            The EvaSUE History Book preserves the story of God&apos;s
            faithfulness and celebrates the students, graduates, leaders,
            and servants whose lives have shaped the fellowship and impacted
            the nation.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:mt-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.article
                key={feature.title}
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.2,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                whileHover={{
                  y: -10,
                  scale: 1.02,
                }}
                className="group rounded-3xl border border-orange-100 bg-white p-7 shadow-[0_15px_40px_-25px_rgba(194,65,12,0.35)] transition-shadow duration-300 hover:shadow-[0_25px_55px_-25px_rgba(194,65,12,0.5)] sm:p-8"
              >
                <motion.div
                  whileHover={{
                    rotate: 6,
                    scale: 1.08,
                  }}
                  className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 transition-colors duration-300 group-hover:bg-orange-600 group-hover:text-white"
                >
                  <Icon className="h-7 w-7" />
                </motion.div>

                <h3 className="mt-6 text-2xl font-black text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-600">
                  {feature.description}
                </p>

                <div className="mt-6 h-1 w-14 rounded-full bg-orange-200 transition-all duration-300 group-hover:w-24 group-hover:bg-orange-500" />
              </motion.article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}