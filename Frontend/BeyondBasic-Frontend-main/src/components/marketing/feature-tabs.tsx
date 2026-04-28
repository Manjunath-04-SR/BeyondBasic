import { useState } from "react";
import { Clock, ArrowRight, Star, Users, Flame, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Course = {
  title: string;
  description: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  tag: string;
  students: string;
  rating: number;
  gradient: string;
  accent: string;
  hot?: boolean;
  new?: boolean;
};

const ALL_COURSES: Course[] = [
  {
    title: "Grokking System Design",
    description: "Learn how to design scalable distributed systems used at top tech companies.",
    duration: "26h",
    level: "Intermediate",
    tag: "SYSTEM DESIGN",
    students: "320K",
    rating: 4.9,
    gradient: "from-blue-600 to-indigo-600",
    accent: "bg-blue-50 text-blue-600",
    hot: true,
  },
  {
    title: "Coding Interview Patterns",
    description: "Master the 24 patterns that crack any coding interview at FAANG companies.",
    duration: "85h",
    level: "Advanced",
    tag: "INTERVIEWS",
    students: "280K",
    rating: 4.8,
    gradient: "from-violet-600 to-purple-600",
    accent: "bg-violet-50 text-violet-600",
    hot: true,
  },
  {
    title: "Generative AI Essentials",
    description: "Build real AI applications with LLMs, RAG, and agent patterns from scratch.",
    duration: "10h",
    level: "Beginner",
    tag: "AI / ML",
    students: "190K",
    rating: 4.9,
    gradient: "from-emerald-500 to-teal-600",
    accent: "bg-emerald-50 text-emerald-600",
    new: true,
  },
  {
    title: "React & Next.js Mastery",
    description: "Build production-grade apps with React 19 and Next.js 15 App Router.",
    duration: "40h",
    level: "Intermediate",
    tag: "FRONTEND",
    students: "210K",
    rating: 4.7,
    gradient: "from-cyan-500 to-blue-500",
    accent: "bg-cyan-50 text-cyan-600",
  },
  {
    title: "Kubernetes in Practice",
    description: "Deploy, scale, and manage containerized workloads with confidence.",
    duration: "18h",
    level: "Advanced",
    tag: "DEVOPS",
    students: "145K",
    rating: 4.8,
    gradient: "from-amber-500 to-orange-500",
    accent: "bg-amber-50 text-amber-600",
  },
  {
    title: "Python for Data Science",
    description: "From pandas & NumPy to machine learning pipelines — all hands-on.",
    duration: "32h",
    level: "Beginner",
    tag: "DATA SCIENCE",
    students: "400K",
    rating: 4.9,
    gradient: "from-rose-500 to-pink-600",
    accent: "bg-rose-50 text-rose-600",
    hot: true,
  },
];

const SD_COURSES = ALL_COURSES.filter((c) => c.tag === "SYSTEM DESIGN" || c.tag === "DEVOPS");
const AI_COURSES = ALL_COURSES.filter((c) => c.tag === "AI / ML" || c.tag === "DATA SCIENCE");
const INTERVIEW_COURSES = ALL_COURSES.filter((c) => c.tag === "INTERVIEWS");

const levelColors: Record<string, string> = {
  Beginner: "bg-emerald-50 text-emerald-600 border-emerald-100",
  Intermediate: "bg-blue-50 text-blue-600 border-blue-100",
  Advanced: "bg-rose-50 text-rose-600 border-rose-100",
};

function CourseCard({ course }: { course: Course }) {
  return (
    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer">
      {/* Color bar */}
      <div className={`h-1.5 bg-gradient-to-r ${course.gradient}`} />

      {/* Hot / New badge */}
      {(course.hot || course.new) && (
        <div className="absolute top-5 right-4">
          {course.hot && (
            <span className="flex items-center gap-1 text-[10px] font-black bg-amber-50 text-amber-600 border border-amber-100 rounded-full px-2 py-0.5">
              <Flame size={10} className="fill-amber-500" /> HOT
            </span>
          )}
          {course.new && (
            <span className="flex items-center gap-1 text-[10px] font-black bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full px-2 py-0.5">
              <Sparkles size={10} /> NEW
            </span>
          )}
        </div>
      )}

      <div className="p-6">
        <span
          className={`inline-block text-[10px] font-black tracking-widest rounded-full px-2.5 py-1 border mb-4 ${course.accent} border-current/10`}
        >
          {course.tag}
        </span>
        <h3 className="text-lg font-black text-slate-900 mb-2 leading-tight group-hover:text-primary transition-colors">
          {course.title}
        </h3>
        <p className="text-sm text-slate-500 mb-5 leading-relaxed">{course.description}</p>

        {/* Meta */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
            <Clock size={11} /> {course.duration}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
            <Users size={11} /> {course.students}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-500">
            <Star size={10} className="fill-amber-400" /> {course.rating}
          </div>
          <span
            className={`ml-auto text-[10px] font-bold rounded-full px-2 py-0.5 border ${levelColors[course.level]}`}
          >
            {course.level}
          </span>
        </div>
      </div>

      {/* Hover footer */}
      <div className="px-6 pb-5 flex items-center justify-between pt-4">
        <span className="text-xs font-bold text-slate-400">Free preview available</span>
        <span className="flex items-center gap-1 text-xs font-bold text-primary group-hover:gap-2 transition-all">
          Enroll now <ArrowRight size={12} />
        </span>
      </div>
    </div>
  );
}

const TABS = [
  { id: "all", label: "Most Popular", courses: ALL_COURSES },
  { id: "sd", label: "System Design", courses: SD_COURSES },
  { id: "ai", label: "AI & Data", courses: AI_COURSES },
  { id: "interviews", label: "Interviews", courses: INTERVIEW_COURSES },
];

export default function FeatureTabs() {
  const [active, setActive] = useState("all");
  const current = TABS.find((t) => t.id === active)!;

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-10">
          <div>
            <Badge variant="secondary" className="mb-3 sm:mb-4 bg-primary/8 text-primary border-primary/15 font-bold">
              COURSES & PATHS
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
              Popular roadmaps &<br className="hidden sm:block" /> learning guides
            </h2>
          </div>
          <a href="#" className="flex items-center gap-1.5 text-sm font-bold text-primary hover:gap-2.5 transition-all whitespace-nowrap">
            Browse all courses <ArrowRight size={14} />
          </a>
        </div>

        {/* Tabs — scrollable on mobile */}
        <div className="overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 mb-8 sm:mb-10">
          <div className="flex gap-1 bg-slate-100 rounded-2xl p-1 w-fit min-w-max">
            {TABS.map((tab) => (
              <button
                key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                active === tab.id
                  ? "bg-white text-primary shadow-sm shadow-slate-200"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {current.courses.map((course) => (
            <CourseCard key={course.title} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
}
