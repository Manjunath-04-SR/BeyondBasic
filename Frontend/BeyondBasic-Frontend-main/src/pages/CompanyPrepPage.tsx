import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2, FileQuestion, Search, Building2,
  ArrowRight, Users, Briefcase,
} from "lucide-react";
import { companyApi } from "@/lib/api";
import { Navbar } from "@/components/shared/navbar";

interface Company {
  _id: string;
  name: string;
  slug: string;
  type: string;
  color: string;
  badge: string;
  badgeColor: string;
  description: string;
  rounds: { name: string }[];
  hiringDetails: {
    ctc: string;
    roles: string[];
  };
}


const TYPE_COLORS: Record<string, string> = {
  Service: "bg-blue-50 text-blue-700 border-blue-100",
  Product: "bg-amber-50 text-amber-700 border-amber-100",
  FAANG: "bg-purple-50 text-purple-700 border-purple-100",
  Startup: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Consulting: "bg-rose-50 text-rose-700 border-rose-100",
};

export default function CompanyPrepPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    companyApi.getAll()
      .then((data) => setCompanies(data))
      .catch(() => setError("Failed to load companies. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const types = ["All", ...Array.from(new Set(companies.map((c) => c.type)))];

  const filtered = companies.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || c.type === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero */}
      <section className="bg-white border-b border-slate-100 py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">
            <Building2 size={12} />
            Company Prep
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-4 leading-tight">
            We know exactly<br className="hidden sm:block" /> what they ask
          </h1>
          <p className="text-slate-500 text-base sm:text-lg font-medium max-w-xl mx-auto">
            Company-specific preparation — aptitude, coding, interviews — so you walk in knowing the pattern, not just the subject.
          </p>
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-slate-500 font-medium">
            <span className="flex items-center gap-1.5"><Users size={14} className="text-primary" /> Trusted by 10,000+ students</span>
            <span className="flex items-center gap-1.5"><Briefcase size={14} className="text-primary" /> {companies.length > 0 ? companies.length : "Multiple"} companies covered</span>
          </div>
        </div>
      </section>

      {/* Search + Filter */}
      <section className="py-6 px-4 sm:px-6 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                  filter === t
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-slate-600 border-slate-200 hover:border-primary/40"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Company Cards */}
      <section className="py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-20 bg-slate-200" />
                  <div className="p-5 bg-white space-y-3">
                    <div className="h-4 bg-slate-100 rounded w-2/3" />
                    <div className="h-3 bg-slate-100 rounded w-full" />
                    <div className="h-3 bg-slate-100 rounded w-4/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">⚠️</div>
              <p className="text-slate-500 font-medium">{error}</p>
              <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all">
                Retry
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-slate-500 font-medium">No companies found matching your search.</p>
              <button onClick={() => { setSearch(""); setFilter("All"); }} className="mt-4 px-6 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all">
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <p className="text-sm text-slate-400 font-medium mb-5">{filtered.length} {filtered.length === 1 ? "company" : "companies"} found</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((co) => (
                  <Link
                    to={`/company-prep/${co.slug}`}
                    key={co._id}
                    className="group rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1 transition-all duration-300 bg-white"
                  >
                    <div className={`${co.color} px-5 py-4 flex items-center justify-between`}>
                      <div>
                        <div className="text-white font-black text-xl">{co.name}</div>
                        <div className="text-white/70 text-xs font-semibold">{co.type}-based Company</div>
                      </div>
                      <FileQuestion size={22} className="text-white/50" />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-[10px] font-black uppercase tracking-widest border rounded-full px-2.5 py-1 ${co.badgeColor}`}>
                          {co.badge}
                        </span>
                        <span className={`text-[10px] font-bold border rounded-full px-2.5 py-1 ${TYPE_COLORS[co.type] || "bg-slate-50 text-slate-600 border-slate-100"}`}>
                          {co.type}
                        </span>
                      </div>

                      {co.hiringDetails?.ctc && (
                        <div className="text-xs text-slate-500 font-medium mb-3 bg-slate-50 rounded-lg px-3 py-1.5">
                          💰 {co.hiringDetails.ctc.split("|")[0].trim()}
                        </div>
                      )}

                      <div className="space-y-1.5">
                        {co.rounds.slice(0, 4).map((round) => (
                          <div key={round.name} className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                            <CheckCircle2 size={13} className="text-primary flex-shrink-0" />
                            {round.name}
                          </div>
                        ))}
                        {co.rounds.length > 4 && (
                          <div className="text-xs text-slate-400 pl-5">+{co.rounds.length - 4} more rounds</div>
                        )}
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-100 text-xs font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                        View prep guide <ArrowRight size={12} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 px-4 sm:px-6 bg-white border-t border-slate-100">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-2xl font-black text-slate-900 mb-3">More companies coming soon</h3>
          <p className="text-slate-500 mb-6">Our admin team constantly adds new companies and updates the hiring data.</p>
          <Link to="/courses" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25">
            Explore Courses <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
