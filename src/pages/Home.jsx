import {
  Trophy,
  Zap,
  Users,
  DollarSign,
} from "lucide-react";
import ContestCard from "../components/ContestCard";
import { useContests } from "../context/ContestContext";
import { CinematicHero } from "@/components/ui/cinematic-landing-hero";

const stats = [
  { icon: DollarSign, label: "Prize Pool", value: "$250k+" },
  { icon: Zap, label: "Active Challenges", value: "45" },
  { icon: Users, label: "Developers", value: "12,000+" },
  { icon: Trophy, label: "Hired", value: "890+" },
];

export default function Home() {
  const { contests } = useContests();

  return (
    <div className="-mt-16">
      {/* Cinematic Hero */}
      <CinematicHero
        brandName="Land-it"
        tagline1="Prove your skills,"
        tagline2="Get Hired."
        cardHeading="Hiring, redefined."
        cardDescription={
          <>
            <span className="text-white font-semibold">Land-it</span> connects
            developers with top companies through real technical challenges. Ship
            code, win prizes, and land your dream role — no resumes needed.
          </>
        }
        metricValue={45}
        metricLabel="Active Challenges"
        ctaHeading="Start competing."
        ctaDescription="Join thousands of developers proving their skills through real technical challenges from top companies."
        ctaPrimaryText="Start Landing"
        ctaPrimaryHref="#contests"
        ctaSecondaryText="Post a Challenge"
        ctaSecondaryHref="/create"
      />

      {/* Stats Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 mt-12 mb-12">
        <div className="glass-card-strong rounded-2xl p-4 sm:p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <stat.icon className="w-5 h-5 text-[#222]/40" />
                </div>
                <p className="text-xl sm:text-2xl font-bold font-[family-name:var(--font-display)] text-[#222]">
                  {stat.value}
                </p>
                <p className="text-xs text-[#222]/50 font-medium mt-0.5">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contest Grid */}
      <section id="contests" className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Active Challenges
            </h2>
            <p className="text-sm text-[#222]/50 mt-1">
              Compete, build, and get hired by top companies
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {contests.map((contest) => (
            <ContestCard key={contest.id} contest={contest} />
          ))}
        </div>
      </section>
    </div>
  );
}
