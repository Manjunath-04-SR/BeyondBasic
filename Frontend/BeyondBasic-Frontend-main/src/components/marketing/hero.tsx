import { useState, useEffect, useRef } from "react";
import { ArrowRight, Play, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";

const TYPED_PHRASES = [
  "Ace Coding Interviews",
  "Get Placed in Top Tech Companies",
  "With Beyond Basic",
];

const TYPE_SPEED = 110;
const DELETE_SPEED = 65;
const PAUSE_AFTER_TYPE = 2200;
const PAUSE_AFTER_DELETE = 500;

function useTypewriter(phrases: string[]) {
  const [displayed, setDisplayed] = useState("");
  const state = useRef({ phraseIndex: 0, charIndex: 0, deleting: false });
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function tick() {
      const { phraseIndex, charIndex, deleting } = state.current;
      const phrase = phrases[phraseIndex];
      if (!deleting) {
        if (charIndex < phrase.length) {
          state.current.charIndex += 1;
          setDisplayed(phrase.slice(0, state.current.charIndex));
          timer.current = setTimeout(tick, TYPE_SPEED);
        } else {
          state.current.deleting = true;
          timer.current = setTimeout(tick, PAUSE_AFTER_TYPE);
        }
      } else {
        if (charIndex > 0) {
          state.current.charIndex -= 1;
          setDisplayed(phrase.slice(0, state.current.charIndex));
          timer.current = setTimeout(tick, DELETE_SPEED);
        } else {
          state.current.phraseIndex = (phraseIndex + 1) % phrases.length;
          state.current.deleting = false;
          timer.current = setTimeout(tick, PAUSE_AFTER_DELETE);
        }
      }
    }
    timer.current = setTimeout(tick, TYPE_SPEED);
    return () => { if (timer.current) clearTimeout(timer.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return displayed;
}

const COMPANIES = [
  "TCS", "AMAZON", "INFOSYS", "MICROSOFT", "WIPRO",
  "GOOGLE", "COGNIZANT", "FLIPKART", "ACCENTURE", "SWIGGY",
];

export default function Hero() {
  const typedText = useTypewriter(TYPED_PHRASES);
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <section className="relative overflow-hidden bg-white">
      {/* background */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] sm:w-[900px] h-[500px] bg-gradient-to-b from-primary/8 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute top-20 right-5 sm:right-10 w-56 sm:w-72 h-56 sm:h-72 bg-violet-500/6 rounded-full blur-3xl" />
        <div className="absolute top-40 left-5 sm:left-10 w-48 sm:w-64 h-48 sm:h-64 bg-emerald-500/6 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.022]"
          style={{
            backgroundImage: "linear-gradient(to right,#1e40af 1px,transparent 1px),linear-gradient(to bottom,#1e40af 1px,transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-14 sm:pb-16 text-center">

        {/* urgency badge */}
        <div className="flex justify-center mb-7 sm:mb-8" style={{ animation: "fadeSlideUp 0.5s ease both" }}>
          <span className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold">
            <CalendarDays size={13} />
            Placement Season 2025 — Batch Now Open · Limited Seats
          </span>
        </div>

        {/* headline */}
        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-slate-900 mb-5 sm:mb-6"
          style={{ animation: "fadeSlideUp 0.55s 0.08s ease both" }}
        >
          Master Tech Skills For Your Dream Job
          <br />
          <span className="block sm:inline-block w-full sm:w-auto overflow-hidden">
            <span className="relative sm:inline-block whitespace-nowrap text-3xl sm:text-4xl md:text-5xl lg:text-6xl block sm:block">
              <span aria-hidden className="invisible text-primary whitespace-nowrap hidden sm:inline">
                {TYPED_PHRASES.reduce((a, b) => (a.length >= b.length ? a : b))}
              </span>
              <span className="sm:absolute sm:inset-0 sm:flex sm:items-center sm:justify-center text-primary">
                {typedText}
                <span
                  className="inline-block ml-[2px] w-[2px] sm:w-[3px] rounded-full bg-primary align-middle"
                  style={{ height: "0.82em", animation: "cursorBlink 1s step-end infinite" }}
                />
              </span>
            </span>
          </span>
        </h1>

        {/* subtext */}
        <p
          className="text-base sm:text-lg lg:text-xl text-slate-500 font-medium max-w-xl sm:max-w-2xl mx-auto mb-4 leading-relaxed px-2"
          style={{ animation: "fadeSlideUp 0.55s 0.16s ease both" }}
        >
          Coding practice, AI roadmaps, mock assessments, resume review — built by your college&apos;s alumni,
          for your campus placements. Online platform + 30-day offline bootcamp.
        </p>

        {/* alumni trust line */}
        <p
          className="text-sm text-primary font-bold mb-8 sm:mb-10"
          style={{ animation: "fadeSlideUp 0.55s 0.22s ease both" }}
        >
          Built by alumni with 6+ years at top product companies
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-14 px-4"
          style={{ animation: "fadeSlideUp 0.55s 0.28s ease both" }}
        >
          <Link
            to={isLoggedIn ? "/courses" : "/signup"}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 sm:h-13 px-7 sm:px-8 rounded-2xl bg-primary text-white text-sm sm:text-base font-bold shadow-xl shadow-primary/30 hover:bg-primary/90 hover:shadow-primary/50 hover:-translate-y-px active:translate-y-0 transition-all group"
          >
            {isLoggedIn ? "Browse Courses" : "Join the Batch"}
            <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/courses"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 h-12 sm:h-13 px-6 rounded-2xl text-sm sm:text-base font-semibold text-slate-600 hover:bg-slate-100 transition-all group"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors flex-shrink-0">
              <Play size={11} className="text-primary fill-primary ml-0.5" />
            </div>
            Explore Courses
          </Link>
        </div>

        {/* social proof */}
        <div
          className="flex flex-col items-center gap-4 sm:gap-5"
          style={{ animation: "fadeSlideUp 0.55s 0.34s ease both" }}
        >
          <div className="flex -space-x-2.5">
            {[
              ["bg-violet-400", "RK"],
              ["bg-blue-400",   "AS"],
              ["bg-emerald-400","PM"],
              ["bg-amber-400",  "VN"],
              ["bg-rose-400",   "SK"],
            ].map(([color, initials], i) => (
              <div key={i} className={`w-9 h-9 rounded-full ${color} border-2 border-white flex items-center justify-center text-white text-[10px] font-black shadow-sm`}>
                {initials}
              </div>
            ))}
          </div>
          <p className="text-sm text-slate-500 font-medium">
            <span className="font-black text-slate-800">Students already enrolled</span> — don&apos;t miss your spot
          </p>

          <p className="text-[10px] sm:text-[11px] font-bold tracking-widest text-slate-400 uppercase">Crack</p>

          {/* infinite scrolling ticker */}
          <div className="relative w-full max-w-2xl mx-auto overflow-hidden mt-1">
            <div className="absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
            <div className="flex items-center gap-8 ticker-track">
              {[...COMPANIES, ...COMPANIES].map((co, i) => (
                <span key={i} className="text-[11px] sm:text-xs font-black tracking-widest text-slate-400 opacity-50 grayscale whitespace-nowrap flex-shrink-0">
                  {co}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .ticker-track {
          width: max-content;
          animation: ticker 10s linear infinite;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
