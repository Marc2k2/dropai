export const metadata = { title: 'Privacy Policy — Dropiq' };

export default function PrivacyPage() {
  return (
    <div className="px-8 py-10 max-w-3xl">
      <h1 className="text-2xl font-semibold text-white mb-2">Privacy Policy</h1>
      <p className="text-slate-500 text-sm mb-10">Last updated: June 2026</p>

      <div className="space-y-8 text-sm text-slate-300 leading-relaxed">
        <section>
          <h2 className="text-base font-semibold text-white mb-3">1. Who we are</h2>
          <p>Dropiq is an AI-powered toolkit for dropshippers. We provide tools for product analysis, copy generation, ad scripts, and competitor research. References to "we", "us" or "our" refer to Dropiq.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white mb-3">2. Data we collect</h2>
          <ul className="space-y-2 list-disc list-inside text-slate-400">
            <li><span className="text-slate-300">Account data</span> — email address and password (hashed) when you create an account</li>
            <li><span className="text-slate-300">Usage data</span> — number of AI generations per month to enforce plan limits</li>
            <li><span className="text-slate-300">Billing data</span> — managed by Stripe; we store only your Stripe customer ID</li>
            <li><span className="text-slate-300">Content you submit</span> — product names, descriptions, and competitor content you enter into our tools to generate results</li>
            <li><span className="text-slate-300">Analytics</span> — anonymous page views and interactions via Vercel Analytics</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white mb-3">3. How we use your data</h2>
          <ul className="space-y-2 list-disc list-inside text-slate-400">
            <li>To provide and improve the Dropiq service</li>
            <li>To process payments and manage your subscription</li>
            <li>To enforce plan usage limits</li>
            <li>To send transactional emails (account confirmation, password reset)</li>
          </ul>
          <p className="mt-3 text-slate-400">We do not sell your data to third parties. We do not use your submitted content to train AI models.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white mb-3">4. Third-party services</h2>
          <ul className="space-y-2 list-disc list-inside text-slate-400">
            <li><span className="text-slate-300">Supabase</span> — authentication and database hosting</li>
            <li><span className="text-slate-300">Stripe</span> — payment processing</li>
            <li><span className="text-slate-300">Anthropic (Claude)</span> — AI content generation</li>
            <li><span className="text-slate-300">Vercel</span> — hosting and analytics</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white mb-3">5. Data retention</h2>
          <p>We retain your account data for as long as your account is active. If you delete your account, your data is removed within 30 days. Usage records are kept for billing purposes for up to 12 months.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white mb-3">6. Your rights</h2>
          <p>You have the right to access, correct, or delete your personal data at any time. To exercise these rights, contact us at the email below.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white mb-3">7. Cookies</h2>
          <p>We use cookies only for authentication (session management). We do not use advertising or tracking cookies.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white mb-3">8. Contact</h2>
          <p>For any privacy-related questions: <a href="mailto:support@dropiq.io" className="text-violet-400 hover:text-violet-300">support@dropiq.io</a></p>
        </section>
      </div>
    </div>
  );
}
