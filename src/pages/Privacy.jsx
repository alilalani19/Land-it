import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Privacy() {
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
            Privacy Policy
          </h1>
          <p className="text-sm text-[#222]/50 mt-2">
            Effective Date: April 5, 2026
          </p>
        </div>

        {/* Content */}
        <div className="glass-card-strong rounded-2xl p-6 sm:p-10 space-y-8">
          {/* Intro */}
          <section>
            <p className="text-sm text-[#222]/70 leading-relaxed">
              Land-it ("we," "our," or "us"), operated at landnow.org, is committed to protecting
              your privacy. This Privacy Policy explains how we collect, use, and safeguard your
              information when you use our platform. By using Land-it, you consent to the practices
              described in this policy.
            </p>
          </section>

          {/* 1 */}
          <section>
            <h2 className="text-lg font-bold font-[family-name:var(--font-display)] text-[#222] mb-3">
              1. Information We Collect
            </h2>
            <div className="text-sm text-[#222]/70 leading-relaxed space-y-3">
              <p>We collect the following types of information:</p>
              <p className="font-semibold text-[#222]/80">Account Information</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong>Name:</strong> Provided during registration to identify you on the
                  Platform.
                </li>
                <li>
                  <strong>Email address:</strong> Used for account authentication, notifications, and
                  communication.
                </li>
                <li>
                  <strong>Password hash:</strong> Your password is hashed before storage. We never
                  store plain-text passwords.
                </li>
                <li>
                  <strong>Account role:</strong> Whether you are a developer or a company/hiring
                  manager.
                </li>
              </ul>
              <p className="font-semibold text-[#222]/80">Challenge and Submission Data</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong>Challenge details:</strong> Titles, descriptions, requirements, and prizes
                  for posted challenges.
                </li>
                <li>
                  <strong>Submissions:</strong> Code, text, and other materials you submit in
                  response to challenges.
                </li>
                <li>
                  <strong>AI prompts and evaluations:</strong> When submissions are evaluated using
                  AI, the prompts sent to the AI service and the resulting scores or feedback may be
                  stored.
                </li>
              </ul>
              <p className="font-semibold text-[#222]/80">Usage Data</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Browser type, device information, and general usage patterns.</li>
                <li>Pages visited and features used within the Platform.</li>
              </ul>
            </div>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-lg font-bold font-[family-name:var(--font-display)] text-[#222] mb-3">
              2. How We Use Your Data
            </h2>
            <div className="text-sm text-[#222]/70 leading-relaxed space-y-3">
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Create and manage your account.</li>
                <li>Enable you to post challenges and submit solutions.</li>
                <li>
                  Process and evaluate submissions, including through AI-powered analysis.
                </li>
                <li>Process payments for challenge postings via Stripe.</li>
                <li>Communicate with you about your account, challenges, and platform updates.</li>
                <li>Improve and maintain the Platform's functionality and security.</li>
                <li>Enforce our Terms of Service and prevent abuse.</li>
              </ul>
            </div>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-lg font-bold font-[family-name:var(--font-display)] text-[#222] mb-3">
              3. Payment Processing
            </h2>
            <div className="text-sm text-[#222]/70 leading-relaxed space-y-3">
              <p>
                Challenge posting fees ($54.99 USD) are processed through{" "}
                <strong>Stripe, Inc.</strong>, a PCI-DSS compliant payment processor.
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong>We do not store, process, or have access to your full credit card
                  number.</strong> All payment card data is handled directly by Stripe's secure
                  infrastructure.
                </li>
                <li>
                  We may receive limited transaction information from Stripe, such as the last four
                  digits of your card, transaction status, and billing address, for record-keeping
                  and support purposes.
                </li>
                <li>
                  Stripe's privacy policy governs the handling of your payment data. You can review
                  it at{" "}
                  <a
                    href="https://stripe.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#222] font-medium no-underline hover:underline"
                  >
                    stripe.com/privacy
                  </a>
                  .
                </li>
              </ul>
            </div>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-lg font-bold font-[family-name:var(--font-display)] text-[#222] mb-3">
              4. Data Storage
            </h2>
            <div className="text-sm text-[#222]/70 leading-relaxed space-y-3">
              <p>
                Land-it currently stores application data using <strong>browser localStorage</strong>.
                This means your data is stored locally on your device and is not transmitted to or
                stored on external servers (except for payment and AI processing as described in this
                policy).
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  localStorage data persists until you clear your browser data or we migrate to a
                  server-based storage solution.
                </li>
                <li>
                  Because data is stored locally, it is only accessible from the browser and device
                  where it was created.
                </li>
                <li>
                  We plan to transition to secure server-side storage in the future, at which point
                  this policy will be updated accordingly.
                </li>
              </ul>
            </div>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-lg font-bold font-[family-name:var(--font-display)] text-[#222] mb-3">
              5. Third-Party Services
            </h2>
            <div className="text-sm text-[#222]/70 leading-relaxed space-y-3">
              <p>
                Land-it integrates with the following third-party services that may process your
                data:
              </p>
              <p className="font-semibold text-[#222]/80">Stripe</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Processes challenge posting payments securely.</li>
                <li>
                  Handles all credit card data; Land-it never receives or stores full card numbers.
                </li>
              </ul>
              <p className="font-semibold text-[#222]/80">Anthropic (Claude AI)</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  Used for AI-powered evaluation of challenge submissions.
                </li>
                <li>
                  Submission content and evaluation prompts may be sent to Anthropic's API for
                  processing.
                </li>
                <li>
                  Anthropic's usage policy governs how data sent to their API is handled. You can
                  review it at{" "}
                  <a
                    href="https://www.anthropic.com/policies/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#222] font-medium no-underline hover:underline"
                  >
                    anthropic.com/policies/privacy
                  </a>
                  .
                </li>
              </ul>
            </div>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-lg font-bold font-[family-name:var(--font-display)] text-[#222] mb-3">
              6. Your Rights
            </h2>
            <div className="text-sm text-[#222]/70 leading-relaxed space-y-3">
              <p>Depending on your jurisdiction, you may have the right to:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong>Access</strong> the personal data we hold about you.
                </li>
                <li>
                  <strong>Correct</strong> inaccurate or incomplete personal data.
                </li>
                <li>
                  <strong>Delete</strong> your personal data and account.
                </li>
                <li>
                  <strong>Export</strong> your data in a portable format.
                </li>
                <li>
                  <strong>Object</strong> to or restrict certain processing of your data.
                </li>
                <li>
                  <strong>Withdraw consent</strong> where processing is based on consent.
                </li>
              </ul>
              <p>
                To exercise any of these rights, please contact us at{" "}
                <a
                  href="mailto:alalani29@sjs.org"
                  className="text-[#222] font-medium no-underline hover:underline"
                >
                  alalani29@sjs.org
                </a>
                . We will respond to your request within 30 days.
              </p>
            </div>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-lg font-bold font-[family-name:var(--font-display)] text-[#222] mb-3">
              7. Cookies
            </h2>
            <div className="text-sm text-[#222]/70 leading-relaxed space-y-3">
              <p>
                Land-it does not currently use tracking cookies or third-party analytics cookies.
                We use browser localStorage to persist your session and application data.
              </p>
              <p>
                If we introduce cookies in the future, we will update this policy and provide you
                with appropriate notice and consent mechanisms.
              </p>
            </div>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-lg font-bold font-[family-name:var(--font-display)] text-[#222] mb-3">
              8. Children's Privacy
            </h2>
            <p className="text-sm text-[#222]/70 leading-relaxed">
              Land-it is not directed to children under the age of 13. We do not knowingly collect
              personal information from children under 13. If we learn that we have collected
              personal data from a child under 13 without parental consent, we will take steps to
              delete that information promptly.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-lg font-bold font-[family-name:var(--font-display)] text-[#222] mb-3">
              9. Changes to This Policy
            </h2>
            <p className="text-sm text-[#222]/70 leading-relaxed">
              We may update this Privacy Policy from time to time. When we do, we will revise the
              "Effective Date" at the top of this page. We encourage you to review this policy
              periodically. Your continued use of the Platform after any changes constitutes
              acceptance of the updated policy.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-lg font-bold font-[family-name:var(--font-display)] text-[#222] mb-3">
              10. Contact
            </h2>
            <p className="text-sm text-[#222]/70 leading-relaxed">
              If you have any questions or concerns about this Privacy Policy, please contact us
              at{" "}
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
