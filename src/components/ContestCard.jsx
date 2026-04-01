import { Link } from "react-router-dom";
import { Clock, DollarSign } from "lucide-react";
import { GlowCard } from "@/components/ui/spotlight-card";

const difficultyColors = {
  Junior: "bg-green-100 text-green-700",
  Mid: "bg-blue-100 text-blue-700",
  Senior: "bg-amber-100 text-amber-700",
  Expert: "bg-red-100 text-red-700",
};

const difficultyGlow = {
  Junior: "green",
  Mid: "blue",
  Senior: "orange",
  Expert: "red",
};

export default function ContestCard({ contest }) {
  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(contest.deadline) - new Date()) / 86400000)
  );

  return (
    <Link to={`/contest/${contest.id}`} className="no-underline">
      <GlowCard
        glowColor={difficultyGlow[contest.difficulty] || "blue"}
        customSize
        className="h-full !aspect-auto cursor-pointer"
      >
        <div className="flex flex-col h-full relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <img
                src={contest.logo}
                alt={contest.company}
                className="w-10 h-10 rounded-xl object-contain bg-white p-1 border border-black/5"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <div>
                <p className="text-sm font-medium text-[#222]/60">
                  {contest.company}
                </p>
                <h3 className="text-base font-semibold text-[#222] leading-tight font-[family-name:var(--font-display)]">
                  {contest.role}
                </h3>
              </div>
            </div>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                difficultyColors[contest.difficulty] || "bg-gray-100 text-gray-700"
              }`}
            >
              {contest.difficulty}
            </span>
          </div>

          {/* Title */}
          <p className="text-sm font-medium text-[#222]/80 mb-3 line-clamp-2 flex-1">
            {contest.title}
          </p>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {contest.techStack.map((tech) => (
              <span
                key={tech}
                className="text-xs font-medium px-2.5 py-1 rounded-lg bg-[#222]/5 text-[#222]/70"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-black/5">
            <div className="flex items-center gap-1.5 text-[#222]">
              <DollarSign className="w-4 h-4" />
              <span className="text-sm font-bold">{contest.prize}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#222]/50">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">{daysLeft}d left</span>
            </div>
          </div>
        </div>
      </GlowCard>
    </Link>
  );
}
