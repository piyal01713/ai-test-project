import Image from "next/image";
import ChatWidget from "@/components/ChatWidget";

const profileHighlights = [
  "Client-facing business analyst with Swiss and Southeast Asian experience.",
  "Strong technical foundation in web development, PHP, MySQL, Drupal, and SaaS products.",
  "Comfortable bridging product, development, and stakeholder teams using Agile workflows.",
  "Driven by psychology-informed communication, customer insight, and strategic delivery.",
];

const timeline = [
  {
    title: "Business Analyst",
    company: "SELISE Digital Platforms",
    location: "Dhaka / Switzerland",
    date: "Dec 2023 - Present",
    bullets: [
      "Lead client engagement and delivery for Swiss digital products.",
      "Coordinate development teams, product management, and Agile planning.",
      "Translate business needs into technical requirements and release roadmaps.",
    ],
  },
  {
    title: "In-house Programmer",
    company: "UCSI University Bangladesh Campus",
    location: "Dhaka, Bangladesh",
    date: "Oct 2022 - Nov 2023",
    bullets: [
      "Maintained Drupal-based university web systems and cross-border stakeholder requests.",
      "Delivered stable CMS workflows while aligning local operations with Malaysia campus standards.",
    ],
  },
  {
    title: "Market Researcher & Facebook Marketer",
    company: "Dynamic Agro Tech Company",
    location: "Bangladesh",
    date: "Apr 2020 - Jun 2022",
    bullets: [
      "Built online acquisition campaigns and digital sales funnels for spice export.",
      "Launched targeted Facebook promotions for avocado oil and customer outreach.",
    ],
  },
  {
    title: "In-house Programmer",
    company: "Pocket Pixel Sdn. Bhd",
    location: "Kuala Lumpur, Malaysia",
    date: "Feb 2016 - May 2016",
    bullets: [
      "Developed PHP web app features and designed user-facing interface concepts.",
      "Managed CMS-based client websites and delivered production-ready updates.",
    ],
  },
];

const skills = [
  "JIRA & Confluence",
  "Facebook Advertising",
  "HTML, CSS, JavaScript",
  "PHP & MySQL",
  "Drupal CMS",
  "Microsoft Office & G Suite",
  "SAP Software",
];

