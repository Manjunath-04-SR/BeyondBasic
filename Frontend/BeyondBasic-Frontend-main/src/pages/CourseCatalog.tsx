import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search, BookOpen, Star, Users, Clock, ChevronRight,
  Filter, X, Code2, BarChart3, Globe, Zap,
  TrendingUp, Award, Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { courseApi, enrollmentApi } from "@/lib/api";
import { Navbar } from "@/components/shared/navbar";

interface Course {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  coverImageUrl: string | null;
  tags: string[];
  category: string;
  level: string;
  author: { username?: string; name?: string; email: string } | string;
  price: number;
  totalEnrollments: number;
  rating: number;
  totalRatings: number;
  estimatedDuration: string;
  color: string;
  icon: string;
  whatYouWillLearn: string[];
}

interface Enrollment { course: { _id: string } | string }

const ICON_MAP: Record<string, React.ElementType> = {
  Code2, BarChart3, Globe, Zap, BookOpen, TrendingUp, Award,
};

const LEVEL_COLORS: Record<string, string> = {
  Beginner: "bg-green-100 text-green-700 border-green-200",
  Intermediate: "bg-blue-100 text-blue-700 border-blue-200",
  Advanced: "bg-purple-100 text-purple-700 border-purple-200",
};

const CATEGORIES = ["All", "Computer Science", "Web Development", "Data Science", "Design"];

export default function CourseCatalog() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledIds, setEnrolledIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await courseApi.getAll();
        setCourses(data);
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const enrollments: Enrollment[] = await enrollmentApi.getMyEnrollments();
            setEnrolledIds(
              new Set(
                enrollments.map((e) =>
                  typeof e.course === "string" ? e.course : e.course._id,
                ),
              ),
            );
          } catch {}
        }
      } catch {
        setCourses([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = courses.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      c.title.toLowerCase().includes(q) ||
      c.tags.some((t) => t.toLowerCase().includes(q)) ||
      c.category.toLowerCase().includes(q);
    const matchesCategory = selectedCategory === "All" || c.category === selectedCategory;
    const matchesLevel = selectedLevel === "All" || c.level === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-2xl">
            <Badge className="bg-white/20 text-white border-white/30 mb-4 text-xs">
              <Zap className="w-3 h-3 mr-1" /> {courses.length}+ Expert-crafted Courses
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-black mb-3 leading-tight">
              Level Up Your Tech Career
            </h1>
            <p className="text-blue-100 text-lg mb-6">
              Structured learning paths designed by industry experts. From DSA fundamentals to system design — everything you need to crack top tech interviews.
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-blue-100">
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> 35,000+ students</span>
              <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-yellow-400" /> 4.8 avg rating</span>
              <span className="flex items-center gap-1.5"><Play className="w-4 h-4" /> 135+ hours of content</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Row */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 py-3 overflow-x-auto scrollbar-hide">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex-shrink-0 gap-1.5 ${showFilters ? "bg-blue-50 text-blue-600" : ""}`}
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
            <div className="w-px h-5 bg-slate-200 flex-shrink-0" />
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
            <div className="w-px h-5 bg-slate-200 flex-shrink-0" />
            {["All", "Beginner", "Intermediate", "Advanced"].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedLevel === lvl
                    ? "bg-slate-800 text-white shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
          {/* Mobile search */}
          <div className="md:hidden pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 bg-slate-50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {loading ? "Loading courses..." : `${filtered.length} Course${filtered.length !== 1 ? "s" : ""}`}
              {(selectedCategory !== "All" || selectedLevel !== "All" || searchQuery) && (
                <span className="text-slate-500 font-normal"> found</span>
              )}
            </h2>
            {(selectedCategory !== "All" || selectedLevel !== "All" || searchQuery) && (
              <button
                onClick={() => { setSelectedCategory("All"); setSelectedLevel("All"); setSearchQuery(""); }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-1 flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" /> Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-md animate-pulse">
                <div className="h-40 bg-slate-200" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-full" />
                  <div className="h-3 bg-slate-100 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              <Search className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-600 mb-2">No courses found</h3>
            <p className="text-slate-400 mb-4">Try adjusting your search or filters</p>
            <Button variant="outline" onClick={() => { setSearchQuery(""); setSelectedCategory("All"); setSelectedLevel("All"); }}>
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((course) => {
              const Icon = ICON_MAP[course.icon] || BookOpen;
              const isEnrolled = enrolledIds.has(course._id);
              return (
                <Link key={course._id} to={`/courses/${course.slug}`} className="group block">
                  <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden h-full">
                    {/* Card Header with gradient */}
                    <div className={`relative h-40 bg-gradient-to-br ${course.color || "from-blue-500 to-cyan-500"} overflow-hidden`}>
                      <div className="absolute inset-0">
                        <div className="absolute top-4 right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
                        <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/10 rounded-full blur-lg" />
                      </div>
                      <div className="relative p-5 h-full flex flex-col justify-between">
                        <div className="flex items-start justify-between">
                          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/30">
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          {isEnrolled && (
                            <Badge className="bg-green-500 text-white border-0 text-[10px] shadow-lg">
                              Enrolled
                            </Badge>
                          )}
                        </div>
                        <div>
                          <Badge className="bg-white/20 text-white border-white/30 text-[10px] mb-1">
                            {course.category}
                          </Badge>
                          <h3 className="text-white font-black text-lg leading-tight">{course.title}</h3>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-5">
                      <p className="text-slate-500 text-sm line-clamp-2 mb-4 leading-relaxed">
                        {course.shortDescription || course.description}
                      </p>

                      {/* Stats row */}
                      <div className="flex items-center gap-3 mb-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                          <span className="font-bold text-slate-700">{course.rating.toFixed(1)}</span>
                          <span className="text-slate-400">({course.totalRatings.toLocaleString()})</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {course.totalEnrollments.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {course.estimatedDuration}
                        </span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        <Badge variant="outline" className={`text-[10px] font-semibold ${LEVEL_COLORS[course.level] || ""}`}>
                          {course.level}
                        </Badge>
                        {course.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-[10px] text-slate-500 bg-slate-50">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <div>
                          {course.price === 0 ? (
                            <span className="text-green-600 font-black text-lg">Free</span>
                          ) : (
                            <span className="text-slate-900 font-black text-lg">₹{course.price.toLocaleString()}</span>
                          )}
                        </div>
                        <Button size="sm" className={`text-xs font-bold ${isEnrolled ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"} text-white gap-1`}>
                          {isEnrolled ? "Continue" : "View Course"}
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 mt-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="text-slate-600 font-medium text-sm">BeyondBasic</span>
          </div>
          <p className="text-slate-400 text-sm">Made with ❤️ for aspiring developers</p>
        </div>
      </footer>
    </div>
  );
}
