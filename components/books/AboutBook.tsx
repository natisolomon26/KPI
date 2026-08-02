import { BookOpen, Target, Users } from "lucide-react";

import Container from "./Container";

export default function AboutBook() {
  return (
    <section
      id="book"
      className="bg-white py-20 sm:py-24 lg:py-28"
    >
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Book cover */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative">
              <div className="absolute -inset-8 rounded-full bg-orange-200/50 blur-3xl" />

              <div className="relative aspect-[3/4] w-[280px] overflow-hidden rounded-r-[2rem] rounded-l-lg bg-gradient-to-br from-orange-500 via-orange-400 to-amber-300 p-8 shadow-[0_35px_80px_-25px_rgba(194,65,12,0.4)] sm:w-[340px]">
                <div className="absolute bottom-0 left-0 top-0 w-5 bg-orange-900/20" />

                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border-[36px] border-white/15" />

                <div className="relative z-10 flex h-full flex-col justify-between pl-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-950/70">
                      EvaSUE Publishing
                    </p>

                    <h3 className="mt-8 text-4xl font-black leading-tight text-white sm:text-5xl">
                      Book
                      <span className="block">Title</span>
                    </h3>

                    <p className="mt-4 text-sm leading-6 text-orange-50">
                      Official title and cover artwork coming soon.
                    </p>
                  </div>

                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-white">
                    Coming Soon
                  </p>
                </div>
              </div>

              <div className="absolute bottom-3 right-[-7px] top-3 -z-10 w-4 rounded-r-xl bg-[#f7ead7] shadow-lg" />
            </div>
          </div>

          {/* Book information */}
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-600">
              About the Book
            </p>

            <h2 className="mt-4 text-4xl font-black leading-tight text-slate-900 sm:text-5xl">
              A Book Created to Inspire Faith and Purpose
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              This upcoming EvaSUE publication is being developed to encourage
              spiritual growth, strengthen Christian character, and equip
              readers to live with purpose.
            </p>

            <p className="mt-4 leading-7 text-slate-600">
              The official summary, title, author details, and publication
              information will be added when the final book content becomes
              available.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <InfoCard
                icon={<Target className="h-5 w-5" />}
                title="Why It Was Written"
                description="To provide practical and faith-based encouragement for students, graduates, and emerging leaders."
              />

              <InfoCard
                icon={<Users className="h-5 w-5" />}
                title="Intended Audience"
                description="Students, graduates, ministry leaders, and anyone seeking spiritual and personal growth."
              />
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-2xl bg-orange-50 p-5">
              <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                <BookOpen className="h-5 w-5" />
              </div>

              <div>
                <h3 className="font-bold text-slate-900">
                  Book Summary
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-600">
                  A concise summary will be added here after the book manuscript
                  and official publication information are finalized.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function InfoCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-orange-100 bg-[#fffaf5] p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600">
        {icon}
      </div>

      <h3 className="mt-4 font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        {description}
      </p>
    </div>
  );
}