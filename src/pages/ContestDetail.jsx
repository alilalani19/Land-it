import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  DollarSign,
  CheckCircle2,
  Send,
  Trophy,
  Star,
} from "lucide-react";
import { useContests } from "../context/ContestContext";
import { useAuth } from "../context/AuthContext";
import SubmitModal from "../components/SubmitModal";

const difficultyColors = {
  Junior: "bg-green-100 text-green-700",
  Mid: "bg-blue-100 text-blue-700",
  Senior: "bg-amber-100 text-amber-700",
  Expert: "bg-red-100 text-red-700",
};

const statusStyles = {
  Hired: "bg-green-100 text-green-700",
  "In Review": "bg-amber-100 text-amber-700",
  Submitted: "bg-blue-100 text-blue-700",
};

export default function ContestDetail() {
  const { id } = useParams();
  const { contests } = useContests();
  const { user } = useAuth();
  const navigate = useNavigate();
  const contest = contests.find((c) => c.id === id);

  const [tab, setTab] = useState("details");
  const [showModal, setShowModal] = useState(false);

  function handleSubmitClick() {
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(`/contest/${id}`)}`);
      return;
    }
    setShowModal(true);
  }

  if (!contest) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Contest not found</h2>
        <Link to="/" className="text-sm text-[#222]/60 hover:text-[#222] underline">
          Back to home
        </Link>
      </div>
    );
  }

  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(contest.deadline) - new Date()) / 86400000)
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Back */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-[#222]/50 hover:text-[#222] transition no-underline mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to challenges
      </Link>

      {/* Header Banner */}
      <div className="glass-card-strong rounded-2xl p-6 sm:p-8 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <img
              src={contest.logo}
              alt={contest.company}
              className="w-14 h-14 rounded-xl object-contain bg-white p-2 border border-black/5 shrink-0"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <p className="text-sm font-medium text-[#222]/50">
                  {contest.company}
                </p>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                    difficultyColors[contest.difficulty] || ""
                  }`}
                >
                  {contest.difficulty}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight leading-tight">
                {contest.title}
              </h1>
              <p className="text-sm text-[#222]/50 mt-0.5">{contest.role}</p>
            </div>
          </div>

          <button onClick={handleSubmitClick} className="glass-btn glass-btn-md shrink-0 self-start">
            <Send className="w-4 h-4" />
            Submit Solution
          </button>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-5 mt-6 pt-5 border-t border-black/5">
          <div className="flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-[#222]/40" />
            <span className="text-sm font-bold">{contest.prize}</span>
            <span className="text-xs text-[#222]/40">Prize</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#222]/40" />
            <span className="text-sm font-bold">{daysLeft}d</span>
            <span className="text-xs text-[#222]/40">Remaining</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-[#222]/40" />
            <span className="text-sm font-bold">{contest.leaderboard?.length || 0}</span>
            <span className="text-xs text-[#222]/40">Submissions</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-[#222]/5 p-1 rounded-xl w-fit">
        {["details", "leaderboard"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition capitalize ${
              tab === t
                ? "bg-white shadow-sm text-[#222]"
                : "text-[#222]/50 hover:text-[#222]"
            }`}
          >
            {t === "details" ? "Challenge Details" : "Leaderboard"}
          </button>
        ))}
      </div>

      {/* Details Tab */}
      {tab === "details" && (
        <div className="space-y-6">
          {/* Description */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Star className="w-4 h-4 text-[#222]/40" />
              Description
            </h3>
            <p className="text-sm text-[#222]/70 leading-relaxed whitespace-pre-line">
              {contest.description}
            </p>
          </div>

          {/* Deliverables */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Deliverables
            </h3>
            <ul className="space-y-2">
              {contest.deliverables?.map((d, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-[#222]/70">
                  <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {d}
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-sm font-semibold mb-3">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {contest.techStack.map((tech) => (
                <span
                  key={tech}
                  className="text-sm font-medium px-3 py-1.5 rounded-xl bg-[#222]/5 text-[#222]/70"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Evaluation Criteria */}
          {contest.evaluationCriteria && (
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-sm font-semibold mb-3">Evaluation Criteria</h3>
              <ul className="space-y-2">
                {contest.evaluationCriteria.map((c, i) => (
                  <li key={i} className="text-sm text-[#222]/70">
                    &bull; {c}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Leaderboard Tab */}
      {tab === "leaderboard" && (
        <div className="glass-card rounded-2xl overflow-hidden">
          {contest.leaderboard?.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="border-b border-black/5 text-left">
                  <th className="px-6 py-3 text-xs font-semibold text-[#222]/40 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-[#222]/40 uppercase tracking-wider">
                    Candidate
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-[#222]/40 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-[#222]/40 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {contest.leaderboard.map((entry, i) => (
                  <tr
                    key={i}
                    className="border-b border-black/[0.03] last:border-0 hover:bg-white/30 transition"
                  >
                    <td className="px-6 py-4">
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                          i === 0
                            ? "bg-amber-100 text-amber-700"
                            : i === 1
                            ? "bg-gray-100 text-gray-600"
                            : i === 2
                            ? "bg-orange-100 text-orange-700"
                            : "bg-[#222]/5 text-[#222]/50"
                        }`}
                      >
                        {i + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full gradient-accent flex items-center justify-center text-white text-xs font-bold">
                          {entry.avatar}
                        </div>
                        <span className="text-sm font-medium">{entry.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 max-w-[120px] h-2 bg-[#222]/5 rounded-full overflow-hidden">
                          <div
                            className="h-full gradient-accent rounded-full"
                            style={{ width: `${entry.score}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold w-8">
                          {entry.score}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                          statusStyles[entry.status] || ""
                        }`}
                      >
                        {entry.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12">
              <Trophy className="w-10 h-10 text-[#222]/20 mx-auto mb-3" />
              <p className="text-sm text-[#222]/40">No submissions yet. Be the first!</p>
            </div>
          )}
        </div>
      )}

      {/* Submit Modal */}
      {showModal && (
        <SubmitModal
          onClose={() => setShowModal(false)}
          contestId={contest.id}
          contestTitle={contest.title}
        />
      )}
    </div>
  );
}
