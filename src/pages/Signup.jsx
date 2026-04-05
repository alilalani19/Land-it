import { useState, useId } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { User, Mail, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Checkbox } from "@/components/ui/checkbox";

export default function Signup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const { user, signup } = useAuth();

  if (user) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [agreedTos, setAgreedTos] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const [error, setError] = useState("");

  const tosId = useId();
  const privacyId = useId();

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setError("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError("All fields are required.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (!agreedTos || !agreedPrivacy) {
      setError("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }
    const result = signup(form);
    if (result.error) {
      setError(result.error);
    } else {
      navigate(redirect);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6 no-underline">
            <img src="/logo.svg" alt="Land-it" className="w-12 h-12 rounded-xl shadow-sm mx-auto" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
          <p className="text-sm text-[#222]/50 mt-1">
            Start competing in technical challenges
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card-strong rounded-2xl p-6 space-y-4">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-[#222]/70 mb-1.5 block">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#222]/30" />
              <input type="text" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Jane Smith" className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/50 border border-black/8 text-sm focus:outline-none focus:border-[#222]/20 focus:ring-2 focus:ring-[#222]/5 transition placeholder:text-[#222]/30" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-[#222]/70 mb-1.5 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#222]/30" />
              <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="jane@example.com" className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/50 border border-black/8 text-sm focus:outline-none focus:border-[#222]/20 focus:ring-2 focus:ring-[#222]/5 transition placeholder:text-[#222]/30" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-[#222]/70 mb-1.5 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#222]/30" />
              <input type="password" value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="At least 6 characters" className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/50 border border-black/8 text-sm focus:outline-none focus:border-[#222]/20 focus:ring-2 focus:ring-[#222]/5 transition placeholder:text-[#222]/30" />
            </div>
          </div>

          {/* Legal checkboxes */}
          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-2.5">
              <Checkbox
                id={tosId}
                checked={agreedTos}
                onCheckedChange={setAgreedTos}
                className="mt-0.5"
              />
              <label htmlFor={tosId} className="text-xs text-[#222]/60 leading-relaxed cursor-pointer">
                I have read and agree to the{" "}
                <Link to="/terms" target="_blank" className="text-[#222] font-medium no-underline hover:underline">
                  Terms of Service
                </Link>
              </label>
            </div>

            <div className="flex items-start gap-2.5">
              <Checkbox
                id={privacyId}
                checked={agreedPrivacy}
                onCheckedChange={setAgreedPrivacy}
                className="mt-0.5"
              />
              <label htmlFor={privacyId} className="text-xs text-[#222]/60 leading-relaxed cursor-pointer">
                I have read and acknowledge the{" "}
                <Link to="/privacy" target="_blank" className="text-[#222] font-medium no-underline hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>
          </div>

          <button type="submit" className="glass-btn glass-btn-md w-full mt-2">
            Create Account
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-sm text-[#222]/50 mt-5">
          Already have an account?{" "}
          <Link to={`/login${redirect !== "/" ? `?redirect=${encodeURIComponent(redirect)}` : ""}`} className="text-[#222] font-medium no-underline hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
