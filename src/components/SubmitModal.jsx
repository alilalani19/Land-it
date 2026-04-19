import { useState } from "react";
import { X, GitBranch, Send } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useContests } from "../context/ContestContext";

export default function SubmitModal({ onClose, contestId, contestTitle }) {
  const { user } = useAuth();
  const { addSubmission } = useContests();
  const [githubUrl, setGithubUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const result = await addSubmission({
      contestId,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      githubUrl,
      notes,
    });
    setSubmitting(false);
    if (result?.error) {
      setError(
        result.error.includes("duplicate")
          ? "You've already submitted to this challenge."
          : result.error
      );
      return;
    }
    setSubmitted(true);
    setTimeout(onClose, 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="glass-card-strong rounded-2xl p-6 sm:p-8 max-w-md w-full relative z-10 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-black/5 transition"
        >
          <X className="w-5 h-5 text-[#222]/50" />
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-14 h-14 gradient-green rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold font-[family-name:var(--font-display)] mb-2">
              Solution Submitted!
            </h3>
            <p className="text-sm text-[#222]/60">
              Your submission is being reviewed. Good luck!
            </p>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-bold font-[family-name:var(--font-display)] mb-1">
              Submit Solution
            </h3>
            <p className="text-sm text-[#222]/50 mb-6">{contestTitle}</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && (
                <div className="text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-xl">
                  {error}
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-[#222]/70 mb-1.5 block">
                  GitHub Repository URL
                </label>
                <div className="relative">
                  <GitBranch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#222]/30" />
                  <input
                    type="url"
                    required
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/you/project"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/50 border border-black/8 text-sm focus:outline-none focus:border-[#222]/20 focus:ring-2 focus:ring-[#222]/5 transition placeholder:text-[#222]/30"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-[#222]/70 mb-1.5 block">
                  Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Any notes about your approach..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/50 border border-black/8 text-sm focus:outline-none focus:border-[#222]/20 focus:ring-2 focus:ring-[#222]/5 transition placeholder:text-[#222]/30 resize-none"
                />
              </div>

              <button type="submit" disabled={submitting} className="glass-btn glass-btn-md w-full mt-2">
                <Send className="w-4 h-4" />
                {submitting ? "Submitting..." : "Submit Solution"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
