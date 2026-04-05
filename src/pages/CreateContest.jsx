import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import {
  Sparkles,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Rocket,
  PenLine,
  X,
  Plus,
  DollarSign,
} from "lucide-react";
import { generateChallenge } from "../services/ai";
import { useContests } from "../context/ContestContext";
import { useAuth } from "../context/AuthContext";
import { CreditCard, PartyPopper, ArrowRight, Eye } from "lucide-react";

const difficulties = ["Junior", "Mid", "Senior", "Expert"];
const inputClass =
  "w-full px-4 py-3 rounded-xl bg-white/50 border border-black/8 text-sm focus:outline-none focus:border-[#222]/20 focus:ring-2 focus:ring-[#222]/5 transition placeholder:text-[#222]/30";

export default function CreateContest() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addContest } = useContests();
  const { user } = useAuth();

  // "choose" | "ai-basics" | "edit" | "confirmed"
  const [step, setStep] = useState("choose");
  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState(false);
  const [publishedId, setPublishedId] = useState(null);

  const [form, setForm] = useState({
    company: "",
    role: "",
    difficulty: "Mid",
    topic: "",
  });

  const [challenge, setChallenge] = useState({
    title: "",
    description: "",
    deliverables: [""],
    techStack: [""],
    evaluationCriteria: [""],
    prize: "",
  });

  function updateForm(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function updateChallenge(field, value) {
    setChallenge((c) => ({ ...c, [field]: value }));
  }

  function updateListItem(field, index, value) {
    setChallenge((c) => {
      const list = [...c[field]];
      list[index] = value;
      return { ...c, [field]: list };
    });
  }

  function addListItem(field) {
    setChallenge((c) => ({ ...c, [field]: [...c[field], ""] }));
  }

  function removeListItem(field, index) {
    setChallenge((c) => ({
      ...c,
      [field]: c[field].filter((_, i) => i !== index),
    }));
  }

  function handleManual() {
    setStep("edit");
  }

  function handleAiStart() {
    setStep("ai-basics");
  }

  async function handleGenerate() {
    setLoading(true);
    try {
      const result = await generateChallenge(form);
      setChallenge({
        title: result.title || "",
        description: result.description || "",
        deliverables: result.deliverables?.length ? result.deliverables : [""],
        techStack: result.techStack?.length ? result.techStack : [""],
        evaluationCriteria: result.evaluationCriteria?.length ? result.evaluationCriteria : [""],
        prize: result.prize || "",
      });
      setStep("edit");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function publishContest() {
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 30);

    const cleanList = (arr) => arr.filter((s) => s.trim());

    addContest(
      {
        company: form.company,
        logo: `https://logo.clearbit.com/${form.company.toLowerCase().replace(/\s+/g, "")}.com`,
        role: form.role,
        difficulty: form.difficulty,
        title: challenge.title,
        description: challenge.description,
        techStack: cleanList(challenge.techStack),
        prize: challenge.prize,
        deadline: deadline.toISOString().split("T")[0],
        deliverables: cleanList(challenge.deliverables),
        evaluationCriteria: cleanList(challenge.evaluationCriteria),
      },
      user?.id
    );

    navigate("/");
  }

  async function handlePayAndPublish() {
    setPaying(true);
    try {
      // Save challenge data to sessionStorage so we can restore after redirect
      sessionStorage.setItem("landit_pending_challenge", JSON.stringify({ form, challenge }));

      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengeData: {
            title: challenge.title,
            company: form.company,
          },
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("No checkout URL returned");
        setPaying(false);
      }
    } catch (err) {
      console.error("Payment error:", err);
      setPaying(false);
    }
  }

  // Handle return from Stripe Checkout
  useEffect(() => {
    const payment = searchParams.get("payment");
    if (payment === "success") {
      const saved = sessionStorage.getItem("landit_pending_challenge");
      if (saved) {
        try {
          const { form: savedForm, challenge: savedChallenge } = JSON.parse(saved);
          sessionStorage.removeItem("landit_pending_challenge");
          const deadline = new Date();
          deadline.setDate(deadline.getDate() + 30);
          const cleanList = (arr) => arr.filter((s) => s.trim());
          const newId = addContest(
            {
              company: savedForm.company,
              logo: `https://logo.clearbit.com/${savedForm.company.toLowerCase().replace(/\s+/g, "")}.com`,
              role: savedForm.role,
              difficulty: savedForm.difficulty,
              title: savedChallenge.title,
              description: savedChallenge.description,
              techStack: cleanList(savedChallenge.techStack),
              prize: savedChallenge.prize,
              deadline: deadline.toISOString().split("T")[0],
              deliverables: cleanList(savedChallenge.deliverables),
              evaluationCriteria: cleanList(savedChallenge.evaluationCriteria),
            },
            user?.id
          );
          setForm(savedForm);
          setChallenge(savedChallenge);
          setPublishedId(newId);
          setStep("confirmed");
        } catch (e) {
          console.error("Failed to restore challenge data:", e);
        }
      }
    }
  }, [searchParams]);

  const canGenerate = form.company && form.role && form.topic;
  const canPublish =
    form.company &&
    form.role &&
    challenge.title &&
    challenge.description &&
    challenge.prize;

  // Step indicator
  const stepNum = step === "choose" ? 1 : step === "ai-basics" ? 1 : 2;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      {/* Progress */}
      <div className="flex items-center gap-3 mb-10">
        <div
          className={`flex items-center gap-2 text-sm font-medium ${
            stepNum === 1 ? "text-[#222]" : "text-[#222]/40"
          }`}
        >
          <span
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              stepNum === 1 ? "gradient-accent text-white" : "bg-[#222]/10 text-[#222]/50"
            }`}
          >
            1
          </span>
          Setup
        </div>
        <div className="flex-1 h-px bg-[#222]/10" />
        <div
          className={`flex items-center gap-2 text-sm font-medium ${
            stepNum === 2 ? "text-[#222]" : "text-[#222]/40"
          }`}
        >
          <span
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              stepNum === 2 ? "gradient-accent text-white" : "bg-[#222]/10 text-[#222]/50"
            }`}
          >
            2
          </span>
          Challenge Details
        </div>
      </div>

      {/* Step: Choose method */}
      {step === "choose" && (
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            Create a Challenge
          </h1>
          <p className="text-[#222]/50 mb-8">
            Choose how you'd like to build your hiring challenge.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={handleManual}
              className="glass-card rounded-2xl p-6 text-left hover-glow cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#222]/5 flex items-center justify-center mb-4 group-hover:bg-[#222]/10 transition">
                <PenLine className="w-5 h-5 text-[#222]/60" />
              </div>
              <h3 className="text-base font-semibold mb-1">Write it myself</h3>
              <p className="text-sm text-[#222]/50">
                Fill in the title, description, tech stack, deliverables, and evaluation criteria manually.
              </p>
            </button>

            <button
              onClick={handleAiStart}
              className="glass-card rounded-2xl p-6 text-left hover-glow cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#222]/5 flex items-center justify-center mb-4 group-hover:bg-[#222]/10 transition">
                <Sparkles className="w-5 h-5 text-[#222]/60" />
              </div>
              <h3 className="text-base font-semibold mb-1">Generate with AI</h3>
              <p className="text-sm text-[#222]/50">
                Give us a few details and AI will draft the full challenge. You can edit everything after.
              </p>
            </button>
          </div>
        </div>
      )}

      {/* Step: AI basics */}
      {step === "ai-basics" && (
        <div>
          <button
            onClick={() => setStep("choose")}
            className="flex items-center gap-1.5 text-sm text-[#222]/50 hover:text-[#222] transition mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            AI-Assisted Setup
          </h1>
          <p className="text-[#222]/50 mb-8">
            Provide the basics and AI will generate a full challenge draft you can edit.
          </p>

          <div className="flex flex-col gap-5">
            <div>
              <label className="text-sm font-medium text-[#222]/70 mb-1.5 block">Company Name</label>
              <input type="text" value={form.company} onChange={(e) => updateForm("company", e.target.value)} placeholder="e.g. Acme Corp" className={inputClass} />
            </div>
            <div>
              <label className="text-sm font-medium text-[#222]/70 mb-1.5 block">Hiring Role</label>
              <input type="text" value={form.role} onChange={(e) => updateForm("role", e.target.value)} placeholder="e.g. Senior Frontend Engineer" className={inputClass} />
            </div>
            <div>
              <label className="text-sm font-medium text-[#222]/70 mb-2 block">Difficulty Level</label>
              <div className="flex gap-2">
                {difficulties.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => updateForm("difficulty", d)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                      form.difficulty === d
                        ? "gradient-accent text-white shadow-sm"
                        : "bg-white/50 border border-black/8 text-[#222]/60 hover:border-black/15"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-[#222]/70 mb-1.5 block">Topic / Focus</label>
              <input type="text" value={form.topic} onChange={(e) => updateForm("topic", e.target.value)} placeholder="e.g. Real-time dashboard with WebSockets" className={inputClass} />
            </div>
            <button onClick={handleGenerate} disabled={!canGenerate || loading} className="glass-btn glass-btn-lg w-full mt-4">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate with AI
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step: Edit / Manual — full editable form */}
      {step === "edit" && (
        <div>
          <button
            onClick={() => setStep("choose")}
            className="flex items-center gap-1.5 text-sm text-[#222]/50 hover:text-[#222] transition mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Start over
          </button>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            Challenge Details
          </h1>
          <p className="text-[#222]/50 mb-8">
            Fill in or edit all the details for your hiring challenge.
          </p>

          <div className="flex flex-col gap-6">
            {/* Basics section */}
            <div className="glass-card rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-semibold text-[#222]/80">Basics</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-[#222]/70 mb-1.5 block">Company Name</label>
                  <input type="text" value={form.company} onChange={(e) => updateForm("company", e.target.value)} placeholder="e.g. Acme Corp" className={inputClass} />
                </div>
                <div>
                  <label className="text-sm font-medium text-[#222]/70 mb-1.5 block">Hiring Role</label>
                  <input type="text" value={form.role} onChange={(e) => updateForm("role", e.target.value)} placeholder="e.g. Senior Frontend Engineer" className={inputClass} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-[#222]/70 mb-2 block">Difficulty</label>
                <div className="flex gap-2">
                  {difficulties.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => updateForm("difficulty", d)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                        form.difficulty === d
                          ? "gradient-accent text-white shadow-sm"
                          : "bg-white/50 border border-black/8 text-[#222]/60 hover:border-black/15"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Title & Description */}
            <div className="glass-card rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-semibold text-[#222]/80">Challenge Content</h3>
              <div>
                <label className="text-sm font-medium text-[#222]/70 mb-1.5 block">Challenge Title</label>
                <input type="text" value={challenge.title} onChange={(e) => updateChallenge("title", e.target.value)} placeholder="e.g. Build a Real-Time Collaborative Editor" className={inputClass} />
              </div>
              <div>
                <label className="text-sm font-medium text-[#222]/70 mb-1.5 block">Description</label>
                <textarea
                  value={challenge.description}
                  onChange={(e) => updateChallenge("description", e.target.value)}
                  rows={5}
                  placeholder="Describe what candidates need to build, the context, and what you're looking for..."
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-[#222]/70 mb-1.5 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5" />
                    Prize Pool
                  </label>
                  <input type="text" value={challenge.prize} onChange={(e) => updateChallenge("prize", e.target.value)} placeholder="e.g. $10,000" className={inputClass} />
                </div>
              </div>
            </div>

            {/* Tech Stack */}
            <div className="glass-card rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#222]/80">Tech Stack</h3>
                <button
                  type="button"
                  onClick={() => addListItem("techStack")}
                  className="text-xs text-[#222]/50 hover:text-[#222] transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {challenge.techStack.map((tech, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <input
                      type="text"
                      value={tech}
                      onChange={(e) => updateListItem("techStack", i, e.target.value)}
                      placeholder="e.g. React"
                      className="px-3 py-2 rounded-lg bg-white/50 border border-black/8 text-sm focus:outline-none focus:border-[#222]/20 focus:ring-2 focus:ring-[#222]/5 transition placeholder:text-[#222]/30 w-32"
                    />
                    {challenge.techStack.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeListItem("techStack", i)}
                        className="p-1 text-[#222]/30 hover:text-red-500 transition"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Deliverables */}
            <div className="glass-card rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#222]/80">Deliverables</h3>
                <button
                  type="button"
                  onClick={() => addListItem("deliverables")}
                  className="text-xs text-[#222]/50 hover:text-[#222] transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
              <div className="space-y-2">
                {challenge.deliverables.map((d, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-3 shrink-0" />
                    <input
                      type="text"
                      value={d}
                      onChange={(e) => updateListItem("deliverables", i, e.target.value)}
                      placeholder={`Deliverable ${i + 1}`}
                      className={`flex-1 ${inputClass}`}
                    />
                    {challenge.deliverables.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeListItem("deliverables", i)}
                        className="p-1 mt-2.5 text-[#222]/30 hover:text-red-500 transition"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Evaluation Criteria */}
            <div className="glass-card rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#222]/80">Evaluation Criteria</h3>
                <button
                  type="button"
                  onClick={() => addListItem("evaluationCriteria")}
                  className="text-xs text-[#222]/50 hover:text-[#222] transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
              <div className="space-y-2">
                {challenge.evaluationCriteria.map((c, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-sm text-[#222]/40 mt-3 shrink-0 w-5 text-center">
                      {i + 1}.
                    </span>
                    <input
                      type="text"
                      value={c}
                      onChange={(e) => updateListItem("evaluationCriteria", i, e.target.value)}
                      placeholder={`Criterion ${i + 1}`}
                      className={`flex-1 ${inputClass}`}
                    />
                    {challenge.evaluationCriteria.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeListItem("evaluationCriteria", i)}
                        className="p-1 mt-2.5 text-[#222]/30 hover:text-red-500 transition"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Pay & Publish */}
            <button
              onClick={handlePayAndPublish}
              disabled={!canPublish || paying}
              className="glass-btn glass-btn-lg w-full mt-2"
            >
              {paying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Redirecting to payment...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  Publish Challenge — $54.99
                </>
              )}
            </button>
            <p className="text-xs text-[#222]/40 text-center mt-3">
              Secure payment via Stripe. Your challenge goes live immediately after payment.
            </p>
          </div>
        </div>
      )}

      {/* Step: Confirmation */}
      {step === "confirmed" && (
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full gradient-green flex items-center justify-center mx-auto mb-6">
            <PartyPopper className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            Challenge Published!
          </h1>
          <p className="text-[#222]/50 mb-2 max-w-md mx-auto">
            Your challenge is now live and visible to thousands of developers. Payment confirmed.
          </p>

          {/* Challenge summary card */}
          <div className="glass-card-strong rounded-2xl p-6 text-left mt-8 mb-8 max-w-lg mx-auto">
            <p className="text-xs font-semibold text-[#222]/40 uppercase tracking-wider mb-1">
              {form.company} &middot; {form.difficulty}
            </p>
            <h2 className="text-lg font-bold mb-1">{challenge.title}</h2>
            <p className="text-sm text-[#222]/50 mb-3">{form.role}</p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {challenge.techStack?.filter((t) => t.trim()).map((t) => (
                <span key={t} className="text-xs font-medium px-2.5 py-1 rounded-lg bg-[#222]/5 text-[#222]/70">
                  {t}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-black/5">
              <span className="text-sm font-bold">{challenge.prize}</span>
              <span className="text-xs text-[#222]/40">30 days remaining</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {publishedId && (
              <Link
                to={`/contest/${publishedId}`}
                className="glass-btn glass-btn-lg no-underline"
              >
                <Eye className="w-4 h-4" />
                View Challenge
              </Link>
            )}
            <Link
              to="/"
              className="glass-btn glass-btn-lg no-underline"
            >
              <ArrowRight className="w-4 h-4" />
              Back to Home
            </Link>
          </div>

          <p className="text-xs text-[#222]/40 mt-6">
            A receipt has been sent to your email via Stripe.
          </p>
        </div>
      )}
    </div>
  );
}
