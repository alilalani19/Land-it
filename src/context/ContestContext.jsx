import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { mockContests } from "../data/contests";

const ContestContext = createContext();

function loadStoredContests() {
  try {
    const stored = JSON.parse(localStorage.getItem("landit_user_contests") || "[]");
    if (stored.length) {
      const mockIds = new Set(mockContests.map((c) => c.id));
      const userContests = stored.filter((c) => !mockIds.has(c.id));
      return [...userContests, ...mockContests];
    }
  } catch {}
  return mockContests;
}

function loadStoredSubmissions() {
  try {
    return JSON.parse(localStorage.getItem("landit_submissions") || "[]");
  } catch {
    return [];
  }
}

export function ContestProvider({ children }) {
  const [contests, setContests] = useState(loadStoredContests);
  const [submissions, setSubmissions] = useState(loadStoredSubmissions);

  useEffect(() => {
    const mockIds = new Set(mockContests.map((c) => c.id));
    const userContests = contests.filter((c) => !mockIds.has(c.id));
    localStorage.setItem("landit_user_contests", JSON.stringify(userContests));
  }, [contests]);

  useEffect(() => {
    localStorage.setItem("landit_submissions", JSON.stringify(submissions));
  }, [submissions]);

  const addContest = useCallback((contest, userId) => {
    const newContest = {
      ...contest,
      id: String(Date.now()),
      createdBy: userId || null,
      createdAt: new Date().toISOString(),
      leaderboard: [],
    };
    setContests((prev) => [newContest, ...prev]);
    return newContest.id;
  }, []);

  const updateContest = useCallback((contestId, updates) => {
    setContests((prev) =>
      prev.map((c) => (c.id === contestId ? { ...c, ...updates } : c))
    );
  }, []);

  const deleteContest = useCallback((contestId) => {
    setContests((prev) => prev.filter((c) => c.id !== contestId));
    setSubmissions((prev) => prev.filter((s) => s.contestId !== contestId));
  }, []);

  const addSubmission = useCallback(({ contestId, userId, userName, userEmail, githubUrl, notes }) => {
    const submission = {
      id: String(Date.now()),
      contestId,
      userId,
      userName,
      userEmail: userEmail || "",
      githubUrl,
      notes,
      status: "Submitted",
      score: null,
      submittedAt: new Date().toISOString(),
    };
    setSubmissions((prev) => [submission, ...prev]);

    setContests((prev) =>
      prev.map((c) =>
        c.id === contestId
          ? {
              ...c,
              leaderboard: [
                ...c.leaderboard,
                {
                  name: userName,
                  avatar: userName.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2),
                  score: 0,
                  status: "Submitted",
                },
              ],
            }
          : c
      )
    );

    return submission;
  }, []);

  const updateSubmission = useCallback((submissionId, updates) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === submissionId ? { ...s, ...updates } : s))
    );
    // Sync score/status to leaderboard
    if (updates.score !== undefined || updates.status !== undefined) {
      setSubmissions((prev) => {
        const sub = prev.find((s) => s.id === submissionId);
        if (sub) {
          setContests((prevContests) =>
            prevContests.map((c) => {
              if (c.id !== sub.contestId) return c;
              const lb = c.leaderboard.map((entry) =>
                entry.name === sub.userName
                  ? {
                      ...entry,
                      ...(updates.score !== undefined ? { score: updates.score } : {}),
                      ...(updates.status !== undefined ? { status: updates.status } : {}),
                    }
                  : entry
              );
              lb.sort((a, b) => (b.score || 0) - (a.score || 0));
              return { ...c, leaderboard: lb };
            })
          );
        }
        return prev;
      });
    }
  }, []);

  const getUserSubmissions = useCallback((userId) => {
    return submissions.filter((s) => s.userId === userId);
  }, [submissions]);

  const getUserContests = useCallback((userId) => {
    return contests.filter((c) => c.createdBy === userId);
  }, [contests]);

  const value = useMemo(() => ({
    contests,
    submissions,
    addContest,
    updateContest,
    deleteContest,
    addSubmission,
    updateSubmission,
    getUserSubmissions,
    getUserContests,
  }), [contests, submissions, addContest, updateContest, deleteContest, addSubmission, updateSubmission, getUserSubmissions, getUserContests]);

  return (
    <ContestContext.Provider value={value}>
      {children}
    </ContestContext.Provider>
  );
}

export function useContests() {
  return useContext(ContestContext);
}