export default function Home() {
  return (
    <main className="relative isolate overflow-hidden px-6 py-8 lg:px-8">
      <div className="absolute inset-x-0 top-0 -z-10 h-[32rem] bg-gradient-to-b from-slate-900/80 via-[#13151f] to-[#07080d] blur-3xl" />
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-5 border-b border-slate-800 pb-8 text-slate-200 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">
              Portfolio — enterprise meets edgy
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Nazmul Hasan
            </h1>
            <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-300">
              Business Analyst and digital strategist with a technical background in software delivery, client engagement, and product-driven transformation.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-800/80 bg-slate-950/70 p-6 shadow-[0_0_60px_rgba(15,23,42,0.35)] sm:w-[320px]">
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-300/90">Contact</p>
            <div className="mt-5 space-y-3 text-sm text-slate-300">
              <p>
                <span className="font-semibold text-slate-100">Email:</span> piyal01713@gmail.com
              </p>
              <p>
                <span className="font-semibold text-slate-100">Phone:</span> +8801713103700
              </p>
              <p>
                <span className="font-semibold text-slate-100">Location:</span> Dhanmondi, Dhaka
              </p>
            </div>
          </div>
        </header>

        <section className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-10">
            <div className="rounded-[2rem] border border-slate-800/75 bg-slate-950/80 p-10 shadow-[0_16px_80px_rgba(15,23,42,0.45)]">
              <div className="flex items-center justify-between gap-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.32em] text-cyan-300/90">About Me</p>
                  <h2 className="mt-4 text-3xl font-semibold text-white">Strategic analyst with a digital edge</h2>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-300/15">
                  <span className="text-xl font-semibold">01</span>
                </div>
              </div>
              <p className="mt-8 text-base leading-8 text-slate-300">
                I combine a technical foundation in software and web systems with strong client-facing leadership. My journey spans web development, market research, and enterprise product delivery, with a focus on translating complex business needs into measurable outcomes.
              </p>
              <p className="mt-5 text-base leading-8 text-slate-300">
                Strengths include Agile product collaboration, stakeholder engagement across borders, and building resilient processes that scale from digital marketing to university systems and Swiss enterprise tooling.
              </p>
            </div>

            <div className="rounded-[2rem] border border-slate-800/75 bg-slate-950/80 p-10 shadow-[0_16px_80px_rgba(15,23,42,0.45)]">
              <div className="flex items-center justify-between gap-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.32em] text-cyan-300/90">Career Journey</p>
                  <h2 className="mt-4 text-3xl font-semibold text-white">Experience highlights</h2>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-300/15">
                  <span className="text-xl font-semibold">02</span>
                </div>
              </div>

              <div className="mt-10 space-y-8">
                {timeline.map((item, index) => (
                  <article key={`${item.title}-${item.date}-${index}`} className="rounded-3xl border border-slate-800/70 bg-slate-900/80 p-8">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-lg font-semibold text-white">{item.title}</p>
                        <p className="text-sm text-slate-400">
                          {item.company} • {item.location}
                        </p>
                      </div>
                      <p className="rounded-full bg-slate-800/90 px-4 py-2 text-xs uppercase tracking-[0.28em] text-slate-400">
                        {item.date}
                      </p>
                    </div>
                    <ul className="mt-6 space-y-3 text-slate-300">
                      {item.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-3 text-sm leading-7">
                          <span className="mt-1 h-2 w-2 rounded-full bg-cyan-300" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-8">
            <div className="rounded-[2rem] border border-slate-800/75 bg-slate-950/80 p-10 shadow-[0_16px_80px_rgba(15,23,42,0.45)]">
              <div className="flex items-center justify-between gap-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.32em] text-cyan-300/90">Core Strengths</p>
                  <h2 className="mt-4 text-3xl font-semibold text-white">What I bring</h2>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-300/15">
                  <span className="text-xl font-semibold">03</span>
                </div>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-3xl border border-slate-800/70 bg-slate-900/80 px-4 py-3 text-sm text-slate-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-800/75 bg-slate-950/80 p-10 shadow-[0_16px_80px_rgba(15,23,42,0.45)]">
              <div className="flex items-center justify-between gap-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.32em] text-cyan-300/90">Education</p>
                  <h2 className="mt-4 text-3xl font-semibold text-white">Academic foundation</h2>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-300/15">
                  <span className="text-xl font-semibold">04</span>
                </div>
              </div>
              <div className="mt-8 space-y-5 text-slate-300">
                <div>
                  <p className="font-semibold text-white">Masters in Software Engineering and System Architecture</p>
                  <p className="text-sm text-slate-400">Multimedia University, Cyberjaya, Malaysia • 2016 - 2019</p>
                </div>
                <div>
                  <p className="font-semibold text-white">Bachelor of Computer Science (Software Engineering)</p>
                  <p className="text-sm text-slate-400">Multimedia University, Cyberjaya, Malaysia • 2011 - 2016</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-800/75 bg-slate-950/80 p-10 shadow-[0_16px_80px_rgba(15,23,42,0.45)]">
              <div className="flex items-center justify-between gap-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.32em] text-cyan-300/90">Why Me</p>
                  <h2 className="mt-4 text-3xl font-semibold text-white">Differentiators</h2>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-300/15">
                  <span className="text-xl font-semibold">05</span>
                </div>
              </div>
              <p className="mt-8 text-sm leading-7 text-slate-300">
                I bring rare versatility across technical delivery, cross-cultural client communication, and marketing-led growth. My strengths combine systems thinking, people-first service, and a polished delivery mindset.
              </p>
            </div>

            <ChatWidget />
          </aside>
        </section>
      </div>
    </main>
  );
}
