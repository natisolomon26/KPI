import Image from "next/image";
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

              <div className="relative overflow-hidden rounded-[2rem] bg-white p-3 shadow-[0_35px_80px_-25px_rgba(194,65,12,0.4)]">
                <Image
                  src="/books/cover.jpg"
                  alt="EvaSUE History Book Cover"
                  width={380}
                  height={560}
                  className="h-auto w-[280px] rounded-[1.5rem] object-cover sm:w-[340px]"
                />
              </div>
            </div>
          </div>

          {/* Book information */}
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-600">
              About the Book
            </p>

            <h2 className="mt-4 text-4xl font-black leading-tight text-slate-900 sm:text-5xl">
              EvaSUE History Book
              <span className="block text-orange-600">
                1964–2014 G.C.
              </span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              The EvaSUE History Book is a testimony of God&apos;s faithfulness
              across generations. It preserves the story of students,
              graduates, leaders, and servants of Christ who helped shape the
              fellowship, strengthen the church, and impact the nation.
            </p>

            <p className="mt-4 leading-7 text-slate-600">
              More than a record of events, this book celebrates the prayers,
              sacrifices, service, and legacy that have carried EvaSUE for
              more than fifty years.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <InfoCard
                icon={<Target className="h-5 w-5" />}
                title="Why It Was Written"
                description="To preserve EvaSUE's history, honor God's faithfulness, and celebrate the people whose service helped shape the fellowship across generations."
              />

              <InfoCard
                icon={<Users className="h-5 w-5" />}
                title="Who It Is For"
                description="Students, graduates, ministry leaders, church members, and anyone connected to the story and legacy of EvaSUE."
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
                  A historical account of EvaSUE&apos;s journey from 1964 to
                  2014 G.C., celebrating the prayers, sacrifices, service, and
                  faithfulness that have shaped generations of students,
                  graduates, and servants of Christ.
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