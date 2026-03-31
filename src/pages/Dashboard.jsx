import { useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Send,
  Briefcase,
  Clock,
  ExternalLink,
  Trophy,
  Plus,
  LogOut,
  Mail,
  CalendarDays,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useContests } from "../context/ContestContext";

const statusStyles = {
  Submitted: "bg-blue-100 text-blue-700",
  "In Review": "bg-amber-100 text-amber-700",
  Hired: "bg-green-100 text-green-700",
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { contests, getUserSubmissions, getUserContests } = useContests();
  const [tab, setTab] = useState("submissions");

  const mySubmissions = getUserSubmissions(user.id);
  const myContests = getUserContests(user.id);

  // Enrich submissions with contest data
  const enrichedSubmissions = mySubmissions.map((s) => {
    const contest = contests.find((c) => c.id === s.contestId);
    return { ...s, contest };
  });

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "Recently";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Profile Header */}
      <div className="glass-card-strong rounded-2xl p-6 sm:p-8 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="w-16 h-16 rounded-full gradient-accent flex items-center justify-center text-white text-xl font-bold shrink-0">
            {user.avatar}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight">{user.name}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-[#222]/50">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                {user.email}
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5" />
                Joined {memberSince}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-black/5">
          <div className="text-center">
            <p className="text-2xl font-bold font-[family-name:var(--font-display)]">
              {mySubmissions.length}
            </p>
            <p className="text-xs text-[#222]/50 font-medium mt-0.5">Submissions</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold font-[family-name:var(--font-display)]">
              {myContests.length}
            </p>
            <p className="text-xs text-[#222]/50 font-medium mt-0.5">Challenges Posted</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold font-[family-name:var(--font-display)]">
              {mySubmissions.filter((s) => s.status === "Hired").length}
            </p>
            <p className="text-xs text-[#222]/50 font-medium mt-0.5">Offers</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-[#222]/5 p-1 rounded-xl w-fit">
        {[
          { key: "submissions", label: "My Submissions", icon: Send },
          { key: "posted", label: "Posted Challenges", icon: Briefcase },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
              tab === t.key
                ? "bg-white shadow-sm text-[#222]"
                : "text-[#222]/50 hover:text-[#222]"
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Submissions Tab */}
      {tab === "submissions" && (
        <div>
          {enrichedSubmissions.length > 0 ? (
            <div className="space-y-3">
              {enrichedSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  className="glass-card rounded-2xl p-5 hover-glow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {sub.contest?.logo && (
                        <img
                          src={sub.contest.logo}
                          alt={sub.contest?.company}
                          className="w-10 h-10 rounded-xl object-contain bg-white p-1 border border-black/5 shrink-0"
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                      )}
                      <div>
                        <Link
                          to={`/contest/${sub.contestId}`}
                          className="text-sm font-semibold text-[#222] no-underline hover:underline"
                        >
                          {sub.contest?.title || "Unknown Challenge"}
                        </Link>
                        <p className="text-xs text-[#222]/50 mt-0.5">
                          {sub.contest?.company} &middot; {sub.contest?.role}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                          statusStyles[sub.status] || "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {sub.status}
                      </span>
                      {sub.score && (
                        <span className="text-sm font-bold">{sub.score}/100</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-black/[0.04]">
                    <a
                      href={sub.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-[#222]/50 hover:text-[#222] transition no-underline"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      {sub.githubUrl.replace("https://github.com/", "")}
                    </a>
                    <span className="flex items-center gap-1.5 text-xs text-[#222]/40">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(sub.submittedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    {sub.notes && (
                      <span className="text-xs text-[#222]/40 italic truncate max-w-[200px]">
                        "{sub.notes}"
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-12 text-center">
              <Send className="w-10 h-10 text-[#222]/15 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-1">No submissions yet</h3>
              <p className="text-sm text-[#222]/50 mb-5">
                Find a challenge that matches your skills and submit your solution.
              </p>
              <Link to="/" className="glass-btn glass-btn-md no-underline">
                <Trophy className="w-4 h-4" />
                Browse Challenges
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Posted Challenges Tab */}
      {tab === "posted" && (
        <div>
          {myContests.length > 0 ? (
            <div className="space-y-3">
              {myContests.map((contest) => (
                <Link
                  key={contest.id}
                  to={`/contest/${contest.id}`}
                  className="no-underline block"
                >
                  <div className="glass-card rounded-2xl p-5 hover-glow">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <img
                          src={contest.logo}
                          alt={contest.company}
                          className="w-10 h-10 rounded-xl object-contain bg-white p-1 border border-black/5 shrink-0"
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                        <div>
                          <h3 className="text-sm font-semibold text-[#222]">
                            {contest.title}
                          </h3>
                          <p className="text-xs text-[#222]/50 mt-0.5">
                            {contest.company} &middot; {contest.role}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-[#222]/50">
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />
                          {contest.leaderboard?.length || 0} submissions
                        </span>
                        <span className="font-bold text-sm text-[#222]">
                          {contest.prize}
                        </span>
                      </div>
                    </div>

                    {/* Tech stack */}
                    <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-black/[0.04]">
                      {contest.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs font-medium px-2 py-0.5 rounded-md bg-[#222]/5 text-[#222]/60"
                        >
                          {tech}
                        </span>
                      ))}
                      <span className="ml-auto flex items-center gap-1 text-xs text-[#222]/40">
                        <Clock className="w-3.5 h-3.5" />
                        {Math.max(0, Math.ceil((new Date(contest.deadline) - new Date()) / 86400000))}d left
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-12 text-center">
              <Briefcase className="w-10 h-10 text-[#222]/15 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-1">No challenges posted</h3>
              <p className="text-sm text-[#222]/50 mb-5">
                Create a hiring challenge to find top talent through real work.
              </p>
              <Link to="/create" className="glass-btn glass-btn-md no-underline">
                <Plus className="w-4 h-4" />
                Create Challenge
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
