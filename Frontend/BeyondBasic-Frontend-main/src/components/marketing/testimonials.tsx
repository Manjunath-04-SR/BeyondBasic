import { Star, Quote, Building2 } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Sneha Patel",
    branch: "CSE, Final Year",
    placed: "TCS Digital",
    package: "₹7 LPA",
    avatar: "SP",
    color: "bg-blue-500",
    text: "The company-wise question bank was a game changer. I knew the exact pattern of TCS NQT before I walked in. Cleared in the first attempt.",
  },
  {
    name: "Arjun Nair",
    branch: "IT, Final Year",
    placed: "Infosys",
    package: "₹6.5 LPA",
    avatar: "AN",
    color: "bg-violet-500",
    text: "The mock drives felt exactly like the real thing. By the time the actual placement happened, I wasn't nervous — I had already done it 4 times.",
  },
  {
    name: "Priya Sharma",
    branch: "ECE, Final Year",
    placed: "Wipro",
    package: "₹5.5 LPA",
    avatar: "PS",
    color: "bg-emerald-500",
    text: "Coming from ECE I had zero DSA background. The 30-day offline bootcamp took me from basics to placed. The alumni instructors genuinely cared.",
  },
  {
    name: "Karthik Menon",
    branch: "CSE, Final Year",
    placed: "Cognizant",
    package: "₹6 LPA",
    avatar: "KM",
    color: "bg-amber-500",
    text: "The Discuss section alone is worth it. Reading actual interview experiences from my own college seniors made me realise exactly where to focus.",
  },
  {
    name: "Divya Reddy",
    branch: "MCA, Final Year",
    placed: "Accenture",
    package: "₹5.5 LPA",
    avatar: "DR",
    color: "bg-rose-500",
    text: "AI resume review flagged things my own professors missed. Got interview calls where I previously wasn't even getting shortlisted.",
  },
  {
    name: "Rohan Joshi",
    branch: "IT, Final Year",
    placed: "Amazon SDE",
    package: "₹18 LPA",
    avatar: "RJ",
    color: "bg-cyan-500",
    text: "I used the AI roadmap for product companies and it was laser focused — no fluff, just exactly what Amazon interviews test. Best investment I made.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3">
            Real students. Real offers.
          </h2>
          <p className="text-base sm:text-lg text-slate-500 font-medium">
            From the same classrooms, the same placement drives — and now, the same companies.
          </p>
          <div className="flex items-center justify-center gap-1.5 mt-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={15} className="fill-amber-400 text-amber-400" />
            ))}
            <span className="ml-2 text-sm font-bold text-slate-600">From student feedback collected during beta</span>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg hover:shadow-slate-200/60 hover:-translate-y-0.5 transition-all duration-300 group"
            >
              <Quote size={24} className="text-slate-100 mb-3 group-hover:text-primary/15 transition-colors" />

              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-sm text-slate-600 font-medium leading-relaxed mb-5">{t.text}</p>

              {/* Placed badge */}
              <div className="flex items-center gap-2 mb-5">
                <Building2 size={13} className="text-emerald-500 flex-shrink-0" />
                <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-0.5">
                  Placed at {t.placed} · {t.package}
                </span>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4">
                <div className={`w-9 h-9 rounded-full ${t.color} flex items-center justify-center text-white text-[10px] font-black flex-shrink-0`}>
                  {t.avatar}
                </div>
                <div>
                  <div className="font-black text-sm text-slate-900">{t.name}</div>
                  <div className="text-xs text-slate-400 font-semibold">{t.branch}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
