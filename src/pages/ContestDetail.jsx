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
  ExternalLink,
  FileText,
  Settings,
  Mail,
  Pencil,
  Trash2,
  X,
  Save,
  Plus,
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

const statusOptions = ["Submitted", "In Review", "Hired"];
const difficulties = ["Junior", "Mid", "Senior", "Expert"];

const inputClass =
  "w-full px-4 py-2.5 rounded-xl bg-white/50 border border-black/8 text-sm focus:outline-none focus:border-[#222]/20 focus:ring-2 focus:ring-[#222]/5 transition placeholder:text-[#222]/30";

export default function ContestDetail() {
  const { id } = useParams();
  const { contests, submissions, updateContest, deleteContest, updateSubmission } = useContests();
  const { user } = useAuth();
  const navigate = useNavigate();
  const contest = contests.find((c) => c.id === id);

  const [tab, setTab] = useState("details");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editForm, setEditForm] = useState(null);

  const isOwner = user && contest?.createdBy === user.id;
  const contestSubmissions = submissions.filter((s) => s.contestId === id);

  function handleSubmitClick() {
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(`/contest/${id}`)}`);
      return;
    }
    setShowModal(true);
  }

  function startEditing() {
    setEditForm({
      title: contest.title,
      description: contest.description,
      role: contest.role,
      difficulty: contest.difficulty,
      prize: contest.prize,
      techStack: [...(contest.techStack || [])],
      deliverables: [...(contest.deliverables || [])],
      evaluationCriteria: [...(contest.evaluationCriteria || [])],
    });
    setEditing(true);
  }

  async function saveEdits() {
    await updateContest(id, editForm);
    setEditing(false);
    setEditForm(null);
  }

  async function handleDelete() {
    await deleteContest(id);
    navigate("/");
  }

  async function handleScoreChange(subId, score) {
    const num = parseInt(score, 10);
    if (!isNaN(num) && num >= 0 && num <= 100) {
      await updateSubmission(subId, { score: num });
    }
  }

  async function handleStatusChange(subId, status) {
    await updateSubmission(subId, { status });
  }

  function updateEditList(field, index, value) {
    setEditForm((f) => {
      const list = [...f[field]];
      list[index] = value;
      return { ...f, [field]: list };
    });
  }

  function addEditListItem(field) {
    setEditForm((f) => ({ ...f, [field]: [...f[field], ""] }));
  }

  function removeEditListItem(field, index) {
    setEditForm((f) => ({ ...f, [field]: f[field].filter((_, i) => i !== index) }));
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

  const tabs = [
    { key: "details", label: "Challenge Details" },
    { key: "leaderboard", label: "Leaderboard" },
  ];
  if (isOwner) {
    tabs.push({ key: "submissions", label: `Submissions (${contestSubmissions.length})` });
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
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
              onError={(e) => { e.target.style.display = "none"; }}
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <p className="text-sm font-medium text-[#222]/50">{contest.company}</p>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${difficultyColors[contest.difficulty] || ""}`}>
                  {contest.difficulty}
                </span>
                {isOwner && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#222]/10 text-[#222]/70 flex items-center gap-1">
                    <Settings className="w-3 h-3" />
                    Your Challenge
                  </span>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight leading-tight">{contest.title}</h1>
              <p className="text-sm text-[#222]/50 mt-0.5">{contest.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start">
            {isOwner ? (
              <>
                <button onClick={startEditing} className="glass-btn glass-btn-sm">
                  <Pencil className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="glass-btn glass-btn-sm !text-red-600"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </>
            ) : (
              <button onClick={handleSubmitClick} className="glass-btn glass-btn-md">
                <Send className="w-4 h-4" />
                Submit Solution
              </button>
            )}
          </div>
        </div>

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
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
              tab === t.key ? "bg-white shadow-sm text-[#222]" : "text-[#222]/50 hover:text-[#222]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Details Tab */}
      {tab === "details" && (
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Star className="w-4 h-4 text-[#222]/40" />
              Description
            </h3>
            <p className="text-sm text-[#222]/70 leading-relaxed whitespace-pre-line">{contest.description}</p>
          </div>
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Deliverables
            </h3>
            <ul className="space-y-2">
              {contest.deliverables?.map((d, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-[#222]/70">
                  <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                  {d}
                </li>
              ))}
            </ul>
          </div>
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-sm font-semibold mb-3">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {contest.techStack.map((tech) => (
                <span key={tech} className="text-sm font-medium px-3 py-1.5 rounded-xl bg-[#222]/5 text-[#222]/70">{tech}</span>
              ))}
            </div>
          </div>
          {contest.evaluationCriteria && (
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-sm font-semibold mb-3">Evaluation Criteria</h3>
              <ul className="space-y-2">
                {contest.evaluationCriteria.map((c, i) => (
                  <li key={i} className="text-sm text-[#222]/70">&bull; {c}</li>
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
                  <th className="px-6 py-3 text-xs font-semibold text-[#222]/40 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-3 text-xs font-semibold text-[#222]/40 uppercase tracking-wider">Candidate</th>
                  <th className="px-6 py-3 text-xs font-semibold text-[#222]/40 uppercase tracking-wider">Score</th>
                  <th className="px-6 py-3 text-xs font-semibold text-[#222]/40 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {contest.leaderboard.map((entry, i) => (
                  <tr key={i} className="border-b border-black/[0.03] last:border-0 hover:bg-white/30 transition">
                    <td className="px-6 py-4">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        i === 0 ? "bg-amber-100 text-amber-700" : i === 1 ? "bg-gray-100 text-gray-600" : i === 2 ? "bg-orange-100 text-orange-700" : "bg-[#222]/5 text-[#222]/50"
                      }`}>{i + 1}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full gradient-accent flex items-center justify-center text-white text-xs font-bold">{entry.avatar}</div>
                        <span className="text-sm font-medium">{entry.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 max-w-[120px] h-2 bg-[#222]/5 rounded-full overflow-hidden">
                          <div className="h-full gradient-accent rounded-full" style={{ width: `${entry.score}%` }} />
                        </div>
                        <span className="text-sm font-bold w-8">{entry.score}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${statusStyles[entry.status] || ""}`}>{entry.status}</span>
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

      {/* Owner Submissions Tab */}
      {tab === "submissions" && isOwner && (
        <div>
          {contestSubmissions.length > 0 ? (
            <div className="space-y-3">
              {contestSubmissions.map((sub) => (
                <div key={sub.id} className="glass-card rounded-2xl p-5">
                  {/* Candidate header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full gradient-accent flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {sub.userName.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#222]">{sub.userName}</p>
                        {sub.userEmail && (
                          <a
                            href={`mailto:${sub.userEmail}`}
                            className="flex items-center gap-1 text-xs text-[#222]/50 hover:text-[#222] no-underline transition"
                          >
                            <Mail className="w-3 h-3" />
                            {sub.userEmail}
                          </a>
                        )}
                        <p className="text-xs text-[#222]/40">
                          {new Date(sub.submittedAt).toLocaleDateString("en-US", {
                            month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Score & Status controls */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <label className="text-xs text-[#222]/40">Score</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={sub.score ?? ""}
                          onChange={(e) => handleScoreChange(sub.id, e.target.value)}
                          placeholder="—"
                          className="w-16 px-2 py-1.5 rounded-lg bg-white/50 border border-black/8 text-sm text-center focus:outline-none focus:border-[#222]/20 focus:ring-2 focus:ring-[#222]/5 transition"
                        />
                      </div>
                      <select
                        value={sub.status}
                        onChange={(e) => handleStatusChange(sub.id, e.target.value)}
                        className="px-3 py-1.5 rounded-lg bg-white/50 border border-black/8 text-xs font-semibold focus:outline-none focus:border-[#222]/20 focus:ring-2 focus:ring-[#222]/5 transition"
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Submission details */}
                  <div className="mt-4 pt-3 border-t border-black/[0.04] space-y-2">
                    <a
                      href={sub.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-[#222]/70 hover:text-[#222] transition no-underline"
                    >
                      <ExternalLink className="w-4 h-4 shrink-0" />
                      {sub.githubUrl}
                    </a>
                    {sub.notes && (
                      <div className="flex items-start gap-2 text-sm text-[#222]/50">
                        <FileText className="w-4 h-4 shrink-0 mt-0.5" />
                        <p className="italic">"{sub.notes}"</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-12 text-center">
              <Send className="w-10 h-10 text-[#222]/15 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-1">No submissions yet</h3>
              <p className="text-sm text-[#222]/50">Share your challenge to start receiving solutions.</p>
            </div>
          )}
        </div>
      )}

      {/* Submit Modal */}
      {showModal && (
        <SubmitModal onClose={() => setShowModal(false)} contestId={contest.id} contestTitle={contest.title} />
      )}

      {/* Edit Modal */}
      {editing && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setEditing(false)} />
          <div className="glass-card-strong rounded-2xl p-6 sm:p-8 max-w-2xl w-full relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button onClick={() => setEditing(false)} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-black/5 transition">
              <X className="w-5 h-5 text-[#222]/50" />
            </button>

            <h3 className="text-xl font-bold font-[family-name:var(--font-display)] mb-6">Edit Challenge</h3>

            <div className="flex flex-col gap-5">
              <div>
                <label className="text-sm font-medium text-[#222]/70 mb-1.5 block">Challenge Title</label>
                <input type="text" value={editForm.title} onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))} className={inputClass} />
              </div>

              <div>
                <label className="text-sm font-medium text-[#222]/70 mb-1.5 block">Role</label>
                <input type="text" value={editForm.role} onChange={(e) => setEditForm((f) => ({ ...f, role: e.target.value }))} className={inputClass} />
              </div>

              <div>
                <label className="text-sm font-medium text-[#222]/70 mb-2 block">Difficulty</label>
                <div className="flex gap-2">
                  {difficulties.map((d) => (
                    <button key={d} type="button" onClick={() => setEditForm((f) => ({ ...f, difficulty: d }))}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition ${editForm.difficulty === d ? "gradient-accent text-white shadow-sm" : "bg-white/50 border border-black/8 text-[#222]/60 hover:border-black/15"}`}
                    >{d}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-[#222]/70 mb-1.5 block">Prize</label>
                <input type="text" value={editForm.prize} onChange={(e) => setEditForm((f) => ({ ...f, prize: e.target.value }))} className={inputClass} />
              </div>

              <div>
                <label className="text-sm font-medium text-[#222]/70 mb-1.5 block">Description</label>
                <textarea value={editForm.description} onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))} rows={5} className={`${inputClass} resize-none`} />
              </div>

              {/* Tech Stack */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-[#222]/70">Tech Stack</label>
                  <button type="button" onClick={() => addEditListItem("techStack")} className="text-xs text-[#222]/50 hover:text-[#222] flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {editForm.techStack.map((t, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <input type="text" value={t} onChange={(e) => updateEditList("techStack", i, e.target.value)} placeholder="e.g. React" className="px-3 py-2 rounded-lg bg-white/50 border border-black/8 text-sm w-32 focus:outline-none focus:border-[#222]/20 focus:ring-2 focus:ring-[#222]/5" />
                      {editForm.techStack.length > 1 && (
                        <button type="button" onClick={() => removeEditListItem("techStack", i)} className="p-1 text-[#222]/30 hover:text-red-500"><X className="w-3.5 h-3.5" /></button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Deliverables */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-[#222]/70">Deliverables</label>
                  <button type="button" onClick={() => addEditListItem("deliverables")} className="text-xs text-[#222]/50 hover:text-[#222] flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>
                <div className="space-y-2">
                  {editForm.deliverables.map((d, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input type="text" value={d} onChange={(e) => updateEditList("deliverables", i, e.target.value)} placeholder={`Deliverable ${i + 1}`} className={`flex-1 ${inputClass}`} />
                      {editForm.deliverables.length > 1 && (
                        <button type="button" onClick={() => removeEditListItem("deliverables", i)} className="p-1 text-[#222]/30 hover:text-red-500"><X className="w-3.5 h-3.5" /></button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Evaluation Criteria */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-[#222]/70">Evaluation Criteria</label>
                  <button type="button" onClick={() => addEditListItem("evaluationCriteria")} className="text-xs text-[#222]/50 hover:text-[#222] flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>
                <div className="space-y-2">
                  {editForm.evaluationCriteria.map((c, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input type="text" value={c} onChange={(e) => updateEditList("evaluationCriteria", i, e.target.value)} placeholder={`Criterion ${i + 1}`} className={`flex-1 ${inputClass}`} />
                      {editForm.evaluationCriteria.length > 1 && (
                        <button type="button" onClick={() => removeEditListItem("evaluationCriteria", i)} className="p-1 text-[#222]/30 hover:text-red-500"><X className="w-3.5 h-3.5" /></button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={saveEdits} className="glass-btn glass-btn-lg w-full mt-2">
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />
          <div className="glass-card-strong rounded-2xl p-6 sm:p-8 max-w-sm w-full relative z-10 shadow-2xl text-center">
            <Trash2 className="w-10 h-10 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2">Delete this challenge?</h3>
            <p className="text-sm text-[#222]/50 mb-6">
              This will permanently remove the challenge and all its submissions. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="glass-btn glass-btn-md flex-1">
                Cancel
              </button>
              <button onClick={handleDelete} className="glass-btn glass-btn-md flex-1 !text-red-600">
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
