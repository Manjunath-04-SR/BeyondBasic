import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store auth data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({
        id: data.user.id,
        name: data.user.username,
        email: data.user.email,
        role: data.user.role,
      }));

      // Redirect admin to dashboard, others to courses
      navigate(data.user.role === "admin" ? "/admin" : "/courses");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Login failed. Please try again.";
      setErrors({ general: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-10">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-white font-black text-lg">B</span>
            </div>
            <span className="text-slate-900 font-bold text-xl">Beyond Basic</span>
          </div>

          {/* Header */}
          <div className="text-center lg:text-left pl-1">
            <h2 className="text-3xl font-black text-slate-900 mb-2">Welcome back</h2>
            <p className="text-slate-500 font-medium">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary font-semibold hover:underline">
                Sign up for free
              </Link>
            </p>
          </div>

          {/* Form */}
          <Card className="border-border/50 shadow-lg shadow-slate-200/50 ring-0">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* General error */}
                {errors.general && (
                  <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 font-medium flex items-center gap-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.general}
                  </div>
                )}

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-semibold text-slate-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <Mail size={18} />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="student@beyondbasic.in"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`h-11 text-base pl-10 ring-0 focus-visible:ring-0 ${errors.email ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email}</p>}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-sm font-semibold text-slate-700">
                      Password
                    </label>
                    <Link to="/forgot-password" className="text-xs font-semibold text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <Lock size={18} />
                    </div>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className={`h-11 text-base pl-10 pr-10 ring-0 focus-visible:ring-0 ${errors.password ? "border-red-500" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-500 font-medium">{errors.password}</p>}
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 text-base font-bold text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Sign in
                      <ArrowRight size={18} />
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Demo credentials hint */}
          <div className="text-center text-xs text-slate-400 font-medium">
            Demo: student@beyondbasic.in &nbsp;/&nbsp; password123
          </div>
        </div>
      </div>

      {/* Right Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary via-blue-600 to-blue-700">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl" />
        </div>
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative z-10 flex flex-col justify-start w-full p-16">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <span className="text-white font-black text-xl">B</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">BeyondBasic</span>
          </div>

          <div className="space-y-6 mt-10">
            <h1 className="text-5xl font-black text-white leading-tight">
              Welcome Back!
              <br />
              <span className="text-blue-200">Let's Continue Learning</span>
            </h1>
            <p className="text-lg text-blue-100 font-medium max-w-md">
              Pick up where you left off. Track your progress, complete challenges, and ace your next interview.
            </p>

            <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-5 border border-white/10">
              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-white font-medium text-sm leading-relaxed">
                "The mock interviews and AI feedback helped me crack Amazon in just 3 months. The platform is exactly what every student needs."
              </p>
              <div className="flex items-center gap-3 mt-4">
                <div className="w-10 h-10 rounded-full bg-emerald-400 flex items-center justify-center text-white text-xs font-black">
                  RK
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Rahul Kumar</p>
                  <p className="text-blue-200 text-xs font-medium">SDE at Amazon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
