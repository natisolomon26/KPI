"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
} from "lucide-react";

import Container from "./Container";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#fff9f4]">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-orange-200/50 blur-3xl" />

        <div className="absolute -right-24 bottom-10 h-96 w-96 rounded-full bg-amber-200/50 blur-3xl" />

        <div className="absolute left-[10%] top-[18%] h-3 w-3 rounded-full bg-orange-300/70" />

        <div className="absolute right-[15%] top-[20%] h-4 w-4 rounded-full bg-amber-300/60" />

        <div className="absolute bottom-[15%] left-[40%] h-2 w-2 rounded-full bg-orange-400/60" />
      </div>

      <Container className="relative z-10 grid min-h-[calc(100vh-81px)] items-center gap-14 py-20 lg:grid-cols-2 lg:py-24">
        {/* LEFT CONTENT */}
        <motion.div
          initial={{
            opacity: 0,
            y: 35,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
          }}
        >
          {/* Badge */}
          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
            }}
            className="inline-flex items-center rounded-full border border-orange-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-orange-600 shadow-sm"
          >
            New Release
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.1,
            }}
            className="mt-6 max-w-2xl text-5xl font-black leading-[1.05] tracking-tight text-slate-900 sm:text-6xl lg:text-7xl"
          >
            Discover EvaSUE&apos;s

            <span className="block text-orange-600">
              EvaSUE History Book
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.2,
            }}
            className="mt-6 max-w-xl text-lg leading-8 text-slate-600"
          >
            A testimony of God&apos;s faithfulness across generations. Discover the
  story of students, graduates, and servants of Christ who have shaped
  the church and impacted our nation.
          </motion.p>

          {/* Launch information */}
          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.3,
            }}
            className="mt-8 max-w-xl rounded-2xl border border-orange-100 bg-white p-5 shadow-sm"
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600">
              Official Launch
            </p>

            <div className="mt-4 flex flex-col gap-4 text-sm text-slate-700 sm:flex-row sm:items-center sm:gap-8">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-orange-500" />

                <span className="font-semibold">
                  August 15, 2026
                </span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-orange-500" />

                <span className="font-semibold">
                  International Evangelical Church
                </span>
              </div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.4,
            }}
            className="mt-8 flex flex-col gap-4 sm:flex-row"
          >
            <a
              href="#book"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-orange-600 px-7 py-3.5 font-bold text-white shadow-lg shadow-orange-600/20 transition hover:-translate-y-1 hover:bg-orange-700"
            >
              Discover the Book

              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>

            
          </motion.div>
        </motion.div>

        {/* RIGHT SIDE - REAL BOOK COVER */}
        <motion.div
          initial={{
            opacity: 0,
            x: 70,
            rotate: 4,
          }}
          animate={{
            opacity: 1,
            x: 0,
            rotate: 0,
          }}
          transition={{
            duration: 0.9,
            delay: 0.2,
            type: "spring",
            stiffness: 80,
          }}
          className="flex justify-center lg:justify-end"
        >
          <div className="relative">
            {/* Glow */}
            <div className="absolute -inset-10 rounded-full bg-orange-300/30 blur-3xl" />

            {/* Book */}
            <motion.div
              whileHover={{
                y: -10,
                rotate: -2,
              }}
              transition={{
                duration: 0.25,
              }}
              className="relative overflow-hidden rounded-[2rem] bg-white p-3 shadow-[0_35px_90px_-25px_rgba(194,65,12,0.45)]"
            >
              <Image
                src="/books/cover.jpg"
                alt="EvaSUE Book Cover"
                width={380}
                height={560}
                priority
                className="h-auto w-[280px] rounded-[1.5rem] object-cover sm:w-[340px]"
              />
            </motion.div>

            {/* Floating badge */}
            <div className="absolute -bottom-5 -right-5 rounded-2xl bg-white px-5 py-3 shadow-xl">
              <p className="text-xs font-bold uppercase tracking-widest text-orange-600">
                EvaSUE Publishing
              </p>

              <p className="mt-1 text-lg font-black text-slate-900">
                First Edition
              </p>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}