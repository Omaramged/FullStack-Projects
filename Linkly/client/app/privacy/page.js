export const metadata = {
  title: "Privacy Policy - Linkly",
  description: "How Linkly handles your data.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 w-full">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4 text-sm text-slate-600">
        <p>Linkly stores your name, username, email, and a hashed password when you register. Passwords are never stored in plain text.</p>
        <p>For each short link we store the destination URL, title, expiration date, and click count. Each visit to a short link records the time, referrer, browser, operating system, and device type.</p>
        <p>We do not store IP addresses or location data. Click totals are raw counts and may include bots and repeated visits.</p>
        <p>Your links and analytics are private to your account. We never sell personal data.</p>
      </div>
    </div>
  );
}
