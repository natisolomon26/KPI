"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

import Container from "./Container";

const faqs = [
  {
    question: "Who can attend?",
    answer:
      "The launch ceremony is open to students, graduates, ministry leaders, partners, and anyone interested in learning more about EvaSUE's first publication.",
  },
  {
    question: "Is registration required?",
    answer:
      "Yes. Registration helps us prepare seating and event logistics. Additional registration details will be announced soon.",
  },
  {
    question: "Will books be available?",
    answer:
      "Yes. Copies of the book are expected to be available during the official launch. More information will be shared closer to the event.",
  },
  {
    question: "Is the event free?",
    answer:
      "The current plan is for the event to be free to attend. Final event details will be confirmed with the official announcement.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="bg-white py-20 sm:py-24 lg:py-28"
    >
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-600">
            Frequently Asked Questions
          </p>

          <h2 className="mt-4 text-4xl font-black text-slate-900 sm:text-5xl">
            Have Questions?
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Here are some of the most common questions about the book launch and
            upcoming publication.
          </p>
        </motion.div>

        <div className="mx-auto mt-14 max-w-4xl space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={faq.question}
              className="overflow-hidden rounded-2xl border border-orange-100 bg-[#fffaf5] shadow-sm"
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="flex w-full items-center justify-between px-6 py-5 text-left transition hover:bg-orange-50"
              >
                <span className="text-lg font-bold text-slate-900">
                  {faq.question}
                </span>

                <ChevronDown
                  className={`h-5 w-5 text-orange-600 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="border-t border-orange-100 px-6 py-5 text-slate-600 leading-7">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}