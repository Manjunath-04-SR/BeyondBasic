import { Link } from "react-router-dom";
import {
  BookOpen, Code2, Building2, Trophy, ArrowRight, Users,
  Target, Zap, CheckCircle2, MessageSquare, GraduationCap,
  Heart, Globe, Star, ChevronRight,
} from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";

// ─── Data ─────────────────────────────────────────────────────────────────────
const HOW_IT_WORKS = [
  {
    step: "01",
    icon: BookOpen,
    title: "Learn Core Concepts",
    description: "Pick a structured course — DSA, System Design, or Full Stack. Every topic has curated notes, examples, and quizzes built for campus placement exams.",
    color: "from-blue-500 to-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
    iconColor: "text-blue-600",
  },
  {
    step: "02",
    icon: Code2,
    title: "Practice Problems",
    description: "Solve 200+ hand-picked problems mapped to real placement question patterns. Track your progress, review solutions, and use the built-in code editor.",
    color: "from-violet-500 to-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-100",
    iconColor: "text-violet-600",
  },
  {
    step: "03",
    icon: Building2,
    title: "Prepare for Companies",
    description: "Study company-specific prep: past papers, hiring process, round breakdown, and interview experiences from placed students — all in one place.",
    color: "from-orange-500 to-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-100",
    iconColor: "text-orange-600",
  },
  {
    step: "04",
    icon: Trophy,
    title: "Get Placed",
    description: "Walk into every interview with confidence. Our alumni network, mock interview tips, and placement resources have helped 10,000+ students land their dream jobs.",
    color: "from-green-500 to-emerald-600",
    bg: "bg-green-50",
    border: "border-green-100",
    iconColor: "text-green-600",
  },
];

const PROGRAMS = [
  {
    title: "30-Day Bootcamp",
    description: "Intensive month-long placement preparation covering DSA, CS fundamentals, aptitude, and communication. Live sessions, daily practice, and mentorship.",
    icon: Zap,
    color: "from-yellow-400 to-orange-500",
    bg: "bg-gradient-to-br from-yellow-50 to-orange-50",
    border: "border-orange-200",
    features: ["Daily live sessions", "Doubt clearing", "Mock interviews", "Placement support"],
    cta: "Join Bootcamp",
    ctaLink: "/signup",
  },
  {
    title: "For Colleges",
    description: "We partner with engineering colleges to bring BeyondBasic directly to campus — placement cell integration, batch workshops, and custom prep programs.",
    icon: GraduationCap,
    color: "from-blue-500 to-indigo-600",
    bg: "bg-gradient-to-br from-blue-50 to-indigo-50",
    border: "border-blue-200",
    features: ["Campus workshops", "Placement cell tie-up", "College leaderboard", "Batch reporting"],
    cta: "Partner With Us",
    ctaLink: "/signup",
  },
  {
    title: "College Ambassador",
    description: "Represent BeyondBasic at your college. Help your batchmates prepare, earn perks, and build leadership experience as a campus ambassador.",
    icon: Heart,
    color: "from-pink-500 to-rose-600",
    bg: "bg-gradient-to-br from-pink-50 to-rose-50",
    border: "border-pink-200",
    features: ["Free premium access", "Ambassador certificate", "Referral rewards", "Community events"],
    cta: "Become Ambassador",
    ctaLink: "/signup",
  },
  {
    title: "WhatsApp Community",
    description: "Join 5,000+ students in our placement-focused WhatsApp group. Daily practice questions, job alerts, placement news, and peer support.",
    icon: MessageSquare,
    color: "from-green-500 to-emerald-600",
    bg: "bg-gradient-to-br from-green-50 to-emerald-50",
    border: "border-green-200",
    features: ["Daily DSA challenges", "Off-campus job alerts", "Peer discussions", "Expert Q&A"],
    cta: "Join Group",
    ctaLink: "/signup",
  },
];

const STATS = [
  { value: "10,000+", label: "Students Helped", icon: Users },
  { value: "200+", label: "Companies Covered", icon: Building2 },
  { value: "50+", label: "Partner Colleges", icon: GraduationCap },
  { value: "4.8 / 5", label: "Average Rating", icon: Star },
];

