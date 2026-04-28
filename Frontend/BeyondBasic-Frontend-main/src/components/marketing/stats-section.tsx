import { Users, Building2, CalendarCheck, Trophy } from "lucide-react";

const stats = [
  {
    icon: Building2,
    value: "1 College",
    label: "Exclusively yours",
    sub: "Built for your campus only",
    color: "text-primary",
    bg: "bg-primary/8",
  },
  {
    icon: CalendarCheck,
    value: "30 Days",
    label: "Offline bootcamp",
    sub: "Coding · DSA · Tech Skills",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    icon: Trophy,
    value: "7 Features",
    label: "On the platform",
    sub: "AI-powered, end-to-end",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    icon: Users,
    value: "6+ Years",
    label: "Alumni instructors",
    sub: "From top product companies",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
];

export default function StatsSection() {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 bg-slate-50">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
        {stats.map(({ icon: Icon, value, label, sub, color, bg }) => (
          <div key={label} className="flex flex-col items-center text-center group">
            <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <Icon size={22} className={color} />
            </div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 mb-0.5">{value}</span>
            <span className="text-sm font-bold text-slate-700 mb-0.5">{label}</span>
            <span className="text-xs font-medium text-slate-400 hidden sm:block">{sub}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
