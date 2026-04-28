import { Link, Building } from "lucide-react";

const INSTRUCTORS = [
  {
    initials: "RK",
    name: "Rahul Kumar",
    role: "Senior SDE · Amazon",
    exp: "7 years",
    color: "bg-blue-500",
    alumni: true,
    skills: ["DSA", "System Design", "Java"],
    quote: "I sat in the same placement drives you're preparing for. I know exactly what gaps to fix and how fast.",
  },
  {
    initials: "AS",
    name: "Ananya Singh",
    role: "Full Stack Engineer · Microsoft",
    exp: "6 years",
    color: "bg-violet-500",
    alumni: true,
    skills: ["Full Stack", "React", "Node.js"],
    quote: "Most students know the theory but fail in implementation. We fix that with real projects in 30 days.",
  },
  {
    initials: "PM",
    name: "Pratik Mehta",
    role: "ML Engineer · Google",
    exp: "8 years",
    color: "bg-emerald-500",
    alumni: true,
    skills: ["GenAI", "Python", "Data Eng."],
    quote: "The tech landscape shifted to AI. We make sure your batch is the first wave ready for it.",
  },
];

export default function Instructors() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-slate-50">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 bg-primary/8 border border-primary/15 text-primary rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-5">
            <Building size={12} />
            Your college&apos;s own alumni
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3">
            Taught by people who sat<br className="hidden sm:block" /> where you sit now
          </h2>
          <p className="text-base sm:text-lg text-slate-500 font-medium max-w-xl mx-auto">
            Not random instructors — your seniors who cleared the same placements,
            now working at top product companies with 6+ years of experience.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {INSTRUCTORS.map((inst) => (
            <div
              key={inst.name}
              className="bg-white rounded-2xl p-6 hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-0.5 transition-all duration-300"
            >
              {/* Avatar + alumni tag */}
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 rounded-2xl ${inst.color} flex items-center justify-center text-white text-base font-black shadow-sm`}>
                  {inst.initials}
                </div>
                {inst.alumni && (
                  <span className="text-[10px] font-black bg-primary/8 text-primary border border-primary/15 rounded-full px-2.5 py-1 uppercase tracking-widest">
                    Alumni
                  </span>
                )}
              </div>

              <div className="font-black text-slate-900 mb-0.5">{inst.name}</div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-1">
                <Link size={11} className="text-primary" />
                {inst.role}
              </div>
              <div className="text-xs font-bold text-slate-400 mb-4">{inst.exp} experience</div>

              {/* Skills */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {inst.skills.map((s) => (
                  <span key={s} className="text-[10px] font-bold bg-slate-100 text-slate-600 rounded-full px-2.5 py-1">
                    {s}
                  </span>
                ))}
              </div>

              {/* Quote */}
              <div className="pt-4">
                <p className="text-xs text-slate-500 font-medium leading-relaxed italic">
                  &ldquo;{inst.quote}&rdquo;
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
