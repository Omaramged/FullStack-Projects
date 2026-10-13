export const metadata = {
  title: "Terms of Service - Linkly",
  description: "Rules for using Linkly.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 w-full">
      <h1 className="text-3xl font-bold">Terms of Service</h1>
      <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4 text-sm text-slate-600">
        <p>You must be at least 13 years old to use Linkly.</p>
        <p>Do not shorten links to spam, phishing pages, malware, or any illegal content. We may deactivate abusive links at any time.</p>
        <p>Guest links are anonymous and cannot be recovered or managed later. Register an account to manage your links.</p>
        <p>Expired or deactivated links stop redirecting immediately. Click statistics are provided as-is with no accuracy guarantees.</p>
        <p>We may rate-limit shortening to keep the service stable for everyone.</p>
      </div>
    </div>
  );
}
