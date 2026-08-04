"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  BookOpen,
  Heart,
  Rocket,
} from "lucide-react";

import Container from "./Container";

const visionItems = [
  {
    title: "Our Mission",
    description:
      "To publish Christ-centered resources that strengthen faith, develop leadership, and encourage transformational living.",
    icon: BookOpen,
  },
  {
    title: "Why We Started",
    description:
      "EvaSUE Publishing was created to provide accessible, biblically grounded books and educational resources for students, graduates, churches, and communities.",
    icon: Heart,
  },
  {
    title: "Future Vision",
    description:
      "To expand into books, devotionals, study guides, leadership resources, and digital learning materials that impact generations across Ethiopia and beyond.",
    icon: Rocket,
  },
];

export default function PublishingVision() {
  return (
    <section
      id="publishing-vision"
      className="relative overflow-hidden bg-[#fffaf5] py-20 sm:py-24 lg:py-28"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-32 top-16 h-80 w-80 rounded-full bg-orange-200/40 blur-3xl" />

      <div className="pointer-events-none absolute -right-32 bottom-16 h-96 w-96 rounded-full bg-amber-200/40 blur-3xl" />

      <Container className="relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-lg shadow-orange-200/40">
            <Image
              src="/logo/logo.svg"
              alt="EvaSUE Logo"
              width={72}
              height={72}
              className="object-contain"
            />
          </div>

          <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-600">
            EvaSUE Publishing
          </p>

          <h2 className="mt-4 text-4xl font-black leading-tight text-slate-900 sm:text-5xl">
            Sharing Truth.
            <span className="block text-orange-600">
              Inspiring Generations.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            EvaSUE Publishing exists to create Christ-centered resources that
            strengthen faith, encourage leadership, and inspire
            transformational living.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="mt-14 grid gap-6 md:grid-cols-3 lg:mt-16">
          {visionItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                }}
                className="group rounded-3xl border border-orange-100 bg-white p-7 shadow-[0_16px_40px_-28px_rgba(194,65,12,0.4)] transition-shadow duration-300 hover:shadow-[0_28px_60px_-30px_rgba(194,65,12,0.5)]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 transition-colors duration-300 group-hover:bg-orange-600 group-hover:text-white">
                  <Icon className="h-7 w-7" />
                </div>

                <h3 className="mt-6 text-2xl font-black text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  {item.description}
                </p>

                <div className="mt-6 h-1 w-14 rounded-full bg-orange-200 transition-all duration-300 group-hover:w-24 group-hover:bg-orange-500" />
              </motion.article>
            );
          })}
        </div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mx-auto mt-14 max-w-4xl rounded-3xl bg-orange-600 px-6 py-10 text-center shadow-xl shadow-orange-600/20 sm:px-10"
        >
          <p className="text-xl font-semibold leading-9 text-white sm:text-2xl">
            “Books have the power to preserve truth, inspire faith, and
            transform generations.”
          </p>
        </motion.div>
      </Container>
    </section>
  );
}