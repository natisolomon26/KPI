import {
  BookOpen,
  Heart,
  Mail,
  Users,
} from "lucide-react";

import Container from "./Container";

export default function AboutAuthor() {
  return (
    <section
      id="author"
      className="bg-[#fff7ed] py-20 sm:py-24 lg:py-28"
    >
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Author photo placeholder */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative">
              <div className="absolute -inset-10 rounded-full bg-orange-200/60 blur-3xl" />

              <div className="relative flex h-[380px] w-[300px] items-center justify-center overflow-hidden rounded-[2rem] border border-orange-100 bg-gradient-to-br from-orange-100 via-white to-amber-100 shadow-xl sm:h-[440px] sm:w-[350px]">
                <div className="text-center">
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-orange-200 text-orange-700">
                    <Users className="h-12 w-12" />
                  </div>

                  <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-orange-700">
                    Author Photo
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    Coming soon
                  </p>
                </div>
              </div>
            </div>
          </div>

        {/* Author information */}
<div>
  <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-600">
    Meet the Author
  </p>

  <h2 className="mt-4 text-4xl font-black leading-tight text-slate-900 sm:text-5xl">
    The Story Behind the
    <span className="block text-orange-600">
      EvaSUE History Book
    </span>
  </h2>

  <p className="mt-6 text-lg leading-8 text-slate-600">
    The EvaSUE History Book preserves the story of God&apos;s faithfulness
    through generations of students, graduates, leaders, and servants of
    Christ who have shaped the fellowship and impacted the church and nation.
  </p>

  <p className="mt-4 leading-7 text-slate-600">
    Official author and contributor information will be added here once the
    final publication details are confirmed.
  </p>

  {/* Ministry experience */}
  <div className="mt-8 grid gap-4 sm:grid-cols-3">
    <ExperienceCard
      icon={<Heart className="h-5 w-5" />}
      title="Faith"
      description="Celebrating generations shaped by prayer, service, and faithfulness to Christ."
    />

    <ExperienceCard
      icon={<BookOpen className="h-5 w-5" />}
      title="History"
      description="Preserving the story and legacy of EvaSUE from 1964 to 2014 G.C."
    />

    <ExperienceCard
      icon={<Users className="h-5 w-5" />}
      title="Community"
      description="Honoring students, graduates, leaders, and servants who carried the fellowship forward."
    />
  </div>

  {/* Contact */}
  <div className="mt-8 flex flex-wrap items-center gap-3">
    <span className="mr-2 text-sm font-semibold text-slate-700">
      Contact EvaSUE:
    </span>

    <SocialLink
      href="mailto:info@evasue.net"
      label="Email"
      icon={<Mail className="h-5 w-5" />}
    />
  </div>
</div>
        </div>
      </Container>
    </section>
  );
}

function ExperienceCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
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

function SocialLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-orange-200 bg-white text-orange-600 transition hover:-translate-y-1 hover:bg-orange-600 hover:text-white"
    >
      {icon}
    </a>
  );
}