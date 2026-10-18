"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

export default function NewProjectModal({ onClose, onCreated }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter a project name");
      return;
    }

    setLoading(true);

    try {
      const data = await api("/api/projects", {
        method: "POST",
        body: { name, description, language },
      });
      onCreated(data.project);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl border border-line bg-surface p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">New project</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-ink2 transition hover:bg-elevated hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label htmlFor="projectName" className="block text-sm font-medium">
              Name
            </label>
            <input
              id="projectName"
              type="text"
              maxLength={60}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-line bg-elevated px-3 py-2 text-sm outline-none transition focus:border-accent"
              placeholder="My first project"
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="projectDescription" className="block text-sm font-medium">
              Description{" "}
              <span className="font-normal text-muted">(optional)</span>
            </label>
            <input
              id="projectDescription"
              type="text"
              maxLength={200}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-line bg-elevated px-3 py-2 text-sm outline-none transition focus:border-accent"
              placeholder="What is this project about?"
            />
          </div>

          <div>
            <label htmlFor="projectLanguage" className="block text-sm font-medium">
              Language
            </label>
            <select
              id="projectLanguage"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-line bg-elevated px-3 py-2 text-sm outline-none transition focus:border-accent"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
            </select>
            <p className="mt-1.5 text-xs text-muted">
              A starter <span className="font-mono">main</span> file is created automatically.
            </p>
          </div>

          {error && (
            <p className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink2 transition hover:bg-elevated hover:text-ink"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
