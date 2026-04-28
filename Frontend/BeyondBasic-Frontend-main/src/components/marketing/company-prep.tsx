import { useState, useEffect } from "react";
import { CheckCircle2, FileQuestion, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { companyApi } from "@/lib/api";

interface Company {
  _id: string;
  name: string;
  slug: string;
  type: string;
  color: string;
  badge: string;
  badgeColor: string;
  rounds: { name: string }[];
  hiringDetails?: { ctc: string };
}

// Static fallback shown while loading or if API is down
const STATIC_COMPANIES = [
  { name: "CTS", slug: "cts", type: "Service", color: "bg-sky-600", rounds: [{ name: "Aptitude" }, { name: "Coding (GenC)" }, { name: "TR Interview" }, { name: "HR Interview" }], badge: "GenC Program", badgeColor: "bg-sky-50 text-sky-700 border-sky-100" },
  { name: "TCS", slug: "tcs", type: "Service", color: "bg-blue-600", rounds: [{ name: "Aptitude (NQT)" }, { name: "Coding (2 Qs)" }, { name: "TR Interview" }, { name: "HR Interview" }], badge: "Highest Hiring", badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  { name: "Infosys", slug: "infosys", type: "Service", color: "bg-indigo-600", rounds: [{ name: "Aptitude (InfyTQ)" }, { name: "Coding Test" }, { name: "TR Interview" }, { name: "HR Interview" }], badge: "Mass Recruiter", badgeColor: "bg-blue-50 text-blue-700 border-blue-100" },
  { name: "Wipro", slug: "wipro", type: "Service", color: "bg-violet-600", rounds: [{ name: "NLTH Aptitude" }, { name: "Essay Writing" }, { name: "TR Interview" }, { name: "HR Interview" }], badge: "Campus Favourite", badgeColor: "bg-violet-50 text-violet-700 border-violet-100" },
  { name: "Amazon", slug: "amazon", type: "Product", color: "bg-amber-500", rounds: [{ name: "OA (DSA)" }, { name: "2x Coding Rounds" }, { name: "Bar Raiser" }, { name: "LP Interview" }], badge: "Dream Company", badgeColor: "bg-amber-50 text-amber-700 border-amber-100" },
  { name: "Microsoft", slug: "microsoft", type: "Product", color: "bg-emerald-600", rounds: [{ name: "OA (DSA)" }, { name: "3x Tech Rounds" }, { name: "System Design" }, { name: "HR Round" }], badge: "Top Package", badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-100" },
];

export default function CompanyPrep() {
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    companyApi.getAll()
      .then((data) => { if (data?.length) setCompanies(data); })
      .catch(() => { /* use static fallback */ });
  }, []);

  const displayCompanies = companies.length > 0 ? companies : STATIC_COMPANIES;

  return (
    <section id="company-prep" className="py-16 sm:py-24 px-4 sm:px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3">
            We know exactly what they ask
          </h2>
          <p className="text-base sm:text-lg text-slate-500 font-medium max-w-xl mx-auto">
            Company-specific preparation so you walk in knowing the pattern, not just the subject.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayCompanies.slice(0, 6).map((co) => (
            <Link
              to={`/company-prep/${co.slug}`}
              key={co.name}
              className="group rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <div className={`${co.color} px-5 py-4 flex items-center justify-between`}>
                <div>
                  <div className="text-white font-black text-xl">{co.name}</div>
                  <div className="text-white/70 text-xs font-semibold">{co.type}-based Company</div>
                </div>
                <FileQuestion size={22} className="text-white/50" />
              </div>

              <div className="p-5 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] font-black uppercase tracking-widest border rounded-full px-2.5 py-1 ${co.badgeColor}`}>
                    {co.badge}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">{co.rounds.length} rounds</span>
                </div>

                <div className="space-y-2">
                  {co.rounds.slice(0, 4).map((round) => (
                    <div key={round.name} className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                      <CheckCircle2 size={13} className="text-primary flex-shrink-0" />
                      {round.name}
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 text-xs font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                  View prep guide <ArrowRight size={12} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            to="/company-prep"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-primary text-primary font-bold text-sm hover:bg-primary hover:text-white transition-all"
          >
            View All Companies <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
