function logPrompt(input, source, user) {
  try {
    const logs = JSON.parse(localStorage.getItem("landit_ai_logs") || "[]");
    logs.push({
      ...input,
      source,
      timestamp: new Date().toISOString(),
      userId: user?.id || "anonymous",
      userName: user?.name || "Anonymous",
      userEmail: user?.email || "",
    });
    localStorage.setItem("landit_ai_logs", JSON.stringify(logs));
  } catch {}
}

export function getAiLogs() {
  try {
    return JSON.parse(localStorage.getItem("landit_ai_logs") || "[]");
  } catch {
    return [];
  }
}

export async function generateChallenge({ company, role, difficulty, topic }, user = null) {
  logPrompt({ company, role, difficulty, topic }, "generate-challenge", user);

  try {
    const res = await fetch("/api/generate-challenge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company, role, difficulty, topic }),
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn("API route unavailable, using fallback:", e);
  }

  return generateFallback({ company, role, difficulty, topic });
}

function generateFallback({ company, role, difficulty, topic }) {
  const prizes = { Junior: "$5,000", Mid: "$10,000", Senior: "$18,000", Expert: "$25,000" };
  const topicClean = topic || "full-stack application";

  return {
    title: `Build a ${topicClean} for ${company}`,
    description: `Design and implement a production-grade ${topicClean} that demonstrates expertise in modern ${role.toLowerCase()} practices. This challenge evaluates your ability to architect scalable solutions, write clean and maintainable code, and deliver a polished end product.\n\nYou'll be working with real-world constraints including performance budgets, accessibility requirements, and security best practices. The ideal submission will showcase both technical depth and product thinking.`,
    deliverables: [
      `Core ${topicClean} implementation with full functionality`,
      "Comprehensive test suite with unit and integration tests",
      "API documentation and architecture decision records",
      "Performance optimization with benchmarks",
      "Deployment configuration and CI/CD pipeline",
    ],
    techStack: getTechStack(role),
    evaluationCriteria: [
      "Code quality, architecture, and design patterns",
      "Test coverage and testing strategy",
      "Performance and scalability considerations",
      "Documentation and developer experience",
    ],
    prize: prizes[difficulty] || "$10,000",
  };
}

function getTechStack(role) {
  if (role.toLowerCase().includes("frontend")) return ["React", "TypeScript", "Tailwind CSS", "Vite"];
  if (role.toLowerCase().includes("backend")) return ["Node.js", "PostgreSQL", "Redis", "Docker"];
  if (role.toLowerCase().includes("platform") || role.toLowerCase().includes("devops")) return ["Go", "Kubernetes", "Terraform", "AWS"];
  return ["React", "Node.js", "TypeScript", "PostgreSQL"];
}
