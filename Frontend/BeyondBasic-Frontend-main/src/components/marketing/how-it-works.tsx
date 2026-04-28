import { ClipboardList, Map, Code2, BadgeCheck } from "lucide-react";

const STEPS = [
  {
    icon: ClipboardList,
    step: "01",
    title: "Take a free skill test",
    desc: "A quick 20-min assessment to identify where you stand in DSA, aptitude, and core CS subjects.",
    color: "text-primary",
    bg: "bg-primary/8",
    border: "border-primary/15",
  },
  {
    icon: Map,
    step: "02",
    title: "Get your AI roadmap",
    desc: "Pick your target companies. AI generates a day-by-day study plan tailored to your gap and placement date.",
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-100",
  },
  {
    icon: Code2,
    step: "03",
    title: "Practice & get assessed",
    desc: "Solve company-wise questions, attend mock placement drives, and track your improvement in real time.",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
  },
  {
    icon: BadgeCheck,
    step: "04",
    title: "Walk in confident",
    desc: "AI-reviewed resume, mock interview experience, and a complete prep record — you'll know you're ready.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3">
            From zero to placed — here&apos;s how
          </h2>
          <p className="text-base sm:text-lg text-slate-500 font-medium max-w-xl mx-auto">
            A clear path so you&apos;re never wondering what to do next.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map(({ icon: Icon, step, title, desc, color, bg, border }, i) => (
            <div key={step} className="relative">
              {/* connector line */}
              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-6 left-[calc(100%-0px)] w-full h-px bg-slate-200 z-0" style={{ width: "calc(100% - 3rem)", left: "calc(3rem + 8px)" }} />
              )}
              <div className={`relative z-10 bg-white rounded-2xl ${border} p-6 hover:shadow-lg hover:shadow-slate-200/60 hover:-translate-y-0.5 transition-all duration-300 h-full`}>
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center`}>
                    <Icon size={20} className={color} />
                  </div>
                  <span className="text-3xl font-black text-slate-100">{step}</span>
                </div>
                <h3 className="font-black text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
