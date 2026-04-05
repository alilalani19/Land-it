import { Link } from "react-router-dom";
import { ArrowLeft, FileText, Shield, Mail } from "lucide-react";

export default function Legal() {
  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-[#222]/50 hover:text-[#222] transition no-underline mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight font-[family-name:var(--font-display)] text-[#222]">
            Legal
          </h1>
          <p className="text-sm text-[#222]/50 mt-2">
            Review our policies and legal information.
          </p>
        </div>

        {/* Links */}
        <div className="space-y-4">
          <Link to="/terms" className="block no-underline">
            <div className="glass-card-strong rounded-2xl p-6 hover:shadow-md transition">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-[#222]/5">
                  <FileText className="w-5 h-5 text-[#222]/60" />
                </div>
                <div>
                  <h2 className="text-lg font-bold font-[family-name:var(--font-display)] text-[#222]">
                    Terms of Service
                  </h2>
                  <p className="text-sm text-[#222]/50 mt-1">
                    Rules and guidelines for using the Land-it platform, including account
                    responsibilities, challenge posting, payments, and intellectual property.
                  </p>
                </div>
              </div>
            </div>
          </Link>

          <Link to="/privacy" className="block no-underline">
            <div className="glass-card-strong rounded-2xl p-6 hover:shadow-md transition">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-[#222]/5">
                  <Shield className="w-5 h-5 text-[#222]/60" />
                </div>
                <div>
                  <h2 className="text-lg font-bold font-[family-name:var(--font-display)] text-[#222]">
                    Privacy Policy
                  </h2>
                  <p className="text-sm text-[#222]/50 mt-1">
                    How we collect, use, and protect your personal information, including details
                    about payment processing, data storage, and third-party services.
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Contact */}
        <div className="glass-card-strong rounded-2xl p-6 mt-8">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-[#222]/5">
              <Mail className="w-5 h-5 text-[#222]/60" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-[family-name:var(--font-display)] text-[#222]">
                Contact Us
              </h2>
              <p className="text-sm text-[#222]/50 mt-1">
                Have questions about our policies? Reach out to us at{" "}
                <a
                  href="mailto:alalani29@sjs.org"
                  className="text-[#222] font-medium no-underline hover:underline"
                >
                  alalani29@sjs.org
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-xs text-[#222]/40 text-center mt-8">
          Last updated: April 5, 2026
        </p>
      </div>
    </div>
  );
}
