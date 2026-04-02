module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  try {
    const { company, role, difficulty, topic } = req.body;

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

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    const text = data.content?.[0]?.text || "";
    const parsed = JSON.parse(text);

    res.status(200).json(parsed);
  } catch (err) {
    console.error("AI generation error:", err);
    res.status(500).json({ error: "Failed to generate challenge" });
  }
};
