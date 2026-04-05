import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Terms() {
  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Back Link */}
        <Link
          to="/legal"
          className="inline-flex items-center gap-1.5 text-sm text-[#222]/50 hover:text-[#222] transition no-underline mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Legal
        </Link>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight font-[family-name:var(--font-display)] text-[#222]">
            Terms of Service
          </h1>
          <p className="text-sm text-[#222]/50 mt-2">
            Effective Date: April 5, 2026
          </p>
        </div>

        {/* Content */}
        <div className="glass-card-strong rounded-2xl p-6 sm:p-10 space-y-8">
          {/* 1 */}
          <section>
            <h2 className="text-lg font-bold font-[family-name:var(--font-display)] text-[#222] mb-3">
              1. Acceptance of Terms
            </h2>
            <p className="text-sm text-[#222]/70 leading-relaxed">
              By accessing or using Land-it ("the Platform"), operated at landnow.org, you agree to
              be bound by these Terms of Service ("Terms"). If you do not agree with any part of
              these Terms, you must not use the Platform. We reserve the right to update these Terms
              at any time. Continued use of the Platform after changes constitutes acceptance of the
              revised Terms.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-lg font-bold font-[family-name:var(--font-display)] text-[#222] mb-3">
              2. Account Registration and Responsibilities
            </h2>
            <div className="text-sm text-[#222]/70 leading-relaxed space-y-3">
              <p>
                To use certain features of Land-it, you must create an account by providing a valid
                name, email address, and password. You are responsible for:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Maintaining the confidentiality of your login credentials.</li>
                <li>All activity that occurs under your account.</li>
                <li>Providing accurate and current information during registration.</li>
                <li>Notifying us immediately of any unauthorized use of your account.</li>
              </ul>
              <p>
                You must be at least 13 years of age to create an account. If you are under 18, you
                must have the consent of a parent or legal guardian. Land-it reserves the right to
                suspend or terminate accounts that violate these Terms.
              </p>
            </div>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-lg font-bold font-[family-name:var(--font-display)] text-[#222] mb-3">
              3. Challenge Posting and Payments
            </h2>
            <div className="text-sm text-[#222]/70 leading-relaxed space-y-3">
              <p>
                Companies and hiring managers may post technical challenges on Land-it to evaluate
                candidates. Each challenge posting requires a one-time fee of <strong>$54.99 USD</strong>,
                processed securely through Stripe.
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  All payments are final and non-refundable unless otherwise required by applicable
                  law.
                </li>
                <li>
                  Land-it does not store your credit card information. All payment data is handled
                  directly by Stripe in accordance with PCI-DSS standards.
                </li>
                <li>
                  Challenge posters are responsible for ensuring their challenge descriptions are
                  accurate, lawful, and do not infringe on third-party rights.
                </li>
                <li>
                  Land-it reserves the right to remove any challenge posting that violates these
                  Terms or is otherwise deemed inappropriate.
                </li>
              </ul>
            </div>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-lg font-bold font-[family-name:var(--font-display)] text-[#222] mb-3">
              4. Submissions and Intellectual Property
            </h2>
            <div className="text-sm text-[#222]/70 leading-relaxed space-y-3">
              <p>
                When you submit code, text, or other materials ("Submissions") to a challenge on
                Land-it:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  You retain ownership of your Submissions. By submitting, you grant the challenge
                  poster a non-exclusive, royalty-free license to review and evaluate your
                  Submission for hiring purposes.
                </li>
                <li>
                  You represent and warrant that your Submissions are your original work and do not
                  infringe on the intellectual property rights of any third party.
                </li>
                <li>
                  Submissions may be processed by AI services (such as Anthropic Claude) for
                  evaluation purposes. By submitting, you consent to this processing.
                </li>
                <li>
                  Land-it does not claim ownership of your Submissions and will not sell or
                  redistribute them beyond the scope of challenge evaluation.
                </li>
              </ul>
            </div>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-lg font-bold font-[family-name:var(--font-display)] text-[#222] mb-3">
              5. Code of Conduct
            </h2>
            <div className="text-sm text-[#222]/70 leading-relaxed space-y-3">
              <p>All users of Land-it agree to:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Treat all participants with respect and professionalism.</li>
                <li>
                  Not submit plagiarized, malicious, or harmful code in challenge responses.
                </li>
                <li>
                  Not attempt to manipulate challenge outcomes, rankings, or evaluations through
                  fraudulent means.
                </li>
                <li>
                  Not use the Platform for any unlawful purpose or in violation of any applicable
                  laws or regulations.
                </li>
                <li>
                  Not harass, abuse, or threaten other users through any communication on the
                  Platform.
                </li>
                <li>
                  Not attempt to reverse-engineer, decompile, or disrupt the Platform's
                  infrastructure.
                </li>
              </ul>
              <p>
                Violations of this Code of Conduct may result in immediate account suspension or
                termination at Land-it's sole discretion.
              </p>
            </div>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-lg font-bold font-[family-name:var(--font-display)] text-[#222] mb-3">
              6. Limitation of Liability
            </h2>
            <div className="text-sm text-[#222]/70 leading-relaxed space-y-3">
              <p>
                To the fullest extent permitted by applicable law, Land-it and its operators,
                affiliates, and partners shall not be liable for any indirect, incidental, special,
                consequential, or punitive damages arising out of or related to your use of the
                Platform.
              </p>
              <p>
                Land-it is provided on an "as is" and "as available" basis without warranties of any
                kind, either express or implied, including but not limited to implied warranties of
                merchantability, fitness for a particular purpose, or non-infringement.
              </p>
              <p>
                Land-it does not guarantee that any challenge will result in employment, hiring, or
                any specific outcome. The Platform serves as a connection tool between companies and
                developers, and hiring decisions are solely at the discretion of the challenge
                poster.
              </p>
            </div>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-lg font-bold font-[family-name:var(--font-display)] text-[#222] mb-3">
              7. Termination
            </h2>
            <div className="text-sm text-[#222]/70 leading-relaxed space-y-3">
              <p>
                Land-it reserves the right to suspend or terminate your account at any time, with or
                without notice, for conduct that we believe violates these Terms or is harmful to
                other users, the Platform, or third parties.
              </p>
              <p>
                You may delete your account at any time by contacting us at{" "}
                <a
                  href="mailto:alalani29@sjs.org"
                  className="text-[#222] font-medium no-underline hover:underline"
                >
                  alalani29@sjs.org
                </a>
                . Upon termination, your right to use the Platform ceases immediately. Any
                provisions of these Terms that by their nature should survive termination shall
                remain in effect.
              </p>
            </div>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-lg font-bold font-[family-name:var(--font-display)] text-[#222] mb-3">
              8. Contact
            </h2>
            <p className="text-sm text-[#222]/70 leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at{" "}
              <a
                href="mailto:alalani29@sjs.org"
                className="text-[#222] font-medium no-underline hover:underline"
              >
                alalani29@sjs.org
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
