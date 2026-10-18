"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Editor from "@monaco-editor/react";
import {
  ArrowLeft,
  PanelLeft,
  Play,
  Save,
  Sun,
  Moon,
  SlidersHorizontal,
  X,
  Loader2,
  SquareTerminal,
  FilePlus2,
  FolderPlus,
} from "lucide-react";
import { api } from "@/lib/api";
import { runInBrowser } from "@/lib/runner";
import FileTree from "@/components/FileTree";
import ConsolePanel from "@/components/ConsolePanel";

function handleThemeToggle() {
  const isLight = document.documentElement.classList.toggle("light");

  try {
    localStorage.setItem("theme", isLight ? "light" : "dark");
  } catch (err) {}

  return isLight;
}

export default function EditorPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [project, setProject] = useState(null);
  const [files, setFiles] = useState([]);
  const [originals, setOriginals] = useState({});
  const [drafts, setDrafts] = useState({});
  const [openTabs, setOpenTabs] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [saveStatus, setSaveStatus] = useState("saved");
  const [runLoading, setRunLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [runError, setRunError] = useState("");
  const [runStatus, setRunStatus] = useState("");
  const [explorerOpen, setExplorerOpen] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [wordWrap, setWordWrap] = useState(false);
  const [minimap, setMinimap] = useState(false);
  const [lineNumbers, setLineNumbers] = useState(true);
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    setIsLight(document.documentElement.classList.contains("light"));

    try {
      const saved = JSON.parse(localStorage.getItem("editorSettings") || "{}");
      if (saved.fontSize) setFontSize(saved.fontSize);
      if (saved.wordWrap !== undefined) setWordWrap(saved.wordWrap);
      if (saved.minimap !== undefined) setMinimap(saved.minimap);
      if (saved.lineNumbers !== undefined) setLineNumbers(saved.lineNumbers);
    } catch (err) {}

    if (window.innerWidth < 768) {
      setExplorerOpen(false);
    }

    async function load() {
      try {
        const projectData = await api(`/api/projects/${id}`);
        setProject(projectData.project);

        await loadFiles();

        const data = await api(`/api/projects/${id}/files`);
        const ext = projectData.project.language === "python" ? "py" : "js";
        const entryName = projectData.project.language === "python" ? "main.py" : "main.js";

        const entry =
          data.files.find((f) => f.type === "file" && f.name === entryName) ||
          data.files.find((f) => f.type === "file" && f.name.endsWith("." + ext)) ||
          data.files.find((f) => f.type === "file");

        if (entry) {
          setOpenTabs([entry._id]);
          setActiveId(entry._id);
        }
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    }

    if (id) load();
  }, [id]);

  async function loadFiles() {
    const data = await api(`/api/projects/${id}/files`);
    setFiles(data.files);

    const originalMap = {};
    for (const file of data.files) {
      originalMap[file._id] = file.content;
    }
    setOriginals(originalMap);

    setDrafts((prev) => {
      const next = { ...prev };

      for (const file of data.files) {
        if (next[file._id] === undefined) next[file._id] = file.content;
      }

      return next;
    });
  }

  useEffect(() => {
    try {
      localStorage.setItem(
        "editorSettings",
        JSON.stringify({ fontSize, wordWrap, minimap, lineNumbers })
      );
    } catch (err) {}
  }, [fontSize, wordWrap, minimap, lineNumbers]);

  const activeFile = files.find((f) => f._id === activeId && f.type === "file");

  function dirtyFileIds() {
    const dirty = [];

    for (const fileId of Object.keys(drafts)) {
      if (drafts[fileId] !== originals[fileId]) {
        dirty.push(fileId);
      }
    }

    return dirty;
  }

  const dirtyIds = dirtyFileIds();
  const hasUnsaved = dirtyIds.length > 0;

  useEffect(() => {
    function handleBeforeUnload(e) {
      if (dirtyFileIds().length > 0) {
        e.preventDefault();
        e.returnValue = "";
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  });

  function openFile(file) {
    if (file.type !== "file") return;

    setOpenTabs((prev) => (prev.includes(file._id) ? prev : [...prev, file._id]));
    setActiveId(file._id);

    if (window.innerWidth < 768) {
      setExplorerOpen(false);
    }
  }

  function closeTab(fileId) {
    setOpenTabs(openTabs.filter((tabId) => tabId !== fileId));

    if (activeId === fileId) {
      const remaining = openTabs.filter((tabId) => tabId !== fileId);
      setActiveId(remaining[remaining.length - 1] || null);
    }
  }

  function handleEditorChange(value) {
    setDrafts({ ...drafts, [activeId]: value === undefined ? "" : value });
    setSaveStatus("unsaved");
  }

  async function saveAll() {
    const dirty = dirtyFileIds();

    if (dirty.length === 0) return true;

    function draftsForSave(ids) {
      const map = {};
      for (const fileId of ids) map[fileId] = drafts[fileId];
      return map;
    }

    setSaveStatus("saving");

    try {
      for (const fileId of dirty) {
        await api(`/api/projects/${id}/files/${fileId}`, {
          method: "PUT",
          body: { content: drafts[fileId] },
        });
      }

      setOriginals({ ...originals, ...draftsForSave(dirty) });
      setSaveStatus("saved");
      return true;
    } catch (err) {
      setSaveStatus("failed");
      alert(err.message + " Your code is still here, try saving again.");
      return false;
    }
  }

  async function runCode() {
    if (runLoading) return;

    const saved = await saveAll();
    if (!saved) return;

    const ext = project.language === "python" ? "py" : "js";
    const entryName = project.language === "python" ? "main.py" : "main.js";

    let runFile = activeFile && activeFile.name.endsWith("." + ext) ? activeFile : null;

    if (!runFile) {
      runFile =
        files.find((f) => f.type === "file" && f.name === entryName) ||
        files.find((f) => f.type === "file" && f.name.endsWith("." + ext));
    }

    if (!runFile) {
      setRunResult(null);
      setRunError(`No .${ext} file to run in this project`);
      return;
    }

    setRunLoading(true);
    setRunResult(null);
    setRunError("");
    setRunStatus("");

    const result = await runInBrowser(project.language, drafts[runFile._id], setRunStatus);

    if (result.timedOut) {
      setRunError("Stopped after 15 seconds. Your code may have an endless loop.");
    } else {
      setRunResult(result);
    }

    setRunLoading(false);
  }

  useEffect(() => {
    function handleKeyDown(e) {
      const isCtrl = e.ctrlKey || e.metaKey;

      if (isCtrl && e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveAll();
      }

      if (isCtrl && e.key === "Enter") {
        e.preventDefault();
        runCode();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  });

  async function createFile(folder) {
    const name = prompt(
      "New file name:",
      project.language === "python" ? "file.py" : "file.js"
    );

    if (!name || !name.trim()) return;

    try {
      await api(`/api/projects/${id}/files`, {
        method: "POST",
        body: { name: name.trim(), folder, type: "file" },
      });
      await loadFiles();
    } catch (err) {
      alert(err.message);
    }
  }

  async function createFolder(folder) {
    const name = prompt("New folder name:", "folder");

    if (!name || !name.trim()) return;

    try {
      await api(`/api/projects/${id}/files`, {
        method: "POST",
        body: { name: name.trim(), folder, type: "folder" },
      });
      await loadFiles();
    } catch (err) {
      alert(err.message);
    }
  }

  async function renameItem(item) {
    const newName = prompt("Rename:", item.name);

    if (!newName || !newName.trim() || newName === item.name) return;

    try {
      await api(`/api/projects/${id}/files/${item._id}/rename`, {
        method: "PUT",
        body: { name: newName.trim() },
      });
      await loadFiles();
    } catch (err) {
      alert(err.message);
    }
  }

  async function deleteItem(item) {
    if (!confirm(`Delete "${item.name}"?`)) return;

    try {
      await api(`/api/projects/${id}/files/${item._id}`, { method: "DELETE" });
      setOpenTabs((prev) => prev.filter((tabId) => tabId !== item._id));

      if (activeId === item._id) {
        const remaining = openTabs.filter((tabId) => tabId !== item._id);
        setActiveId(remaining[remaining.length - 1] || null);
      }

      await loadFiles();
    } catch (err) {
      alert(err.message);
    }
  }

  const saveLabels = {
    saved: { text: "Saved", class: "text-success" },
    unsaved: { text: "Unsaved changes", class: "text-warning" },
    saving: { text: "Saving...", class: "text-accent" },
    failed: { text: "Save failed", class: "text-danger" },
  };
  const status = saveLabels[saveStatus] || saveLabels.saved;

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-bg">
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
        <p className="text-sm text-ink2">Loading project...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg px-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-line bg-surface text-muted">
          <SquareTerminal className="h-6 w-6" />
        </span>
        <p className="text-sm text-danger">{error || "Project not found"}</p>
        <Link
          href="/dashboard"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-bg">
      <header className="flex h-12 shrink-0 items-center justify-between gap-2 border-b border-line bg-surface px-2 sm:px-3">
        <div className="flex min-w-0 items-center gap-1.5">
          <Link
            href="/dashboard"
            title="Back to dashboard"
            className="rounded-md p-1.5 text-ink2 transition hover:bg-elevated hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <button
            onClick={() => setExplorerOpen(!explorerOpen)}
            title={explorerOpen ? "Hide explorer" : "Show explorer"}
            className="rounded-md p-1.5 text-ink2 transition hover:bg-elevated hover:text-ink"
          >
            <PanelLeft className="h-4 w-4" />
          </button>
          <span className="truncate text-sm font-medium">{project.name}</span>
          <span className="hidden shrink-0 rounded-md border border-line bg-elevated px-1.5 py-0.5 font-mono text-[10px] text-ink2 sm:inline">
            {project.language === "javascript" ? "JavaScript" : "Python"}
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className={`hidden text-xs font-medium sm:inline ${status.class}`}>
            {status.text}
          </span>

          <button
            onClick={saveAll}
            disabled={!hasUnsaved || saveStatus === "saving"}
            title="Save (Ctrl+S)"
            className="flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-xs font-medium text-ink2 transition hover:bg-elevated hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Save</span>
          </button>

          <button
            onClick={runCode}
            disabled={runLoading}
            title="Run (Ctrl+Enter)"
            className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {runLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Play className="h-3.5 w-3.5" />
            )}
            Run
          </button>

          <button
            onClick={() => setIsLight(handleThemeToggle())}
            title={isLight ? "Switch to dark theme" : "Switch to light theme"}
            className="rounded-md p-1.5 text-ink2 transition hover:bg-elevated hover:text-ink"
          >
            {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>

          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              title="Editor settings"
              className="rounded-md p-1.5 text-ink2 transition hover:bg-elevated hover:text-ink"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>

            {showSettings && (
              <div className="absolute top-full right-0 z-50 mt-1.5 w-52 rounded-xl border border-line bg-surface p-3 shadow-lg">
                <div>
                  <label htmlFor="fontSize" className="block text-xs font-medium text-ink2">
                    Font size
                  </label>
                  <select
                    id="fontSize"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-line bg-elevated px-2 py-1.5 text-xs outline-none focus:border-accent"
                  >
                    <option value={12}>12</option>
                    <option value={14}>14</option>
                    <option value={16}>16</option>
                    <option value={18}>18</option>
                  </select>
                </div>

                <label className="mt-2.5 flex items-center gap-2 text-xs text-ink2">
                  <input
                    type="checkbox"
                    checked={wordWrap}
                    onChange={(e) => setWordWrap(e.target.checked)}
                    className="accent-accent"
                  />
                  Word wrap
                </label>

                <label className="mt-2 flex items-center gap-2 text-xs text-ink2">
                  <input
                    type="checkbox"
                    checked={minimap}
                    onChange={(e) => setMinimap(e.target.checked)}
                    className="accent-accent"
                  />
                  Minimap
                </label>

                <label className="mt-2 flex items-center gap-2 text-xs text-ink2">
                  <input
                    type="checkbox"
                    checked={lineNumbers}
                    onChange={(e) => setLineNumbers(e.target.checked)}
                    className="accent-accent"
                  />
                  Line numbers
                </label>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="relative flex min-h-0 flex-1">
        <aside
          className={`${
            explorerOpen ? "flex" : "hidden"
          } absolute inset-y-0 left-0 z-40 w-64 min-w-0 flex-col border-r border-line bg-surface pt-2 md:static md:w-56 md:shrink-0`}
        >
          <div className="flex items-center justify-between px-3 pb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
              Explorer
            </span>
            <div className="flex items-center gap-0.5 text-muted">
              <button
                onClick={() => createFile("")}
                title="New file"
                className="rounded p-1 transition hover:bg-elevated hover:text-ink"
              >
                <FilePlus2 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => createFolder("")}
                title="New folder"
                className="rounded p-1 transition hover:bg-elevated hover:text-ink"
              >
                <FolderPlus className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setExplorerOpen(false)}
                title="Close explorer"
                className="rounded p-1 transition hover:bg-elevated hover:text-ink md:hidden"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="overflow-y-auto pb-4">
            <FileTree
              files={files}
              activeFileId={activeId}
              onOpenFile={openFile}
              onNewFile={createFile}
              onRename={renameItem}
              onDelete={deleteItem}
            />
          </div>
        </aside>

        {explorerOpen && (
          <div
            className="absolute inset-0 z-30 bg-black/40 md:hidden"
            onClick={() => setExplorerOpen(false)}
          />
        )}

        <main className="flex min-w-0 flex-1 flex-col">
          <div className="flex h-9 shrink-0 items-stretch overflow-x-auto border-b border-line bg-bg">
            {openTabs.length === 0 && (
              <div className="flex items-center px-4 text-xs text-muted">
                Open a file from the explorer
              </div>
            )}

            {openTabs.map((tabId) => {
              const file = files.find((f) => f._id === tabId);
              if (!file) return null;

              const isDirty = drafts[tabId] !== originals[tabId];

              return (
                <div
                  key={tabId}
                  onClick={() => setActiveId(tabId)}
                  className={`group flex cursor-default items-center gap-2 border-r border-line px-3 text-xs transition ${
                    tabId === activeId
                      ? "border-t-2 border-t-accent bg-surface text-ink"
                      : "border-t-2 border-t-transparent text-ink2 hover:bg-surface"
                  }`}
                >
                  <span className="font-mono">{file.name}</span>
                  {isDirty && <span className="h-1.5 w-1.5 rounded-full bg-warning"></span>}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      closeTab(tabId);
                    }}
                    className="rounded p-0.5 text-muted transition hover:bg-elevated hover:text-ink md:opacity-0 group-hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="min-h-0 flex-1">
            {activeFile ? (
              <Editor
                key={activeFile._id}
                height="100%"
                language={project.language === "python" ? "python" : "javascript"}
                theme={isLight ? "cc-light" : "cc-dark"}
                value={drafts[activeFile._id]}
                onMount={(editor, monaco) => {
                  monaco.editor.defineTheme("cc-dark", {
                    base: "vs-dark",
                    inherit: true,
                    rules: [],
                    colors: { "editor.background": "#14171C" },
                  });
                  monaco.editor.defineTheme("cc-light", {
                    base: "vs",
                    inherit: true,
                    rules: [],
                    colors: { "editor.background": "#FFFFFF" },
                  });
                  monaco.editor.setTheme(isLight ? "cc-light" : "cc-dark");
                }}
                onChange={handleEditorChange}
                options={{
                  fontSize,
                  fontFamily: "JetBrains Mono, Consolas, monospace",
                  wordWrap: wordWrap ? "on" : "off",
                  minimap: { enabled: minimap },
                  lineNumbers: lineNumbers ? "on" : "off",
                  tabSize: 2,
                  cursorBlinking: "smooth",
                  smoothScrolling: true,
                  scrollBeyondLastLine: false,
                  padding: { top: 12 },
                }}
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-xl border border-line bg-surface text-muted">
                  <SquareTerminal className="h-7 w-7" />
                </span>
                <p className="text-sm text-ink2">Select a file to start editing</p>
                <button
                  onClick={() => setExplorerOpen(true)}
                  className="text-xs font-medium text-accent hover:underline"
                >
                  Open the file explorer
                </button>
              </div>
            )}
          </div>

          <ConsolePanel
            running={runLoading}
            status={runStatus}
            result={runResult}
            error={runError}
            onClear={() => {
              setRunResult(null);
              setRunError("");
            }}
          />
        </main>
      </div>
    </div>
  );
}
