import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Flame, Trophy, Calendar, Code2, TrendingUp, Clock,
  CheckCircle2, Star, Target, BookOpen, Zap, Medal,
  ChevronRight, Play, Lock, Award, BarChart3,
  Briefcase, Brain, Users, FileText, Globe,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { userApi, problemApi } from "@/lib/api";
import { Navbar } from "@/components/shared/navbar";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Stats {
  problemsSolved: number;
  currentStreak: number;
  longestStreak: number;
  contestRating: number;
  codingTimeHours: number;
  globalRank: number;
}

interface EnrollmentDetail {
  course: { _id: string; title: string; slug: string; color: string; icon: string };
  progress: number;
  completedSubtopics: number;
  totalSubtopics: number;
  lastLesson: string | null;
}

interface Activity {
  _id: string;
  action: string;
  activityType: string;
  createdAt: string;
}

interface CalendarDay {
  date: string;
  level: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  achievementType: string;
  unlocked: boolean;
  unlockedAt?: string;
}

interface DashboardData {
  stats: Stats;
  enrollments: EnrollmentDetail[];
  recentActivity: Activity[];
  activityCalendar: CalendarDay[];
  achievements: Achievement[];
}

// ─── Constants ────────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, React.ElementType> = {
  Code2, BarChart3, Globe, Zap, BookOpen, TrendingUp, Award, Target, Brain, Briefcase, Users, FileText,
};

const ACTIVITY_ICONS: Record<string, { icon: React.ElementType; color: string }> = {
  solved:    { icon: CheckCircle2, color: "text-green-500" },
  completed: { icon: Award,        color: "text-blue-500"  },
  badge:     { icon: Star,         color: "text-yellow-500"},
  attempted: { icon: Code2,        color: "text-purple-500"},
  enrolled:  { icon: BookOpen,     color: "text-cyan-500"  },
};

const ACHIEVEMENT_ICONS: Record<string, { icon: React.ElementType; color: string }> = {
  first_blood:   { icon: Zap,    color: "text-yellow-500" },
  week_warrior:  { icon: Flame,  color: "text-orange-500" },
  problem_solver:{ icon: Target, color: "text-blue-500"   },
  top_performer: { icon: Trophy, color: "text-purple-500" },
};

interface Potd {
  title: string;
  slug: string;
  difficulty: string;
  topicTag: string;
  description: string;
}

