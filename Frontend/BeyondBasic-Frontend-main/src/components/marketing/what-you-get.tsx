import { Monitor, MapPin, ArrowRight } from "lucide-react";

const ONLINE_FEATURES = [
  { emoji: "💻", title: "Coding Practice", desc: "Company-wise and topic-wise questions. Practice exactly what your target company asks." },
  { emoji: "🗺️", title: "AI Roadmaps", desc: "Personalized study plans per company — TCS, Infosys, Amazon, and more. AI-built for your timeline." },
  { emoji: "📄", title: "AI Resume Review", desc: "Get instant ATS feedback and suggestions. Know exactly what recruiters will see." },
  { emoji: "📊", title: "Mock Assessments", desc: "Timed tests that mirror actual placement drives. Track your score and improve each round." },
  { emoji: "📚", title: "Reference Materials", desc: "Curated notes for DSA, DBMS, OS, CN, OOPs — all the CS fundamentals in one place." },
  { emoji: "💬", title: "Discuss Section", desc: "Share and read on-campus interview experiences from your own college. Know what to expect." },
];

const OFFLINE_WEEKS = [
  { week: "Week 1", title: "Foundations", topics: "Programming basics · Problem solving · Time & Space complexity" },
  { week: "Week 2", title: "Data Structures & Algorithms", topics: "Arrays · LinkedList · Trees · Graphs · DP patterns" },
  { week: "Week 3", title: "Tech Skill Track", topics: "Full Stack · GenAI · Data Engineering (choose your track)" },
  { week: "Week 4", title: "Placement Bootcamp", topics: "Mock drives · HR prep · Resume workshop · Offer negotiation" },
];

export default function WhatYouGet() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-white">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3">
            Everything you need. Nothing you don&apos;t.
          </h2>
          <p className="text-base sm:text-lg text-slate-500 font-medium max-w-xl mx-auto">
            Two products, one goal — get you placed.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">

          {/* Online Platform */}
          <div className="rounded-3xl overflow-hidden shadow-sm">
            <div className="bg-primary px-6 py-5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                <Monitor size={18} className="text-white" />
              </div>
              <div>
                <div className="text-white font-black text-lg">Online Platform</div>
                <div className="text-primary-foreground/70 text-xs font-semibold">Always accessible · 24/7</div>
              </div>
            </div>
            <div className="divide-y">
              {ONLINE_FEATURES.map(({ emoji, title, desc }) => (
                <div key={title} className="px-6 py-4 flex gap-4 hover:bg-slate-50 transition-colors group">
                  <span className="text-xl mt-0.5 flex-shrink-0">{emoji}</span>
                  <div>
                    <div className="font-bold text-sm text-slate-900 mb-0.5 group-hover:text-primary transition-colors">{title}</div>
                    <div className="text-xs text-slate-500 font-medium leading-relaxed">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Offline Bootcamp */}
          <div className="rounded-3xl overflow-hidden shadow-sm flex flex-col">
            <div className="bg-slate-900 px-6 py-5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                <MapPin size={18} className="text-white" />
              </div>
              <div>
                <div className="text-white font-black text-lg">30-Day Offline Bootcamp</div>
                <div className="text-slate-400 text-xs font-semibold">In your college · Limited seats</div>
              </div>
            </div>

            <div className="flex-1 p-6 flex flex-col gap-4">
              {OFFLINE_WEEKS.map(({ week, title, topics }, i) => (
                <div key={week} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary text-xs font-black flex-shrink-0">
                      {i + 1}
                    </div>
                    {i < 3 && <div className="w-0.5 h-full bg-primary/10 mt-1" />}
                  </div>
                  <div className="pb-4">
                    <div className="text-[10px] font-black uppercase tracking-widest text-primary mb-0.5">{week}</div>
                    <div className="font-black text-sm text-slate-900 mb-1">{title}</div>
                    <div className="text-xs text-slate-500 font-medium leading-relaxed">{topics}</div>
                  </div>
                </div>
              ))}

              {/* Tracks */}
              <div className="mt-2 p-4 bg-slate-50 rounded-2xl">
                <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Choose your Tech Track</div>
                <div className="flex flex-wrap gap-2">
                  {["Full Stack Dev", "GenAI Engineering", "Data Engineering"].map((t) => (
                    <span key={t} className="text-xs font-bold bg-primary/8 text-primary border border-primary/15 rounded-full px-3 py-1">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <button className="mt-auto w-full h-11 rounded-xl bg-slate-900 text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-800 hover:-translate-y-px transition-all group">
                Reserve your seat
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
