"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  SquareTerminal,
  Plus,
  Search,
  Star,
  Trash2,
  Copy,
  Pencil,
  FolderOpen,
  Sun,
  Moon,
  LogOut,
} from "lucide-react";
import { api, getUser, logout } from "@/lib/api";
import NewProjectModal from "@/components/NewProjectModal";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function handleThemeToggle() {
  const isLight = document.documentElement.classList.toggle("light");

  try {
    localStorage.setItem("theme", isLight ? "light" : "dark");
  } catch (err) {}

  return isLight;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [starredOnly, setStarredOnly] = useState("all");
  const [sortBy, setSortBy] = useState("updated");
  const [showModal, setShowModal] = useState(false);
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    setIsLight(document.documentElement.classList.contains("light"));

    async function load() {
      try {
        const me = await api("/api/auth/me");
        setUser(me.user);

        const data = await api("/api/projects");
        setProjects(data.projects);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    }

    load();
  }, []);

  function visibleProjects() {
    let list = projects.filter((p) =>
      (p.name + " " + (p.description || "")).toLowerCase().includes(search.toLowerCase())
    );

    if (starredOnly === "starred") {
      list = list.filter((p) => p.isStarred);
    }

    if (sortBy === "name") {
      list = list.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      list = list.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }

    return list;
  }

  async function toggleStar(project) {
    try {
      const data = await api(`/api/projects/${project._id}`, {
        method: "PUT",
        body: { isStarred: !project.isStarred },
      });
      setProjects(projects.map((p) => (p._id === project._id ? data.project : p)));
    } catch (err) {
      alert(err.message);
    }
  }

  async function renameProject(project) {
    const name = prompt("Rename project:", project.name);

    if (!name || !name.trim()) return;

    try {
      const data = await api(`/api/projects/${project._id}`, {
        method: "PUT",
        body: { name },
      });
      setProjects(projects.map((p) => (p._id === project._id ? data.project : p)));
    } catch (err) {
      alert(err.message);
    }
  }

  async function duplicateProject(project) {
    try {
      const data = await api(`/api/projects/${project._id}/duplicate`, { method: "POST" });
      setProjects([data.project, ...projects]);
    } catch (err) {
      alert(err.message);
    }
  }

  async function deleteProject(project) {
    if (!confirm(`Delete "${project.name}" and all of its files? This cannot be undone.`)) return;

    try {
      await api(`/api/projects/${project._id}`, { method: "DELETE" });
      setProjects(projects.filter((p) => p._id !== project._id));
    } catch (err) {
      alert(err.message);
    }
  }

  function handleLogout() {
    logout();
    router.push("/login");
  }

  const shown = visibleProjects();

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
              <SquareTerminal className="h-5 w-5 text-white" />
            </span>
            <span className="text-base font-semibold tracking-tight">Compiler Code</span>
          </Link>

          <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLight(handleThemeToggle())}
            title={isLight ? "Switch to dark theme" : "Switch to light theme"}
            >
              {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
            <div className="hidden text-sm text-ink2 sm:block">
              {user ? user.name : "Loading..."}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-2 text-sm text-ink2 transition hover:bg-elevated hover:text-ink"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
              {user ? `Welcome back, ${user.name}` : "Welcome back"}
            </h1>
            <p className="mt-1 text-sm text-ink2">
              {projects.length === 0
                ? "Create your first project to get started"
                : `You have ${projects.length} project${projects.length === 1 ? "" : "s"}`}
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            New Project
          </button>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="w-full rounded-lg border border-line bg-surface py-2 pr-3 pl-9 text-sm outline-none transition focus:border-accent"
            />
          </div>

          <select
            value={starredOnly}
            onChange={(e) => setStarredOnly(e.target.value)}
            className="rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink2 outline-none transition focus:border-accent"
          >
            <option value="all">All projects</option>
            <option value="starred">Starred only</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink2 outline-none transition focus:border-accent"
          >
            <option value="updated">Last updated</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>

        {error && (
          <p className="mt-6 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </p>
        )}

        {loading ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-44 animate-pulse rounded-xl border border-line bg-surface">
                <div className="h-full w-full rounded-xl bg-elevated/50" />
              </div>
            ))}
          </div>
        ) : shown.length === 0 ? (
          <div className="mt-6 flex flex-col items-center rounded-xl border border-dashed border-line bg-surface px-6 py-16 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-line bg-elevated text-muted">
              <FolderOpen className="h-6 w-6" />
            </span>
            <h2 className="mt-4 font-semibold">
              {search || starredOnly === "starred" ? "No projects found" : "No projects yet"}
            </h2>
            <p className="mt-1 max-w-xs text-sm text-ink2">
              {search || starredOnly === "starred"
                ? "Try a different search or filter."
                : "Your projects live here. Create your first one and start coding."}
            </p>
            {!search && starredOnly === "all" && (
              <button
                onClick={() => setShowModal(true)}
                className="mt-5 flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
              >
                <Plus className="h-4 w-4" />
                Create Your First Project
              </button>
            )}
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((project) => (
              <div
                key={project._id}
                className="group flex flex-col rounded-xl border border-line bg-surface p-5 transition duration-200 hover:-translate-y-0.5 hover:border-accent"
              >
                <div className="flex items-start justify-between">
                  <span className="rounded-md border border-line bg-elevated px-1.5 py-0.5 font-mono text-[11px] text-ink2">
                    {project.language === "javascript" ? "JavaScript" : "Python"}
                  </span>
                  <button
                    onClick={() => toggleStar(project)}
                    title={project.isStarred ? "Remove star" : "Star project"}
                    className="rounded-md p-1 text-muted transition hover:bg-elevated hover:text-warning"
                  >
                    <Star
                      className={`h-4 w-4 ${project.isStarred ? "fill-warning text-warning" : ""}`}
                    />
                  </button>
                </div>

                <h2 className="mt-3 truncate font-semibold">{project.name}</h2>
                <p className="mt-1 line-clamp-2 min-h-10 text-sm text-ink2">
                  {project.description || "No description yet."}
                </p>
                <p className="mt-2 text-xs text-muted">
                  Updated {formatDate(project.updatedAt)}
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
                  <Link
                    href={`/editor/${project._id}`}
                    className="rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-white transition hover:opacity-90"
                  >
                    Open
                  </Link>
                  <div className="flex items-center gap-0.5 text-muted">
                    <button
                      onClick={() => renameProject(project)}
                      title="Rename"
                      className="rounded-md p-1.5 transition hover:bg-elevated hover:text-ink"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => duplicateProject(project)}
                      title="Duplicate"
                      className="rounded-md p-1.5 transition hover:bg-elevated hover:text-ink"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => deleteProject(project)}
                      title="Delete"
                      className="rounded-md p-1.5 transition hover:bg-elevated hover:text-danger"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <NewProjectModal
          onClose={() => setShowModal(false)}
          onCreated={(project) => {
            setProjects([project, ...projects]);
            setShowModal(false);
            router.push(`/editor/${project._id}`);
          }}
        />
      )}
    </div>
  );
}
