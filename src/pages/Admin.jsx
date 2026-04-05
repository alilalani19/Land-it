import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Briefcase,
  Send,
  Sparkles,
  Mail,
  CalendarDays,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Shield,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useContests } from "../context/ContestContext";
import { getAiLogs } from "../services/ai";

const statusStyles = {
  Submitted: "bg-blue-100 text-blue-700",
  "In Review": "bg-amber-100 text-amber-700",
  Hired: "bg-green-100 text-green-700",
};

export default function Admin() {
  const { user, getAllUsers } = useAuth();
  const { contests, submissions } = useContests();
  const [tab, setTab] = useState("users");
  const [expandedUser, setExpandedUser] = useState(null);

  if (!user?.isAdmin) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <Shield className="w-12 h-12 text-[#222]/20 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-sm text-[#222]/50">You don't have permission to view this page.</p>
      </div>
    );
  }

  const allUsers = getAllUsers();
  const aiLogs = getAiLogs();

  function getUserContests(userId) {
    return contests.filter((c) => c.createdBy === userId);
  }

  function getUserSubmissions(userId) {
    return submissions.filter((s) => s.userId === userId);
  }

  function getUserAiLogs(userId) {
    return aiLogs.filter((l) => l.userId === userId);
  }

  const tabs = [
    { key: "users", label: `Users (${allUsers.length})`, icon: Users },
    { key: "challenges", label: `All Challenges (${contests.filter((c) => c.createdBy).length})`, icon: Briefcase },
    { key: "submissions", label: `All Submissions (${submissions.length})`, icon: Send },
    { key: "ai-logs", label: `AI Prompts (${aiLogs.length})`, icon: Sparkles },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="glass-card-strong rounded-2xl p-6 sm:p-8 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center text-white">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Admin Panel</h1>
            <p className="text-sm text-[#222]/50">
              {allUsers.length} users &middot; {submissions.length} submissions &middot; {aiLogs.length} AI prompts
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-[#222]/5 p-1 rounded-xl w-fit flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
              tab === t.key ? "bg-white shadow-sm text-[#222]" : "text-[#222]/50 hover:text-[#222]"
            }`}
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Users Tab */}
      {tab === "users" && (
        <div className="space-y-3">
          {allUsers.map((u) => {
            const uContests = getUserContests(u.id);
            const uSubmissions = getUserSubmissions(u.id);
            const uLogs = getUserAiLogs(u.id);
            const isExpanded = expandedUser === u.id;

            return (
              <div key={u.id} className="glass-card rounded-2xl overflow-hidden">
                <button
                  onClick={() => setExpandedUser(isExpanded ? null : u.id)}
                  className="w-full p-5 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full gradient-accent flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {u.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#222] flex items-center gap-2">
                        {u.name}
                        {u.isAdmin && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#222]/10 text-[#222]/60">ADMIN</span>
                        )}
                      </p>
                      <p className="text-xs text-[#222]/50 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {u.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <div className="flex items-center gap-3 text-xs text-[#222]/40">
                        <span>{uContests.length} challenges</span>
                        <span>{uSubmissions.length} submissions</span>
                        <span>{uLogs.length} prompts</span>
                      </div>
                      <p className="text-xs text-[#222]/30 flex items-center gap-1 justify-end mt-0.5">
                        <CalendarDays className="w-3 h-3" />
                        Joined {new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-[#222]/30" /> : <ChevronDown className="w-4 h-4 text-[#222]/30" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-black/5 pt-4 space-y-4">
                    {/* User's Challenges */}
                    <div>
                      <h4 className="text-xs font-semibold text-[#222]/40 uppercase tracking-wider mb-2">
                        Challenges Created ({uContests.length})
                      </h4>
                      {uContests.length > 0 ? (
                        <div className="space-y-2">
                          {uContests.map((c) => (
                            <Link key={c.id} to={`/contest/${c.id}`} className="no-underline block">
                              <div className="flex items-center justify-between p-3 rounded-xl bg-white/30 hover:bg-white/50 transition">
                                <div>
                                  <p className="text-sm font-medium text-[#222]">{c.title}</p>
                                  <p className="text-xs text-[#222]/40">{c.company} &middot; {c.role} &middot; {c.difficulty}</p>
                                </div>
                                <span className="text-sm font-bold text-[#222]/70">{c.prize}</span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-[#222]/30 italic">No challenges created</p>
                      )}
                    </div>

                    {/* User's Submissions */}
                    <div>
                      <h4 className="text-xs font-semibold text-[#222]/40 uppercase tracking-wider mb-2">
                        Submissions ({uSubmissions.length})
                      </h4>
                      {uSubmissions.length > 0 ? (
                        <div className="space-y-2">
                          {uSubmissions.map((s) => {
                            const contest = contests.find((c) => c.id === s.contestId);
                            return (
                              <div key={s.id} className="p-3 rounded-xl bg-white/30">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm font-medium text-[#222]">{contest?.title || "Unknown"}</p>
                                    <a href={s.githubUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-[#222]/50 hover:text-[#222] no-underline flex items-center gap-1 mt-0.5">
                                      <ExternalLink className="w-3 h-3" />
                                      {s.githubUrl}
                                    </a>
                                  </div>
                                  <div className="text-right">
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${statusStyles[s.status] || "bg-gray-100 text-gray-600"}`}>{s.status}</span>
                                    {s.score !== null && <p className="text-xs font-bold text-[#222]/60 mt-1">{s.score}/100</p>}
                                  </div>
                                </div>
                                {s.notes && <p className="text-xs text-[#222]/40 italic mt-2">"{s.notes}"</p>}
                                <p className="text-[10px] text-[#222]/30 mt-1">
                                  {new Date(s.submittedAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-xs text-[#222]/30 italic">No submissions</p>
                      )}
                    </div>

                    {/* User's AI Prompts */}
                    <div>
                      <h4 className="text-xs font-semibold text-[#222]/40 uppercase tracking-wider mb-2">
                        AI Prompts ({uLogs.length})
                      </h4>
                      {uLogs.length > 0 ? (
                        <div className="space-y-2">
                          {uLogs.map((log, i) => (
                            <div key={i} className="p-3 rounded-xl bg-white/30">
                              <div className="flex items-center gap-2 mb-1">
                                <Sparkles className="w-3 h-3 text-[#222]/40" />
                                <span className="text-xs font-semibold text-[#222]/60">{log.company} — {log.role}</span>
                              </div>
                              <p className="text-xs text-[#222]/50">
                                Difficulty: {log.difficulty} &middot; Topic: {log.topic}
                              </p>
                              <p className="text-[10px] text-[#222]/30 mt-1">
                                {new Date(log.timestamp).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-[#222]/30 italic">No AI prompts</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {allUsers.length === 0 && (
            <div className="glass-card rounded-2xl p-12 text-center">
              <Users className="w-10 h-10 text-[#222]/15 mx-auto mb-3" />
              <p className="text-sm text-[#222]/40">No users registered yet.</p>
            </div>
          )}
        </div>
      )}

      {/* All Challenges Tab */}
      {tab === "challenges" && (
        <div className="space-y-3">
          {contests.filter((c) => c.createdBy).map((c) => {
            const creator = allUsers.find((u) => u.id === c.createdBy);
            return (
              <Link key={c.id} to={`/contest/${c.id}`} className="no-underline block">
                <div className="glass-card rounded-2xl p-5 hover-glow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[#222]">{c.title}</p>
                      <p className="text-xs text-[#222]/50">{c.company} &middot; {c.role} &middot; {c.difficulty}</p>
                      <p className="text-xs text-[#222]/40 mt-1">
                        Posted by {creator?.name || "Unknown"} ({creator?.email || "—"}) &middot;{" "}
                        {new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold">{c.prize}</span>
                      <p className="text-xs text-[#222]/40">{c.leaderboard?.length || 0} submissions</p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
          {contests.filter((c) => c.createdBy).length === 0 && (
            <div className="glass-card rounded-2xl p-12 text-center">
              <Briefcase className="w-10 h-10 text-[#222]/15 mx-auto mb-3" />
              <p className="text-sm text-[#222]/40">No user-created challenges yet.</p>
            </div>
          )}
        </div>
      )}

      {/* All Submissions Tab */}
      {tab === "submissions" && (
        <div className="space-y-3">
          {submissions.map((s) => {
            const contest = contests.find((c) => c.id === s.contestId);
            return (
              <div key={s.id} className="glass-card rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#222]">{s.userName}</p>
                    <p className="text-xs text-[#222]/50 flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {s.userEmail || "—"}
                    </p>
                    <p className="text-xs text-[#222]/40 mt-1">
                      → {contest?.title || "Unknown Challenge"} ({contest?.company || "—"})
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${statusStyles[s.status] || ""}`}>{s.status}</span>
                    {s.score !== null && <p className="text-xs font-bold mt-1">{s.score}/100</p>}
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-black/[0.04] space-y-1">
                  <a href={s.githubUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-[#222]/50 hover:text-[#222] no-underline flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" />
                    {s.githubUrl}
                  </a>
                  {s.notes && <p className="text-xs text-[#222]/40 italic">"{s.notes}"</p>}
                  <p className="text-[10px] text-[#222]/30">
                    {new Date(s.submittedAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            );
          })}
          {submissions.length === 0 && (
            <div className="glass-card rounded-2xl p-12 text-center">
              <Send className="w-10 h-10 text-[#222]/15 mx-auto mb-3" />
              <p className="text-sm text-[#222]/40">No submissions yet.</p>
            </div>
          )}
        </div>
      )}

      {/* AI Prompts Tab */}
      {tab === "ai-logs" && (
        <div className="space-y-3">
          {aiLogs.map((log, i) => (
            <div key={i} className="glass-card rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#222]/40" />
                  <span className="text-sm font-semibold text-[#222]">{log.userName || "Anonymous"}</span>
                  <span className="text-xs text-[#222]/40">{log.userEmail || ""}</span>
                </div>
                <span className="text-[10px] text-[#222]/30">
                  {new Date(log.timestamp).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-white/30">
                  <p className="text-[#222]/40 mb-0.5">Company</p>
                  <p className="font-medium text-[#222]">{log.company}</p>
                </div>
                <div className="p-2 rounded-lg bg-white/30">
                  <p className="text-[#222]/40 mb-0.5">Role</p>
                  <p className="font-medium text-[#222]">{log.role}</p>
                </div>
                <div className="p-2 rounded-lg bg-white/30">
                  <p className="text-[#222]/40 mb-0.5">Difficulty</p>
                  <p className="font-medium text-[#222]">{log.difficulty}</p>
                </div>
                <div className="p-2 rounded-lg bg-white/30">
                  <p className="text-[#222]/40 mb-0.5">Topic</p>
                  <p className="font-medium text-[#222]">{log.topic}</p>
                </div>
              </div>
            </div>
          ))}
          {aiLogs.length === 0 && (
            <div className="glass-card rounded-2xl p-12 text-center">
              <Sparkles className="w-10 h-10 text-[#222]/15 mx-auto mb-3" />
              <p className="text-sm text-[#222]/40">No AI prompts logged yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