const ABOUT_POINTS = [
  { icon: Target, title: "Built for Campus Placements", desc: "We focus entirely on the campus recruitment process — aptitude, coding rounds, HR, and company-specific prep — unlike generic coding platforms." },
  { icon: Globe, title: "By Alumni, For Students", desc: "BeyondBasic was built by engineers placed at top companies who experienced the placement grind firsthand. Every resource is crafted from real experience." },
  { icon: Users, title: "Community-Driven", desc: "Over 10,000 students share interview experiences, solve problems together, and motivate each other through the placement season." },
  { icon: Zap, title: "Completely Free to Start", desc: "Every course, DSA note, and company prep page is free. We believe quality placement preparation should not have a paywall." },
];

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 rounded-full px-4 py-1.5 mb-6">
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-blue-300 text-sm font-semibold">How BeyondBasic Works</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
            Your complete placement
            <br />
            <span className="text-blue-400">preparation system</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            From learning DSA to cracking company-specific rounds — BeyondBasic is the one platform
            built specifically for campus placement season.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/courses"
              className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg transition-all hover:-translate-y-0.5">
              Start Learning Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/company-prep"
              className="flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/20 transition-all">
              Browse Companies <Building2 className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-slate-50 border-b border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map(({ value, label, icon: Icon }) => (
              <div key={label} className="text-center">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-3xl font-black text-slate-900">{value}</p>
                <p className="text-sm text-slate-500 font-medium mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Steps */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3">How It Works</h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Four simple steps to go from zero to placement-ready.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {HOW_IT_WORKS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className={`relative rounded-2xl ${step.bg} border ${step.border} p-6`}>
                <div className="absolute -top-3 -left-3 w-9 h-9 rounded-xl bg-white border-2 border-slate-100 shadow-md flex items-center justify-center">
                  <span className="text-xs font-black text-slate-500">{step.step}</span>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-black text-slate-900 text-lg mb-2">{step.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{step.description}</p>
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <ChevronRight className="w-6 h-6 text-slate-300" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* About Us */}
      <section className="bg-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 rounded-full px-4 py-1.5 mb-5">
                <Heart className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-blue-300 text-sm font-semibold">About Us</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-5 leading-tight">
                Built by engineers who
                <span className="text-blue-400"> lived the placement grind</span>
              </h2>
              <p className="text-slate-300 text-base leading-relaxed mb-6">
                BeyondBasic was founded by alumni who went through campus placements at top tech companies
                and noticed a gap — there was no single platform designed specifically for the campus
                placement process. Generic competitive programming sites don't teach you how to crack
                an Infosys aptitude test or prepare for a CTS technical interview.
              </p>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                We built BeyondBasic to be that missing platform — practical, structured, and focused
                entirely on helping engineering students secure their dream placements.
              </p>
              <Link to="/signup"
                className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all hover:-translate-y-0.5">
                Join for Free <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {ABOUT_POINTS.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <h4 className="font-bold text-white text-sm mb-2">{title}</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3">Our Programs</h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Beyond self-study — structured programs for serious placement preparation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {PROGRAMS.map((program) => {
            const Icon = program.icon;
            return (
              <div key={program.title} className={`rounded-2xl ${program.bg} border ${program.border} p-7 flex flex-col`}>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${program.color} flex items-center justify-center mb-5 shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">{program.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-5 flex-1">{program.description}</p>

                <ul className="space-y-2 mb-6">
                  {program.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5 text-sm text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link to={program.ctaLink}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-all self-start">
                  {program.cta} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-700 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Ready to crack your placement?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Join 10,000+ students who use BeyondBasic to prepare smarter and land better placements.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-blue-700 font-black rounded-xl shadow-xl hover:bg-blue-50 transition-all hover:-translate-y-0.5">
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/courses"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 bg-blue-500/40 border border-white/30 text-white font-bold rounded-xl hover:bg-blue-500/60 transition-all">
              Browse Courses
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
