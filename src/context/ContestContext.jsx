import { createContext, useContext, useState } from "react";
import { mockContests } from "../data/contests";

const ContestContext = createContext();

export function ContestProvider({ children }) {
  const [contests, setContests] = useState(mockContests);
  const [submissions, setSubmissions] = useState([]);

  function addContest(contest, userId) {
    const newContest = {
      ...contest,
      id: String(Date.now()),
      createdBy: userId || null,
      createdAt: new Date().toISOString(),
      leaderboard: [],
    };
    setContests((prev) => [newContest, ...prev]);
    return newContest.id;
  }

  function addSubmission({ contestId, userId, userName, githubUrl, notes }) {
    const submission = {
      id: String(Date.now()),
      contestId,
      userId,
      userName,
      githubUrl,
      notes,
      status: "Submitted",
      score: null,
      submittedAt: new Date().toISOString(),
    };
    setSubmissions((prev) => [submission, ...prev]);

    // Also add to the contest leaderboard
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
                  score: Math.floor(Math.random() * 15) + 80,
                  status: "Submitted",
                },
              ],
            }
          : c
      )
    );

    return submission;
  }

  function getUserSubmissions(userId) {
    return submissions.filter((s) => s.userId === userId);
  }

  function getUserContests(userId) {
    return contests.filter((c) => c.createdBy === userId);
  }

  return (
    <ContestContext.Provider
      value={{
        contests,
        submissions,
        addContest,
        addSubmission,
        getUserSubmissions,
        getUserContests,
      }}
    >
      {children}
    </ContestContext.Provider>
  );
}

export function useContests() {
  return useContext(ContestContext);
}
