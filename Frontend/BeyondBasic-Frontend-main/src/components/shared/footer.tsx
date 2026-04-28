import { Zap } from "lucide-react";
import { Link } from "react-router-dom";

const LINKS: Record<string, { label: string; to: string }[]> = {
  Platform: [
    { label: "Coding Practice", to: "/courses" },
    { label: "Company Prep", to: "/company-prep" },
    { label: "Mock Assessments", to: "/courses" },
    { label: "Dashboard", to: "/dashboard" },
    { label: "Browse Courses", to: "/courses" },
  ],
  Companies: [
    { label: "TCS Prep", to: "/company-prep/tata-consultancy-services" },
    { label: "Infosys Prep", to: "/company-prep/infosys" },
    { label: "Wipro Prep", to: "/company-prep/wipro" },
    { label: "Amazon Prep", to: "/company-prep/amazon" },
    { label: "All Companies", to: "/company-prep" },
  ],
  Resources: [
    { label: "Interview Experiences", to: "/resources/interview-experiences" },
    { label: "Company Papers", to: "/resources/company-papers" },
    { label: "DSA Notes", to: "/resources/dsa-notes" },
    { label: "CS Fundamentals", to: "/resources/cs-fundamentals" },
    { label: "Blog", to: "/resources/blog" },
  ],
  Program: [
    { label: "How It Works", to: "/how-it-works" },
    { label: "30-Day Bootcamp", to: "/how-it-works" },
    { label: "For Colleges", to: "/how-it-works" },
    { label: "College Ambassador", to: "/how-it-works" },
    { label: "Contact Us", to: "/how-it-works" },
  ],
};

export const Footer = () => (
  <footer className="bg-slate-950 text-white pt-14 sm:pt-20 pb-8 sm:pb-10 px-4 sm:px-6">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-12 mb-12 sm:mb-16">
        {/* Brand */}
        <div className="col-span-2 sm:col-span-3 lg:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
              <Zap size={13} className="text-white fill-white" />
            </div>
            <span className="text-lg font-black tracking-tight">
              beyond<span className="text-primary">basic</span>
            </span>
          </Link>
          <p className="text-slate-400 text-sm font-medium leading-relaxed mb-4">
            Your college&apos;s own placement prep platform. Built by alumni, for campus placements.
          </p>
          <div className="flex items-center gap-2 mb-5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
            <span className="text-xs font-bold text-amber-400">Placement Season 2025 — Enrolling Now</span>
          </div>
          <div className="flex items-center gap-3">
            {["WA", "IN", "YT", "TW"].map((s) => (
              <a
                key={s}
                href="#"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-[10px] font-black text-slate-400 hover:text-white transition-all"
              >
                {s}
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        {Object.entries(LINKS).map(([title, links]) => (
          <div key={title}>
            <h4 className="font-black text-xs uppercase tracking-widest text-slate-300 mb-5">{title}</h4>
            <ul className="space-y-3">
              {links.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-500">
        <p>© 2025 BeyondBasic. All rights reserved.</p>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-400 font-semibold">All systems operational</span>
        </div>
      </div>
    </div>
  </footer>
);