const interviewPrepData = [
  { id: 1, title: "Data Structures", tagline: "Master the fundamentals", icon: Brain, color: "from-blue-500 to-cyan-500", topics: 45, problems: 250, description: "Arrays, Linked Lists, Trees, Graphs, and more" },
  { id: 2, title: "System Design",   tagline: "Build scalable systems",  icon: Briefcase, color: "from-purple-500 to-pink-500", topics: 28, problems: 85, description: "Load balancing, caching, databases, microservices" },
  { id: 3, title: "Mock Interviews", tagline: "Practice with experts",   icon: Users, color: "from-orange-500 to-red-500", topics: 15, problems: 50, description: "Real interview simulations with feedback" },
  { id: 4, title: "Company Specific",tagline: "Target your dream job",   icon: FileText, color: "from-green-500 to-emerald-500", topics: 35, problems: 400, description: "FAANG + top startups question banks" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function timeAgo(date: string) {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

// ─── Calendar ─────────────────────────────────────────────────────────────────
function buildCalendarGrid(calendarData: CalendarDay[]) {
  const calMap = new Map(calendarData.map((d) => [d.date, d.level]));
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const startingDay = firstDay.getDay();
  const totalDays = lastDay.getDate();

  const days: any[] = [];
  for (let i = 0; i < startingDay; i++) days.push({ type: "empty", key: `e-${i}` });
  for (let d = 1; d <= totalDays; d++) {
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const level = calMap.get(dateStr) ?? 0;
    days.push({ type: "day", day: d, isToday: d === today.getDate(), level, key: `d-${d}` });
  }
  return days;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-200 rounded ${className}`} />;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [potd, setPotd] = useState<Potd | null>(null);
  const [calendarFilter, setCalendarFilter] = useState<"all" | "completed" | "pending">("all");

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = storedUser?.name?.split(" ")[0] || storedUser?.email?.split("@")[0] || "Student";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }

    // Fetch POTD (non-blocking)
    problemApi.getPotd().then(setPotd).catch(() => {});

    userApi.getDashboardStats()
      .then(setData)
      .catch(() => {
        // On error, show empty state
        setData({
          stats: { problemsSolved: 0, currentStreak: 0, longestStreak: 0, contestRating: 0, codingTimeHours: 0, globalRank: 0 },
          enrollments: [],
          recentActivity: [],
          activityCalendar: [],
          achievements: [
            { id: "first_blood",   title: "First Blood",    description: "Solve your first problem", achievementType: "problem", unlocked: false },
            { id: "week_warrior",  title: "Week Warrior",   description: "7-day streak",             achievementType: "streak",  unlocked: false },
            { id: "problem_solver",title: "Problem Solver", description: "Solve 100 problems",       achievementType: "problem", unlocked: false },
            { id: "top_performer", title: "Top Performer",  description: "Reach top 10",             achievementType: "rank",    unlocked: false },
          ],
        });
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const stats = data?.stats;
  const calendarDays = buildCalendarGrid(data?.activityCalendar || []);
  const activeDaysCount = calendarDays.filter((d) => d.type === "day" && d.level > 0).length;
  const monthName = new Date().toLocaleString("default", { month: "long", year: "numeric" });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 mb-2">
            Welcome back, <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{userName}</span>!{" "}
            <span className="inline-block animate-wave">👋</span>
          </h1>
          <p className="text-slate-500 font-medium">
            {(stats?.currentStreak || 0) > 0
              ? "Let's make today count. Keep your streak alive!"
              : "Start your learning journey today!"}
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <Card key={i} className="border-0 shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              <StatCard icon={Code2}   label="Problems Solved" value={stats?.problemsSolved ?? 0} color="from-blue-500 to-cyan-500"   bgColor="bg-blue-50"   textColor="text-blue-600" />
              <StatCard icon={Trophy}  label="Global Rank"      value={stats?.globalRank ? `#${stats.globalRank.toLocaleString()}` : "—"} color="from-yellow-500 to-orange-500" bgColor="bg-yellow-50" textColor="text-yellow-600" />
              <StatCard icon={Target}  label="Contest Rating"   value={stats?.contestRating ?? 0} color="from-purple-500 to-pink-500"  bgColor="bg-purple-50" textColor="text-purple-600" />
              <StatCard icon={Clock}   label="Coding Time"      value={stats?.codingTimeHours ? `${stats.codingTimeHours} hrs` : "0 hrs"} color="from-green-500 to-emerald-500" bgColor="bg-green-50" textColor="text-green-600" />
            </>
          )}
        </div>

        {/* POTD + Calendar */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="col-span-2">
            <Card className="border-0 shadow-xl h-full overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800" />
              <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
              </div>
              <div className="relative p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-2 px-2.5 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                    <Calendar className="w-3.5 h-3.5 text-blue-200" />
                    <span className="text-blue-100 font-semibold text-xs">Problem of the Day</span>
                  </div>
                  {potd && (
                    <Badge className="bg-white/20 text-white border-white/30 text-xs">{potd.difficulty}</Badge>
                  )}
                </div>
                <h2 className="text-2xl font-black text-white mb-2">
                  {potd ? potd.title : "Loading..."}
                </h2>
                <p className="text-blue-100 text-xs mb-3 line-clamp-2">
                  {potd ? potd.description.slice(0, 120) + "..." : "Fetch the problem of the day and test your skills!"}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {potd && (
                    <span className="px-2.5 py-1 bg-white/10 backdrop-blur-sm rounded-lg text-blue-100 text-[10px] font-semibold border border-white/10">
                      {potd.topicTag}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-6 text-blue-100 text-xs mb-4">
                  <div>
                    <span className="text-blue-300 text-[10px]">Difficulty</span>
                    <p className="font-bold text-white">{potd?.difficulty || "—"}</p>
                  </div>
                  <div>
                    <span className="text-blue-300 text-[10px]">Topic</span>
                    <p className="font-bold text-white">{potd?.topicTag || "—"}</p>
                  </div>
                </div>
                {potd ? (
                  <Link to={`/problems/${potd.slug}`}>
                    <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-bold text-sm shadow-xl hover:scale-105 transition-all py-5">
                      <Play className="w-4 h-4 mr-2" />Solve Now
                    </Button>
                  </Link>
                ) : (
                  <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-bold text-sm shadow-xl py-5" disabled>
                    <Play className="w-4 h-4 mr-2" />Solve Now
                  </Button>
                )}
              </div>
            </Card>
          </div>

          <div className="col-span-1">
            <Card className="border-0 shadow-lg h-full bg-white">
              <CardHeader className="pb-2 pt-4 px-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-bold text-slate-800">Activity</CardTitle>
                      <CardDescription className="text-[10px]">{monthName}</CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-green-200 text-[10px] font-bold">
                    {activeDaysCount} days
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="grid grid-cols-7 gap-1 mb-1">
                  {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
                    <div key={d} className="text-center text-[9px] font-semibold text-slate-400 py-1">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day: any) => (
                    <div
                      key={day.key}
                      className={`aspect-square rounded-sm flex items-center justify-center text-[9px] font-medium transition-all cursor-pointer hover:scale-110 ${
                        day.type === "empty" ? "" :
                        day.level === 3 ? "bg-green-600 text-white" :
                        day.level === 2 ? "bg-green-500 text-white" :
                        day.level === 1 ? "bg-green-400 text-white" :
                        "bg-slate-100 text-slate-400"
                      } ${calendarFilter === "completed" && !day.level ? "opacity-15" : ""}
                         ${calendarFilter === "pending" && day.level ? "opacity-15" : ""}
                         ${day.isToday ? "ring-2 ring-blue-500 ring-offset-1" : ""}`}
                    >
                      {day.type === "day" && day.day <= 9 ? day.day : ""}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-slate-100" /><span className="text-[9px] text-slate-400">Rest</span></div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-green-500" /><span className="text-[9px] text-slate-400">Active</span></div>
                  </div>
                  <div className="flex items-center gap-1">
                    {(["all","completed","pending"] as const).map((f) => (
                      <button key={f} onClick={() => setCalendarFilter(f)}
                        className={`px-2 py-1 text-[9px] font-semibold rounded transition-all ${calendarFilter === f ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>
                        {f === "all" ? "All" : f === "completed" ? "✓" : "○"}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Streak Cards */}
        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Flame className="w-6 h-6 text-orange-500 animate-pulse" />
                    <span className="text-slate-500 font-medium">Current Streak</span>
                  </div>
                  {loading ? <Skeleton className="h-10 w-16 mb-1" /> : (
                    <p className="text-4xl font-black text-slate-900 mb-1">{stats?.currentStreak ?? 0}</p>
                  )}
                  <p className="text-slate-500 font-medium">days in a row</p>
                </div>
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg">
                  <Flame className="w-10 h-10 text-white animate-pulse" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-500">Next milestone</span>
                  <span className="font-semibold text-orange-600">30 days</span>
                </div>
                <Progress value={((stats?.currentStreak ?? 0) / 30) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg overflow-hidden">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-6 h-6 text-purple-500" />
                    <span className="text-slate-500 font-medium">Longest Streak</span>
                  </div>
                  {loading ? <Skeleton className="h-10 w-16 mb-1" /> : (
                    <p className="text-4xl font-black text-slate-900 mb-1">{stats?.longestStreak ?? 0}</p>
                  )}
                  <p className="text-slate-500 font-medium">personal best</p>
                </div>
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-lg">
                  <Medal className="w-10 h-10 text-white" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100">
                {(stats?.longestStreak ?? 0) === 0 ? (
                  <p className="text-sm text-slate-400 font-medium">Start your streak today! 🔥</p>
                ) : (stats?.longestStreak ?? 0) <= (stats?.currentStreak ?? 0) ? (
                  <p className="text-sm text-green-600 font-medium flex items-center gap-1"><TrendingUp className="w-4 h-4" />You're at your personal best!</p>
                ) : (
                  <p className="text-sm text-green-600 font-medium flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    You're {(stats?.longestStreak ?? 0) - (stats?.currentStreak ?? 0)} days away from your record!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interview Prep */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">Interview Prep Guide</h2>
                <p className="text-slate-500 font-medium text-sm">Prepare for your dream company</p>
              </div>
            </div>
            <Link to="/courses">
              <Button variant="ghost" className="text-purple-600 hover:text-purple-700">
                View all paths <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {interviewPrepData.map((prep) => (
              <Link key={prep.id} to="/courses">
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer group overflow-hidden">
                  <div className={`h-1 bg-gradient-to-r ${prep.color}`} />
                  <CardContent className="pt-4">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${prep.color} flex items-center justify-center shadow-md mb-3 group-hover:scale-105 transition-transform`}>
                      <prep.icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-1">{prep.title}</h3>
                    <p className="text-xs text-slate-500 font-medium mb-2">{prep.tagline}</p>
                    <p className="text-xs text-slate-400 mb-3 line-clamp-2">{prep.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500"><span className="font-bold text-slate-700">{prep.topics}</span> topics</span>
                      <span className="text-slate-500"><span className="font-bold text-slate-700">{prep.problems}</span> problems</span>
                    </div>
                    <Button variant="ghost" size="sm" className="w-full mt-3 text-xs font-semibold text-slate-600 hover:bg-slate-100">
                      Start Learning <ChevronRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* My Courses + Recent Activity */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-md">
                      <BookOpen className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">My Courses</CardTitle>
                      <CardDescription>Continue your learning journey</CardDescription>
                    </div>
                  </div>
                  <Link to="/courses">
                    <Button variant="ghost" size="sm" className="text-blue-600">
                      View All <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[1,2,3].map((i) => (
                      <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50">
                        <Skeleton className="w-12 h-12 rounded-xl" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-40" />
                          <Skeleton className="h-2 w-full" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (data?.enrollments?.length || 0) === 0 ? (
                  <div className="text-center py-10">
                    <BookOpen className="w-12 h-12 mx-auto text-slate-200 mb-3" />
                    <p className="font-semibold text-slate-500 mb-1">No courses yet</p>
                    <p className="text-sm text-slate-400 mb-4">Enroll in a course to start learning</p>
                    <Link to="/courses">
                      <Button size="sm" className="font-bold">Browse Courses</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {data!.enrollments.map((enr) => {
                      const IconComp = ICON_MAP[enr.course.icon] || BookOpen;
                      return (
                        <div
                          key={enr.course._id}
                          className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-blue-50 transition-all group"
                        >
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${enr.course.color || "from-blue-500 to-cyan-500"} flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0`}>
                            <IconComp className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <Link to={`/learn/${enr.course.slug}`} className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">{enr.course.title}</Link>
                              <span className="text-sm font-medium text-slate-500 shrink-0 ml-2">
                                {enr.completedSubtopics}/{enr.totalSubtopics || "—"}
                              </span>
                            </div>
                            <Progress value={enr.progress} className="h-2 mb-1" />
                            <p className="text-xs text-slate-500">
                              {enr.lastLesson
                                ? <>Next: <span className="font-medium text-slate-700">{enr.lastLesson}</span></>
                                : <span className="text-slate-400">Start your first lesson</span>
                              }
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-all">
                            <Link to={`/practice/${enr.course.slug}`}>
                              <Button size="sm" variant="outline" className="text-xs h-8 px-3 border-blue-200 text-blue-600 hover:bg-blue-50">
                                Practice
                              </Button>
                            </Link>
                            <Link to={`/learn/${enr.course.slug}`}>
                              <Button size="icon" variant="ghost" className="text-blue-600 hover:bg-blue-100 w-8 h-8">
                                <ChevronRight className="w-4 h-4" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-md">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Recent Activity</CardTitle>
                    <CardDescription>Your latest achievements</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[1,2,3].map((i) => (
                      <div key={i} className="flex items-start gap-3 p-2">
                        <Skeleton className="w-9 h-9 rounded-lg flex-shrink-0" />
                        <div className="flex-1 space-y-1.5">
                          <Skeleton className="h-3 w-36" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (data?.recentActivity?.length || 0) === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="w-10 h-10 mx-auto text-slate-200 mb-2" />
                    <p className="text-sm font-medium text-slate-400">No activity yet</p>
                    <p className="text-xs text-slate-300 mt-1">Start solving problems!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {data!.recentActivity.map((activity) => {
                      const iconData = ACTIVITY_ICONS[activity.activityType] || ACTIVITY_ICONS.solved;
                      const IconComp = iconData.icon;
                      return (
                        <div key={activity._id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 transition-all">
                          <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                            <IconComp className={`w-4 h-4 ${iconData.color}`} />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-slate-700 text-sm">{activity.action}</p>
                            <p className="text-xs text-slate-400">{timeAgo(activity.createdAt)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Achievements */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-md">
                  <Award className="w-4 h-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Achievements</CardTitle>
                  <CardDescription>Badges you've earned</CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-blue-600">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {loading ? (
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-50 text-center space-y-2">
                    <Skeleton className="w-12 h-12 mx-auto rounded-xl" />
                    <Skeleton className="h-4 w-24 mx-auto" />
                    <Skeleton className="h-3 w-20 mx-auto" />
                  </div>
                ))
              ) : (
                (data?.achievements || []).map((ach) => {
                  const iconData = ACHIEVEMENT_ICONS[ach.id] || { icon: Award, color: "text-slate-400" };
                  const IconComp = iconData.icon;
                  return (
                    <div
                      key={ach.id}
                      className={`p-4 rounded-xl text-center transition-all ${
                        ach.unlocked
                          ? "bg-slate-50 hover:shadow-lg cursor-pointer hover:-translate-y-1"
                          : "bg-slate-50 opacity-50"
                      }`}
                    >
                      <div className={`w-12 h-12 mx-auto mb-2 rounded-xl bg-white shadow-md flex items-center justify-center ${!ach.unlocked ? "grayscale" : ""}`}>
                        <IconComp className={`w-6 h-6 ${iconData.color}`} />
                      </div>
                      <p className="font-bold text-slate-900 text-sm mb-1">{ach.title}</p>
                      <p className="text-xs text-slate-500">{ach.description}</p>
                      {ach.unlocked
                        ? <Badge className="mt-2 bg-green-100 text-green-700 border-green-200 text-xs">Unlocked</Badge>
                        : <Lock className="w-4 h-4 mx-auto mt-2 text-slate-300" />
                      }
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="border-t border-slate-200 mt-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-slate-600 font-medium text-sm">BeyondBasic — Learn Beyond Basics</span>
            </div>
            <p className="text-slate-400 text-sm">Made with ❤️ for aspiring developers</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes wave { 0%,100%{transform:rotate(0deg)} 25%{transform:rotate(15deg)} 75%{transform:rotate(-15deg)} }
        .animate-wave { animation: wave 1.5s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, bgColor, textColor }: { icon: any; label: string; value: string | number; color: string; bgColor: string; textColor: string }) {
  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${bgColor} flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${textColor}`} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">{label}</p>
            <p className="text-xl font-black text-slate-900">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
