import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setError("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("All fields are required.");
      return;
    }
    const result = login(form);
    if (result.error) {
      setError(result.error);
    } else {
      navigate(redirect);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6 no-underline">
            <img src="/logo.svg" alt="Land-it" className="w-12 h-12 rounded-xl shadow-sm mx-auto" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-sm text-[#222]/50 mt-1">
            Sign in to continue competing
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass-card-strong rounded-2xl p-6 space-y-4">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-[#222]/70 mb-1.5 block">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#222]/30" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="jane@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/50 border border-black/8 text-sm focus:outline-none focus:border-[#222]/20 focus:ring-2 focus:ring-[#222]/5 transition placeholder:text-[#222]/30"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-[#222]/70 mb-1.5 block">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#222]/30" />
              <input
                type="password"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                placeholder="Your password"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/50 border border-black/8 text-sm focus:outline-none focus:border-[#222]/20 focus:ring-2 focus:ring-[#222]/5 transition placeholder:text-[#222]/30"
              />
            </div>
          </div>

          <button type="submit" className="glass-btn glass-btn-md w-full mt-2">
            Sign In
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-sm text-[#222]/50 mt-5">
          Don't have an account?{" "}
          <Link
            to={`/signup${redirect !== "/" ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}
            className="text-[#222] font-medium no-underline hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
