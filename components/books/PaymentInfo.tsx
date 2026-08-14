"use client";

import { Building2, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

import Container from "./Container";

const bankDetails = [
  {
    bank: "Bank 1",
    accountName: "Account name will be added",
    accountNumber: "Account number will be added",
  },
  {
    bank: "Bank 2",
    accountName: "Account name will be added",
    accountNumber: "Account number will be added",
  },
];

export default function PaymentInfo() {
  return (
    <section
      id="payment"
      className="relative overflow-hidden bg-[#fff9f4] py-20 sm:py-24"
    >
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-center"
        >
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-600">
            Book Launch
          </p>

          <h2 className="mt-4 text-4xl font-black text-slate-900 sm:text-5xl">
            Entry Fee & Payment
          </h2>

          <p className="mt-4 text-lg text-slate-600">
            Entry fee and payment details for the EvaSUE History Book launch
            ceremony.
          </p>

          {/* Entry Fee */}
          <div className="mx-auto mt-8 max-w-md rounded-3xl bg-gradient-to-br from-orange-600 to-amber-500 p-8 text-white shadow-[0_25px_60px_-25px_rgba(194,65,12,0.5)]">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-100">
              Entry Fee
            </p>

            <p className="mt-3 text-4xl font-black">
              Amount to be announced
            </p>

            <p className="mt-2 text-sm text-orange-100">
              ETB
            </p>
          </div>

          {/* Bank Accounts */}
          <div className="mt-10 grid gap-6 text-left sm:grid-cols-2">
            {bankDetails.map((bank, index) => (
              <motion.div
                key={bank.bank}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                className="rounded-3xl border border-orange-100 bg-white p-6 shadow-[0_15px_40px_-25px_rgba(194,65,12,0.35)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                  <Building2 className="h-6 w-6" />
                </div>

                <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-orange-600">
                  Bank
                </p>

                <h3 className="mt-2 text-xl font-black text-slate-900">
                  {bank.bank}
                </h3>

                <div className="mt-5 space-y-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Account Name
                    </p>
                    <p className="mt-1 font-bold text-slate-800">
                      {bank.accountName}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Account Number
                    </p>

                    <div className="mt-1 flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-orange-500" />

                      <p className="font-bold text-slate-800">
                        {bank.accountNumber}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}