import Link from "next/link";
import {
  SquareTerminal,
  Code2,
  FolderKanban,
  Play,
  Save,
  Focus,
  Keyboard,
  ArrowRight,
  Check,
} from "lucide-react";

const features = [
  { icon: Code2, title: "Professional editor", text: "Write code in Monaco with syntax highlighting, line numbers, folding and search built in." },
  { icon: FolderKanban, title: "Projects and files", text: "Organize your work into projects with folders, tabs and clear file management." },
  { icon: Play, title: "Run your code", text: "Execute JavaScript and Python instantly and inspect the output in the console." },
  { icon: Save, title: "Saved for later", text: "Everything you write persists in your account, ready whenever you come back." },
  { icon: Focus, title: "Distraction-free", text: "A calm, focused interface with just the panels you need and none you don't." },
  { icon: Keyboard, title: "Keyboard friendly", text: "Ctrl+S to save, Ctrl+Enter to run, and shortcuts that never leave the flow." },
];

const steps = [
  { number: "01", title: "Create a project", text: "Pick a name and a language." },
  { number: "02", title: "Write your code", text: "Use the editor and file explorer." },
  { number: "03", title: "Run and inspect", text: "See output, errors and timing." },
  { number: "04", title: "Save and continue", text: "Reopen any project later." },
];

const languages = [
  {
    name: "JavaScript",
    detail: "Executed on Node 18 in an isolated runner.",
  },
  {
    name: "Python",
    detail: "Executed on Python 3.10 in an isolated runner.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-line">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
              <SquareTerminal className="h-5 w-5 text-white" />
            </span>
            <span className="text-base font-semibold tracking-tight">Compiler Code</span>
          </Link>

          <div className="hidden items-center gap-7 text-sm text-ink2 md:flex">
            <a href="#features" className="transition-colors hover:text-ink">Features</a>
            <a href="#how-it-works" className="transition-colors hover:text-ink">How it works</a>
            <a href="#languages" className="transition-colors hover:text-ink">Supported Languages</a>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-lg px-3 py-2 text-sm font-medium text-ink2 transition-colors hover:text-ink"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-accent px-3.5 py-2 text-sm font-medium text-white transition hover:opacity-90"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-4 pt-16 pb-20 sm:px-6 sm:pt-24">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-ink2">
              <span className="h-1.5 w-1.5 rounded-full bg-success"></span>
              A focused coding workspace in your browser
            </span>

            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Your Code. Your Space.{" "}
              <span className="text-accent">Your Flow.</span>
            </h1>

            <p className="mt-5 text-base leading-relaxed text-ink2 sm:text-lg">
              A focused coding workspace to build projects, experiment with ideas, and run your
              code without the friction of a complicated setup.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/register"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 sm:w-auto"
              >
                Start Coding
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href="#features"
                className="inline-flex w-full items-center justify-center rounded-lg border border-line bg-surface px-5 py-3 text-sm font-medium text-ink transition hover:border-accent sm:w-auto"
              >
                Explore Features
              </a>
            </div>
          </div>

          <div className="mx-auto mt-14 max-w-3xl">
            <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-2xl shadow-black/30">
              <div className="flex items-center justify-between border-b border-line bg-elevated px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#F16D7A]"></span>
                  <span className="h-3 w-3 rounded-full bg-[#EAB96B]"></span>
                  <span className="h-3 w-3 rounded-full bg-[#48C78E]"></span>
                </div>
                <span className="font-mono text-xs text-muted">main.js</span>
                <span className="flex items-center gap-1.5 rounded-md border border-line px-2 py-0.5 font-mono text-[11px] text-success">
                  Saved
                </span>
              </div>

              <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed sm:p-5">
                <code className="block text-ink2">
                  <div className="text-muted">{"// A quick start"}</div>
                  <div>
                    <span className="text-[#7C8CFF]">function</span>{" "}
                    <span className="text-warning">greet</span>(name) {"{"}
                  </div>
                  <div>
                    {"  "}
                    <span className="text-[#7C8CFF]">return</span>{" "}
                    <span className="text-[#48C78E]">"Hello, " + name + "!"</span>;
                  </div>
                  <div>{"}"}</div>
                  <div>{" "}</div>
                  <div>
                    console.<span className="text-warning">log</span>(
                    <span className="text-warning">greet</span>(
                    <span className="text-[#48C78E]">"compiler code"</span>));
                  </div>
                </code>
              </pre>

              <div className="border-t border-line bg-elevated">
                <div className="flex items-center justify-between px-4 py-2">
                  <span className="font-mono text-xs text-muted">Console</span>
                  <span className="font-mono text-[11px] text-success">Finished in 220ms</span>
                </div>
                <pre className="overflow-x-auto px-4 pb-4 font-mono text-[13px] text-ink2">
                  <code className="block">Hello, compiler code!</code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="border-t border-line bg-surface">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Everything you need to code
            </h2>
            <p className="mt-3 max-w-xl text-ink2">
              The essentials of a good coding workspace, nothing else in the way.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group rounded-xl border border-line bg-bg p-5 transition duration-200 hover:-translate-y-0.5 hover:border-accent"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-elevated text-accent transition group-hover:border-accent">
                    <feature.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-semibold">{feature.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink2">{feature.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="border-t border-line">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">How it works</h2>
            <p className="mt-3 max-w-xl text-ink2">Four steps from idea to running code.</p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step) => (
                <div key={step.number} className="rounded-xl border border-line bg-surface p-5">
                  <span className="font-mono text-sm font-medium text-accent">{step.number}</span>
                  <h3 className="mt-3 font-semibold">{step.title}</h3>
                  <p className="mt-1.5 text-sm text-ink2">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="languages" className="border-t border-line bg-surface">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Supported languages</h2>
            <p className="mt-3 max-w-xl text-ink2">
              Only languages that actually run in the workspace are listed here.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {languages.map((language) => (
                <div
                  key={language.name}
                  className="rounded-xl border border-line bg-bg p-5 transition hover:border-accent"
                >
                  <code className="font-mono text-sm font-semibold">{language.name}</code>
                  <p className="mt-2 text-sm text-ink2">{language.detail}</p>
                  <span className="mt-4 flex items-center gap-1.5 text-xs font-medium text-success">
                    <Check className="h-3.5 w-3.5" />
                    Runs in workspace
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent">
                <SquareTerminal className="h-4 w-4 text-white" />
              </span>
              <span className="text-sm font-semibold">Compiler Code</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-ink2">
              <a href="#features" className="transition-colors hover:text-ink">Features</a>
              <a href="#languages" className="transition-colors hover:text-ink">Languages</a>
              <Link href="/login" className="transition-colors hover:text-ink">Sign in</Link>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-muted sm:text-left">
            © {new Date().getFullYear()} Compiler Code. Run in your browser, saved in your account.
          </p>
        </div>
      </footer>
    </div>
  );
}
