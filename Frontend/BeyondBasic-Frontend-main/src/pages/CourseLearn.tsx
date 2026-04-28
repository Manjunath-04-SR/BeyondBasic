import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  CheckCircle2, ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  BookOpen, Clock, ArrowLeft, Menu, X, Bookmark,
  FileText, Check, Trophy, Code2, BarChart3, Globe, Zap, TrendingUp,
  Award, AlertTriangle, Info, Lightbulb, List, HelpCircle,
  Flame, Play, RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { courseApi, enrollmentApi } from "@/lib/api";

// ─── Types ───────────────────────────────────────────────────────────
interface ContentBlock {
  type: string;
  data: Record<string, unknown>;
}

interface Subtopic {
  _id: string;
  title: string;
  slug: string;
  estimatedReadTime: number;
  isFreePreview: boolean;
  order: number;
  content?: ContentBlock[];
  summary?: string;
}

interface Chapter {
  _id: string;
  title: string;
  order: number;
  subtopics: Subtopic[];
}

interface Enrollment {
  completedSubtopics: string[];
  progress: number;
  bookmarks: string[];
  notes: { subtopicId: string; content: string; _id: string }[];
}

// ─── Icon map ─────────────────────────────────────────────────────────
const ICON_MAP: Record<string, React.ElementType> = {
  Code2, BarChart3, Globe, Zap, BookOpen, TrendingUp, Award,
};

