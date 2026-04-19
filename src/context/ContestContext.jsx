import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "../lib/supabase";

const ContestContext = createContext();

function toContest(row, leaderboard = []) {
  return {
    id: row.id,
    company: row.company,
    logo: row.logo,
    role: row.role,
    difficulty: row.difficulty,
    title: row.title,
    description: row.description,
    techStack: row.tech_stack || [],
    prize: row.prize,
    deadline: row.deadline,
    deliverables: row.deliverables || [],
    evaluationCriteria: row.evaluation_criteria || [],
    createdBy: row.created_by,
    createdAt: row.created_at,
    leaderboard,
  };
}

function toSubmission(row) {
  return {
    id: row.id,
    contestId: row.contest_id,
    userId: row.user_id,
    userName: row.user_name,
    userEmail: row.user_email,
    githubUrl: row.github_url,
    notes: row.notes,
    status: row.status,
    score: row.score,
    submittedAt: row.submitted_at,
  };
}

function attachLeaderboards(contestRows, leaderboardRows) {
  const byContest = new Map();
  for (const entry of leaderboardRows) {
    const list = byContest.get(entry.contest_id) || [];
    list.push({
      name: entry.name,
      avatar: entry.avatar,
      score: entry.score,
      status: entry.status,
    });
    byContest.set(entry.contest_id, list);
  }
  for (const list of byContest.values()) {
    list.sort((a, b) => (b.score || 0) - (a.score || 0));
  }
  return contestRows.map((row) => toContest(row, byContest.get(row.id) || []));
}

export function ContestProvider({ children }) {
  const [contests, setContests] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const [contestsRes, leaderboardRes, submissionsRes] = await Promise.all([
      supabase.from("contests").select("*").order("created_at", { ascending: false }),
      supabase.from("leaderboard").select("*"),
      supabase.from("submissions").select("*").order("submitted_at", { ascending: false }),
    ]);

    if (contestsRes.error) console.error("contests fetch error:", contestsRes.error);
    if (leaderboardRes.error) console.error("leaderboard fetch error:", leaderboardRes.error);
    if (submissionsRes.error) console.error("submissions fetch error:", submissionsRes.error);

    setContests(attachLeaderboards(contestsRes.data || [], leaderboardRes.data || []));
    setSubmissions((submissionsRes.data || []).map(toSubmission));
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      await refresh();
      if (mounted) setLoading(false);
    })();
    return () => { mounted = false; };
  }, [refresh]);

  const addContest = useCallback(async (contest, userId) => {
    const { data, error } = await supabase
      .from("contests")
      .insert({
        created_by: userId,
        company: contest.company,
        logo: contest.logo,
        role: contest.role,
        difficulty: contest.difficulty,
        title: contest.title,
        description: contest.description,
        tech_stack: contest.techStack || [],
        prize: contest.prize,
        deadline: contest.deadline,
        deliverables: contest.deliverables || [],
        evaluation_criteria: contest.evaluationCriteria || [],
      })
      .select()
      .single();

    if (error) {
      console.error("addContest error:", error);
      return null;
    }
    await refresh();
    return data.id;
  }, [refresh]);

  const updateContest = useCallback(async (contestId, updates) => {
    const patch = {};
    if (updates.company !== undefined) patch.company = updates.company;
    if (updates.logo !== undefined) patch.logo = updates.logo;
    if (updates.role !== undefined) patch.role = updates.role;
    if (updates.difficulty !== undefined) patch.difficulty = updates.difficulty;
    if (updates.title !== undefined) patch.title = updates.title;
    if (updates.description !== undefined) patch.description = updates.description;
    if (updates.techStack !== undefined) patch.tech_stack = updates.techStack;
    if (updates.prize !== undefined) patch.prize = updates.prize;
    if (updates.deadline !== undefined) patch.deadline = updates.deadline;
    if (updates.deliverables !== undefined) patch.deliverables = updates.deliverables;
    if (updates.evaluationCriteria !== undefined) patch.evaluation_criteria = updates.evaluationCriteria;

    const { error } = await supabase.from("contests").update(patch).eq("id", contestId);
    if (error) {
      console.error("updateContest error:", error);
      return;
    }
    await refresh();
  }, [refresh]);

  const deleteContest = useCallback(async (contestId) => {
    const { error } = await supabase.from("contests").delete().eq("id", contestId);
    if (error) {
      console.error("deleteContest error:", error);
      return;
    }
    await refresh();
  }, [refresh]);

  const addSubmission = useCallback(async ({ contestId, userId, userName, userEmail, githubUrl, notes }) => {
    const { data, error } = await supabase
      .from("submissions")
      .insert({
        contest_id: contestId,
        user_id: userId,
        user_name: userName,
        user_email: userEmail || "",
        github_url: githubUrl,
        notes: notes || null,
      })
      .select()
      .single();

    if (error) {
      console.error("addSubmission error:", error);
      return { error: error.message };
    }
    await refresh();
    return { submission: toSubmission(data) };
  }, [refresh]);

  const updateSubmission = useCallback(async (submissionId, updates) => {
    const patch = {};
    if (updates.status !== undefined) patch.status = updates.status;
    if (updates.score !== undefined) patch.score = updates.score;
    if (updates.notes !== undefined) patch.notes = updates.notes;

    const { error } = await supabase.from("submissions").update(patch).eq("id", submissionId);
    if (error) {
      console.error("updateSubmission error:", error);
      return;
    }
    await refresh();
  }, [refresh]);

  const getUserSubmissions = useCallback(
    (userId) => submissions.filter((s) => s.userId === userId),
    [submissions]
  );

  const getUserContests = useCallback(
    (userId) => contests.filter((c) => c.createdBy === userId),
    [contests]
  );

  const value = useMemo(
    () => ({
      contests,
      submissions,
      loading,
      addContest,
      updateContest,
      deleteContest,
      addSubmission,
      updateSubmission,
      getUserSubmissions,
      getUserContests,
      refresh,
    }),
    [contests, submissions, loading, addContest, updateContest, deleteContest, addSubmission, updateSubmission, getUserSubmissions, getUserContests, refresh]
  );

  return (
    <ContestContext.Provider value={value}>{children}</ContestContext.Provider>
  );
}

export function useContests() {
  return useContext(ContestContext);
}
