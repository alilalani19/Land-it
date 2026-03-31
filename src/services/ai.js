const API_KEY = import.meta.env.VITE_AI_API_KEY || "";
const API_URL =
  import.meta.env.VITE_AI_API_URL ||
  "https://api.anthropic.com/v1/messages";

export async function generateChallenge({ company, role, difficulty, topic }) {
  const prompt = `Generate a technical hiring challenge for the following:
Company: ${company}
Role: ${role}
Difficulty: ${difficulty}
Topic: ${topic}

Respond with ONLY valid JSON (no markdown, no code blocks) matching this exact schema:
{
  "title": "A catchy, specific challenge title",
  "description": "2-3 paragraph detailed description of the challenge",
  "deliverables": ["deliverable 1", "deliverable 2", "deliverable 3", "deliverable 4", "deliverable 5"],
  "techStack": ["tech1", "tech2", "tech3", "tech4"],
  "evaluationCriteria": ["criterion 1", "criterion 2", "criterion 3", "criterion 4"],
  "prize": "$X,000"
}`;

  if (API_KEY) {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1024,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      const text = data.content?.[0]?.text || "";
      return JSON.parse(text);
    } catch (e) {
      console.warn("AI API call failed, using fallback:", e);
    }
  }

  // Fallback: generate realistic mock data based on inputs
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