// ─── Content Renderer ─────────────────────────────────────────────────
function ContentRenderer({ blocks }: { blocks: ContentBlock[] }) {
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number | null>>({});

  if (!blocks?.length) {
    return (
      <div className="text-center py-16 text-slate-400">
        <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-40" />
        <p className="font-medium">Content coming soon</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case "heading": {
            const d = block.data as { level: number; text: string };
            if (d.level === 1) return <h1 key={idx} className="text-3xl font-black text-slate-900 leading-tight mt-2">{d.text}</h1>;
            if (d.level === 2) return <h2 key={idx} className="text-2xl font-black text-slate-900 mt-8 mb-4 pb-2 border-b-2 border-blue-100">{d.text}</h2>;
            return <h3 key={idx} className="text-xl font-bold text-slate-800 mt-6 mb-3">{d.text}</h3>;
          }

          case "paragraph": {
            const d = block.data as { text: string };
            return <p key={idx} className="text-slate-600 leading-relaxed text-[15px]">{d.text}</p>;
          }

          case "code": {
            const d = block.data as { language: string; title?: string; code: string };
            return (
              <div key={idx} className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 my-6">
                <div className="bg-slate-800 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    {d.title && <span className="text-slate-300 text-xs font-medium">{d.title}</span>}
                  </div>
                  <span className="text-slate-400 text-xs font-mono uppercase tracking-wide">{d.language}</span>
                </div>
                <div className="bg-slate-900 overflow-x-auto">
                  <pre className="p-5 text-sm font-mono leading-relaxed">
                    <CodeHighlight code={d.code} language={d.language} />
                  </pre>
                </div>
              </div>
            );
          }

          case "info": {
            const d = block.data as { title?: string; text: string };
            return (
              <div key={idx} className="flex gap-4 p-5 bg-blue-50 border border-blue-200 rounded-2xl">
                <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center flex-shrink-0 shadow-md">
                  <Info className="w-5 h-5 text-white" />
                </div>
                <div>
                  {d.title && <p className="font-bold text-blue-800 mb-1.5">{d.title}</p>}
                  <p className="text-blue-700 text-sm leading-relaxed">{d.text}</p>
                </div>
              </div>
            );
          }

          case "tip": {
            const d = block.data as { text: string };
            return (
              <div key={idx} className="flex gap-4 p-5 bg-amber-50 border border-amber-200 rounded-2xl">
                <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center flex-shrink-0 shadow-md">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-amber-800 mb-1">Pro Tip</p>
                  <p className="text-amber-700 text-sm leading-relaxed">{d.text}</p>
                </div>
              </div>
            );
          }

          case "warning": {
            const d = block.data as { title?: string; text: string };
            return (
              <div key={idx} className="flex gap-4 p-5 bg-red-50 border border-red-200 rounded-2xl">
                <div className="w-9 h-9 rounded-xl bg-red-500 flex items-center justify-center flex-shrink-0 shadow-md">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <div>
                  {d.title && <p className="font-bold text-red-800 mb-1.5">{d.title}</p>}
                  <p className="text-red-700 text-sm leading-relaxed">{d.text}</p>
                </div>
              </div>
            );
          }

          case "success": {
            const d = block.data as { title?: string; text: string };
            return (
              <div key={idx} className="flex gap-4 p-5 bg-green-50 border border-green-200 rounded-2xl">
                <div className="w-9 h-9 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0 shadow-md">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  {d.title && <p className="font-bold text-green-800 mb-1.5">{d.title}</p>}
                  <p className="text-green-700 text-sm leading-relaxed">{d.text}</p>
                </div>
              </div>
            );
          }

          case "keyPoints": {
            const d = block.data as { title?: string; points: string[] };
            return (
              <div key={idx} className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-xl text-white">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md">
                    <List className="w-4 h-4 text-white" />
                  </div>
                  <p className="font-black text-lg">{d.title || "Key Takeaways"}</p>
                </div>
                <ul className="space-y-3">
                  {d.points.map((point, pi) => (
                    <li key={pi} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-slate-200 text-sm leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          }

          case "list": {
            const d = block.data as { style: string; items: string[] };
            return (
              <ul key={idx} className="space-y-2.5 pl-1">
                {d.items.map((item, ii) => (
                  <li key={ii} className="flex items-start gap-3 text-slate-600 text-[15px]">
                    {d.style === "bullet" ? (
                      <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-2" />
                    ) : (
                      <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0">{ii + 1}</span>
                    )}
                    {item}
                  </li>
                ))}
              </ul>
            );
          }

          case "table": {
            const d = block.data as { headers: string[]; rows: string[][] };
            return (
              <div key={idx} className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-800 text-white">
                      {d.headers.map((h, hi) => (
                        <th key={hi} className="px-4 py-3 text-left font-bold text-xs uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {d.rows.map((row, ri) => (
                      <tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                        {row.map((cell, ci) => (
                          <td key={ci} className="px-4 py-3 text-slate-600 border-t border-slate-100 font-mono text-xs">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }

          case "comparison": {
            const d = block.data as { title?: string; items: { operation: string; complexity: string; note: string }[] };
            return (
              <div key={idx} className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                {d.title && (
                  <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-5 py-3">
                    <p className="font-bold text-white text-sm">{d.title}</p>
                  </div>
                )}
                <div className="divide-y divide-slate-100">
                  {d.items.map((item, ii) => (
                    <div key={ii} className={`flex items-center gap-4 px-5 py-3.5 ${ii % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                      <div className="w-1/3 text-sm font-semibold text-slate-700">{item.operation}</div>
                      <div className="w-1/3">
                        <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-mono font-bold">
                          {item.complexity}
                        </span>
                      </div>
                      <div className="flex-1 text-xs text-slate-500">{item.note}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          case "quiz": {
            const d = block.data as {
              question: string;
              options: string[];
              correctIndex: number;
              explanation: string;
            };
            const selected = quizAnswers[idx] ?? null;
            const submitted = selected !== null;
            const isCorrect = selected === d.correctIndex;

            return (
              <div key={idx} className="p-6 bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200 rounded-2xl shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md">
                    <HelpCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-violet-800 text-sm">Quick Check</span>
                </div>
                <p className="font-bold text-slate-800 mb-4 leading-relaxed">{d.question}</p>
                <div className="space-y-2.5">
                  {d.options.map((option, oi) => {
                    let cls = "border-slate-200 bg-white text-slate-700 hover:border-violet-300 hover:bg-violet-50/50";
                    if (submitted) {
                      if (oi === d.correctIndex) cls = "border-green-400 bg-green-50 text-green-800";
                      else if (oi === selected) cls = "border-red-300 bg-red-50 text-red-700";
                      else cls = "border-slate-200 bg-white/60 text-slate-400 opacity-60";
                    }
                    return (
                      <button
                        key={oi}
                        disabled={submitted}
                        onClick={() => setQuizAnswers((prev) => ({ ...prev, [idx]: oi }))}
                        className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 text-left text-sm transition-all ${cls}`}
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 flex-shrink-0 ${
                          submitted && oi === d.correctIndex ? "border-green-500 bg-green-500 text-white" :
                          submitted && oi === selected ? "border-red-400 bg-red-400 text-white" :
                          "border-current"
                        }`}>
                          {String.fromCharCode(65 + oi)}
                        </div>
                        {option}
                      </button>
                    );
                  })}
                </div>
                {submitted && (
                  <div className={`mt-4 p-4 rounded-xl border text-sm ${isCorrect ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"}`}>
                    <div className="flex items-center gap-2 font-bold mb-1.5">
                      {isCorrect ? <><CheckCircle2 className="w-4 h-4" /> Correct!</> : <><X className="w-4 h-4" /> Not quite</>}
                    </div>
                    <p className="leading-relaxed">{d.explanation}</p>
                    {!isCorrect && (
                      <button onClick={() => setQuizAnswers((prev) => ({ ...prev, [idx]: null }))} className="mt-2 flex items-center gap-1 text-xs text-red-600 font-semibold hover:underline">
                        <RefreshCw className="w-3 h-3" /> Try again
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          }

          case "divider":
            return <hr key={idx} className="border-slate-200 my-2" />;

          default:
            return null;
        }
      })}
    </div>
  );
}

// Simple syntax highlighter using CSS classes
function CodeHighlight({ code, language }: { code: string; language: string }) {
  const highlighted = highlightCode(code, language);
  return <code dangerouslySetInnerHTML={{ __html: highlighted }} />;
}

function highlightCode(code: string, lang: string): string {
  const escaped = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const keywords =
    lang === "python"
      ? ["def", "class", "return", "if", "elif", "else", "for", "while", "in", "not", "and", "or", "import", "from", "True", "False", "None", "print", "range", "len", "self", "async", "await"]
      : lang === "javascript" || lang === "typescript"
      ? ["const", "let", "var", "function", "return", "if", "else", "for", "while", "class", "import", "export", "from", "default", "async", "await", "new", "this", "null", "undefined", "true", "false", "typeof", "console"]
      : [];

  let result = escaped;

  // Comments
  result = result.replace(/(#[^\n]*)|(\/\/[^\n]*)/g, '<span class="text-slate-500 italic">$&</span>');
  // Strings
  result = result.replace(/(&quot;.*?&quot;|&#x27;.*?&#x27;|`.*?`)/g, '<span class="text-emerald-400">$&</span>');
  // Numbers
  result = result.replace(/\b(\d+)\b/g, '<span class="text-orange-400">$1</span>');
  // Keywords
  keywords.forEach((kw) => {
    result = result.replace(
      new RegExp(`\\b(${kw})\\b`, "g"),
      '<span class="text-violet-400 font-semibold">$1</span>',
    );
  });
  // Function names
  result = result.replace(/\b([a-z_][a-zA-Z_0-9]*)(?=\()/g, '<span class="text-blue-400">$1</span>');

  return result;
}

// ─── Notes Panel ──────────────────────────────────────────────────────
function NotesPanel({
  courseSlug,
  subtopicId,
  existingNote,
  onSave,
  onClose,
}: {
  courseSlug: string;
  subtopicId: string;
  existingNote: string;
  onSave: (content: string) => void;
  onClose: () => void;
}) {
  const [note, setNote] = useState(existingNote);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!note.trim()) return;
    setSaving(true);
    try {
      await enrollmentApi.saveNote(courseSlug, subtopicId, note.trim());
      onSave(note.trim());
    } catch {}
    setSaving(false);
  };

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200">
      <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-amber-50">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-amber-600" />
          <span className="font-bold text-amber-800 text-sm">My Notes</span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 p-4">
        <textarea
          className="w-full h-full min-h-[300px] p-3 text-sm text-slate-700 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-amber-300 bg-amber-50/30"
          placeholder="Write your notes for this lesson..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>
      <div className="p-4 border-t border-slate-100">
        <Button
          onClick={save}
          disabled={saving || !note.trim()}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold"
        >
          {saving ? "Saving..." : "Save Note"}
        </Button>
      </div>
    </div>
  );
}

// ─── Main Page Component ───────────────────────────────────────────────
export default function CourseLearn() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [curriculum, setCurriculum] = useState<Chapter[]>([]);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [currentSubtopic, setCurrentSubtopic] = useState<Subtopic | null>(null);
  const [loading, setLoading] = useState(true);
  const [lessonLoading, setLessonLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  const [showNotes, setShowNotes] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseIcon, setCourseIcon] = useState("BookOpen");
  const [courseColor, setCourseColor] = useState("from-blue-500 to-cyan-500");
  const contentRef = useRef<HTMLDivElement>(null);

  const allSubtopics = curriculum.flatMap((c) => c.subtopics);
  const currentIdx = allSubtopics.findIndex((s) => s._id === currentSubtopic?._id);
  const prevSubtopic = currentIdx > 0 ? allSubtopics[currentIdx - 1] : null;
  const nextSubtopic = currentIdx < allSubtopics.length - 1 ? allSubtopics[currentIdx + 1] : null;
  const completedIds = new Set(enrollment?.completedSubtopics || []);
  const isCurrentDone = currentSubtopic ? completedIds.has(currentSubtopic._id) : false;

  const loadSubtopic = useCallback(async (id: string) => {
    setLessonLoading(true);
    try {
      const data = await courseApi.getSubtopic(id);
      setCurrentSubtopic(data);
      setSearchParams({ lesson: id }, { replace: true });
      contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    } catch {}
    setLessonLoading(false);
  }, [setSearchParams]);

  useEffect(() => {
    if (!slug) return;
    async function init() {
      setLoading(true);
      try {
        const [currData, courseData] = await Promise.all([
          courseApi.getCurriculum(slug!),
          courseApi.getBySlug(slug!),
        ]);
        setCurriculum(currData);
        setCourseTitle(courseData.title);
        setCourseIcon(courseData.icon || "BookOpen");
        setCourseColor(courseData.color || "from-blue-500 to-cyan-500");

        // Expand all chapters by default in learn mode
        setExpandedChapters(new Set(currData.map((c: Chapter) => c._id)));

        const token = localStorage.getItem("token");
        let enroll: Enrollment | null = null;
        if (token) {
          try {
            enroll = await enrollmentApi.getByCourse(slug!);
            setEnrollment(enroll);
          } catch (err: unknown) {
            const msg = (err as Error)?.message || "";
            if (msg === "Not enrolled" || msg === "Course not found") {
              navigate(`/courses/${slug}`);
              return;
            }
            // For network/server errors continue without enrollment data
          }
        }

        // Load initial lesson
        const lessonParam = searchParams.get("lesson");
        const allSts = currData.flatMap((c: Chapter) => c.subtopics);
        if (lessonParam) {
          await loadSubtopic(lessonParam);
        } else if (enroll?.completedSubtopics?.length) {
          const lastId = enroll.completedSubtopics[enroll.completedSubtopics.length - 1];
          const lastIdx = allSts.findIndex((s: Subtopic) => s._id === lastId);
          const nextSt = allSts[lastIdx + 1] || allSts[0];
          if (nextSt) await loadSubtopic(nextSt._id);
        } else if (allSts.length > 0) {
          await loadSubtopic(allSts[0]._id);
        }
      } catch (err: unknown) {
        const msg = (err as Error)?.message || "";
        if (!msg.includes("Failed to fetch") && !msg.includes("NetworkError")) {
          navigate(`/courses/${slug}`);
        }
      } finally {
        setLoading(false);
      }
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const handleMarkComplete = async () => {
    if (!currentSubtopic || !slug || isCurrentDone) return;
    setCompleting(true);
    try {
      const result = await enrollmentApi.markComplete(slug, currentSubtopic._id);
      setEnrollment((prev) =>
        prev
          ? { ...prev, completedSubtopics: result.completedSubtopics, progress: result.progress }
          : prev,
      );
      if (nextSubtopic) {
        setTimeout(() => loadSubtopic(nextSubtopic._id), 400);
      }
    } catch {}
    setCompleting(false);
  };

  const handleBookmark = async () => {
    if (!currentSubtopic || !slug) return;
    try {
      const result = await enrollmentApi.toggleBookmark(slug, currentSubtopic._id);
      setEnrollment((prev) => prev ? { ...prev, bookmarks: result.bookmarks } : prev);
    } catch {}
  };

  const isBookmarked = enrollment?.bookmarks?.includes(currentSubtopic?._id || "");
  const existingNote = enrollment?.notes?.find((n) => n.subtopicId === currentSubtopic?._id)?.content || "";

  const Icon = ICON_MAP[courseIcon] || BookOpen;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400 font-medium">Loading course...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 shadow-sm flex-shrink-0 z-40">
        <div className="h-14 px-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors flex-shrink-0"
            >
              <Menu className="w-4 h-4" />
            </button>

            <Link to={`/courses/${slug}`} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 transition-colors flex-shrink-0">
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${courseColor} flex items-center justify-center flex-shrink-0 shadow-sm`}>
              <Icon className="w-4 h-4 text-white" />
            </div>

            <span className="font-bold text-slate-800 text-sm truncate hidden sm:block">{courseTitle}</span>
          </div>

          {/* Center: progress */}
          <div className="flex-1 max-w-sm hidden md:block">
            <div className="flex items-center gap-3">
              <Progress value={enrollment?.progress || 0} className="h-2 flex-1" />
              <span className="text-xs font-bold text-slate-600 w-10 text-right flex-shrink-0">
                {enrollment?.progress || 0}%
              </span>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleBookmark}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                isBookmarked ? "text-yellow-500 bg-yellow-50 hover:bg-yellow-100" : "text-slate-400 hover:bg-slate-100"
              }`}
              title="Bookmark lesson"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-yellow-500" : ""}`} />
            </button>

            <button
              onClick={() => setShowNotes(!showNotes)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                showNotes ? "text-amber-500 bg-amber-50" : "text-slate-400 hover:bg-slate-100"
              }`}
              title="Notes"
            >
              <FileText className="w-4 h-4" />
            </button>

            <Link to="/dashboard">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-white font-bold text-xs">
                  {(localStorage.getItem("user") && JSON.parse(localStorage.getItem("user")!).name?.slice(0, 1)) || "S"}
                </span>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Body: Sidebar + Content */}
      <div className="flex flex-1 min-h-0 relative">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "w-72 xl:w-80" : "w-0"
          } flex-shrink-0 bg-white border-r border-slate-200 flex flex-col overflow-hidden transition-all duration-300 absolute inset-y-0 left-0 z-30 md:relative`}
        >
          {/* Sidebar header */}
          <div className="px-4 py-4 border-b border-slate-100 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-black text-slate-800 text-sm">Course Content</h2>
              <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-slate-600 md:hidden">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={enrollment?.progress || 0} className="h-1.5 flex-1" />
              <span className="text-xs text-slate-500 font-medium flex-shrink-0">
                {completedIds.size}/{allSubtopics.length}
              </span>
            </div>
          </div>

          {/* Chapters */}
          <div className="flex-1 overflow-y-auto py-2">
            {curriculum.map((chapter) => {
              const chapterDone = chapter.subtopics.filter((s) => completedIds.has(s._id)).length;
              const isExpanded = expandedChapters.has(chapter._id);

              return (
                <div key={chapter._id}>
                  {/* Chapter header */}
                  <button
                    onClick={() => {
                      const next = new Set(expandedChapters);
                      if (isExpanded) next.delete(chapter._id);
                      else next.add(chapter._id);
                      setExpandedChapters(next);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-3 hover:bg-slate-50 transition-colors text-left"
                  >
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 text-[10px] font-black ${
                      chapterDone === chapter.subtopics.length && chapter.subtopics.length > 0
                        ? "bg-green-500 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}>
                      {chapterDone === chapter.subtopics.length && chapter.subtopics.length > 0
                        ? <Check className="w-3 h-3" />
                        : chapter.order}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-700 truncate">{chapter.title}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {chapterDone}/{chapter.subtopics.length} done
                      </p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    )}
                  </button>

                  {/* Lessons */}
                  {isExpanded && (
                    <div className="ml-6 border-l-2 border-slate-100">
                      {chapter.subtopics.map((subtopic) => {
                        const isCurrent = subtopic._id === currentSubtopic?._id;
                        const isDone = completedIds.has(subtopic._id);

                        return (
                          <button
                            key={subtopic._id}
                            onClick={() => { loadSubtopic(subtopic._id); setSidebarOpen(window.innerWidth >= 768 || sidebarOpen); }}
                            className={`w-full flex items-center gap-2.5 pl-4 pr-3 py-2.5 text-left transition-all group ${
                              isCurrent
                                ? "bg-blue-50 border-r-2 border-blue-500"
                                : "hover:bg-slate-50"
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                              isDone
                                ? "bg-green-500"
                                : isCurrent
                                ? "bg-blue-500"
                                : "bg-slate-200"
                            }`}>
                              {isDone ? (
                                <Check className="w-3 h-3 text-white" />
                              ) : isCurrent ? (
                                <Play className="w-2.5 h-2.5 text-white fill-white" />
                              ) : (
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs font-medium truncate leading-snug ${
                                isCurrent ? "text-blue-700 font-bold" : isDone ? "text-green-700" : "text-slate-600"
                              }`}>
                                {subtopic.title}
                              </p>
                              <p className="text-[10px] text-slate-400 mt-0.5">{subtopic.estimatedReadTime} min</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Content Area */}
        <main
          ref={contentRef}
          className="flex-1 overflow-y-auto bg-slate-50"
        >
          {lessonLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-slate-500 text-sm">Loading lesson...</p>
              </div>
            </div>
          ) : currentSubtopic ? (
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
              {/* Lesson header */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3 text-sm text-slate-500">
                  <span className="font-medium">
                    {curriculum.find((c) => c.subtopics.some((s) => s._id === currentSubtopic._id))?.title}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span className="text-slate-400">Lesson {currentIdx + 1} of {allSubtopics.length}</span>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                    {currentSubtopic.title}
                  </h1>
                  {isCurrentDone && (
                    <Badge className="bg-green-100 text-green-700 border-green-200 flex-shrink-0 gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {currentSubtopic.estimatedReadTime} min read
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" />
                    Lesson {currentIdx + 1}
                  </span>
                  {currentSubtopic.isFreePreview && (
                    <Badge className="bg-blue-50 text-blue-600 border-blue-200 text-xs">
                      Free Preview
                    </Badge>
                  )}
                </div>

                {currentSubtopic.summary && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl">
                    <p className="text-slate-600 text-sm leading-relaxed italic">
                      {currentSubtopic.summary}
                    </p>
                  </div>
                )}
              </div>

              {/* Article content */}
              <ContentRenderer key={currentSubtopic._id} blocks={currentSubtopic.content || []} />

              {/* Action bar */}
              <div className="mt-12 pt-6 border-t border-slate-200">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {!isCurrentDone ? (
                    <Button
                      onClick={handleMarkComplete}
                      disabled={completing}
                      className="flex-1 h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold gap-2 shadow-lg hover:shadow-xl transition-all"
                    >
                      {completing ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5" />
                      )}
                      Mark as Complete
                    </Button>
                  ) : (
                    <div className="flex-1 h-12 bg-green-50 border border-green-200 rounded-xl flex items-center justify-center gap-2 text-green-700 font-bold">
                      <Trophy className="w-5 h-5 text-green-500" />
                      Lesson Complete!
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      disabled={!prevSubtopic}
                      onClick={() => prevSubtopic && loadSubtopic(prevSubtopic._id)}
                      className="flex-1 sm:flex-none gap-1.5 font-semibold"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span className="hidden sm:inline">Previous</span>
                    </Button>
                    <Button
                      disabled={!nextSubtopic}
                      onClick={() => nextSubtopic && loadSubtopic(nextSubtopic._id)}
                      className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white gap-1.5 font-semibold"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Progress bar + stats */}
                <div className="mt-5 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-700">Course Progress</span>
                    <span className="text-sm font-bold text-blue-600">{enrollment?.progress || 0}%</span>
                  </div>
                  <Progress value={enrollment?.progress || 0} className="h-3" />
                  <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
                    <span>{completedIds.size} of {allSubtopics.length} lessons</span>
                    {enrollment?.progress === 100 && (
                      <span className="flex items-center gap-1 text-green-600 font-bold">
                        <Flame className="w-3.5 h-3.5" /> Course complete!
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <BookOpen className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-500">Select a lesson to start learning</p>
              </div>
            </div>
          )}
        </main>

        {/* Notes Panel */}
        {showNotes && currentSubtopic && (
          <NotesPanel
            courseSlug={slug!}
            subtopicId={currentSubtopic._id}
            existingNote={existingNote}
            onSave={(content) => {
              setEnrollment((prev) =>
                prev
                  ? {
                      ...prev,
                      notes: [
                        ...prev.notes.filter((n) => n.subtopicId !== currentSubtopic._id),
                        { subtopicId: currentSubtopic._id, content, _id: Date.now().toString() },
                      ],
                    }
                  : prev,
              );
            }}
            onClose={() => setShowNotes(false)}
          />
        )}
      </div>

      {/* Mobile bottom bar for progress */}
      <div className="md:hidden flex-shrink-0 bg-white border-t border-slate-200 px-4 py-2">
        <div className="flex items-center gap-3">
          <Progress value={enrollment?.progress || 0} className="h-2 flex-1" />
          <span className="text-xs font-bold text-slate-600 flex-shrink-0">
            {completedIds.size}/{allSubtopics.length}
          </span>
          <button
            onClick={handleMarkComplete}
            disabled={!currentSubtopic || isCurrentDone || completing}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isCurrentDone
                ? "bg-green-100 text-green-700"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            {isCurrentDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : "Done"}
          </button>
        </div>
      </div>
    </div>
  );
}
