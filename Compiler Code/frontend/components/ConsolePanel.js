"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Copy, Loader2, X } from "lucide-react";

export default function ConsolePanel({ running, status, result, error, onClear }) {
  const [isTall, setIsTall] = useState(false);

  function handleCopy() {
    if (!result) return;
    let text = result.output || "";
    if (result.stderr) text += result.stderr;

    navigator.clipboard.writeText(text);
  }

  const hasContent = running || result || error;

  return (
    <div className="flex shrink-0 flex-col border-t border-line bg-surface">
      <div className="flex items-center justify-between px-3 py-1.5">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink2">Console</span>

          {running && (
            <span className="flex items-center gap-1.5 text-xs text-accent">
              <Loader2 className="h-3 w-3 animate-spin" />
              Running...
            </span>
          )}
          {!running && result && (
            <span className="text-xs text-success">
              Finished in {result.durationMs}ms
            </span>
          )}
          {!running && !result && error && <span className="text-xs text-danger">Failed</span>}
        </div>

        <div className="flex items-center gap-1 text-muted">
          {result && (
            <button
              onClick={handleCopy}
              title="Copy output"
              className="rounded p-1 transition hover:bg-elevated hover:text-ink"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          )}
          {hasContent ? (
            <button
              onClick={onClear}
              title="Clear console"
              className="rounded p-1 transition hover:bg-elevated hover:text-ink"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : null}
          <button
            onClick={() => setIsTall(!isTall)}
            title={isTall ? "Shrink console" : "Expand console"}
            className="rounded p-1 transition hover:bg-elevated hover:text-ink"
          >
            {isTall ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      <div
        className={`overflow-y-auto px-3 pb-3 font-mono text-xs leading-relaxed ${
          isTall ? "h-72" : "h-36"
        }`}
      >
        {running ? (
          <p className="text-accent">{status || "Running, waiting for the result..."}</p>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : result ? (
          <div className="whitespace-pre-wrap break-all">
            {result.compileError && (
              <p className="text-warning">{result.compileError}</p>
            )}
            {result.output && <p className="text-success">{result.output}</p>}
            {result.stderr && <p className="text-danger">{result.stderr}</p>}
            {!result.output && !result.stderr && !result.compileError && (
              <p className="text-muted">(no output)</p>
            )}
            {result.exitCode === 0 ? null : (
              <p className="mt-2 text-warning">Exit code: {result.exitCode}</p>
            )}
          </div>
        ) : (
          <p className="text-muted">
            Press the Run button or Ctrl+Enter to execute your code.
          </p>
        )}
      </div>
    </div>
  );
}
