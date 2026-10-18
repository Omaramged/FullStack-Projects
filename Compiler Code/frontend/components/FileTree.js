"use client";

import { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  File,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";

function buildTree(files) {
  const nodes = new Map();
  nodes.set("", { name: "", path: "", type: "root", children: [] });

  function getFolder(path) {
    if (nodes.has(path)) return nodes.get(path);

    const node = { name: path.split("/").pop(), path, type: "folder", children: [] };
    nodes.set(path, node);

    const parentPath = path.includes("/") ? path.slice(0, path.lastIndexOf("/")) : "";
    getFolder(parentPath).children.push(node);

    return node;
  }

  for (const file of files) {
    if (file.type === "folder") {
      getFolder(file.folder ? file.folder + "/" + file.name : file.name);
    } else {
      getFolder(file.folder).children.push(file);
    }
  }

  for (const node of nodes.values()) {
    node.children.sort((a, b) => {
      if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  }

  return nodes.get("");
}

function FileRow({ node, depth, ...handlers }) {
  const [open, setOpen] = useState(true);

  return (
    <div>
      <div
        onClick={() => {
          if (node.type === "folder") setOpen(!open);
          else handlers.onOpenFile(node);
        }}
        style={{ paddingLeft: depth * 12 + 8 }}
        className={`group flex cursor-default items-center gap-1.5 rounded-md py-1 pr-1 text-[13px] transition hover:bg-elevated ${
          node.type === "file" && node._id === handlers.activeFileId
            ? "bg-elevated text-accent"
            : "text-ink2"
        }`}
      >
        {node.type === "folder" ? (
          <>
            <span className="shrink-0 text-muted">
              {open ? (
                <ChevronDown className="h-3.5 w-3.5" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5" />
              )}
            </span>
            <Folder className="h-3.5 w-3.5 shrink-0 text-warning" />
            <span className="truncate">{node.name}</span>
            <span className="ml-auto hidden shrink-0 items-center group-hover:flex">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlers.onNewFile(node.path);
                }}
                title="New file in this folder"
                className="rounded p-0.5 transition hover:text-ink"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlers.onRename(node);
                }}
                title="Rename"
                className="rounded p-0.5 transition hover:text-ink"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlers.onDelete(node);
                }}
                title="Delete"
                className="rounded p-0.5 transition hover:text-danger"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </span>
          </>
        ) : (
          <>
            <File className="h-3.5 w-3.5 shrink-0 text-muted" />
            <span className="truncate">{node.name}</span>
            <span className="ml-auto hidden shrink-0 items-center group-hover:flex">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlers.onRename(node);
                }}
                title="Rename"
                className="rounded p-0.5 transition hover:text-ink"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlers.onDelete(node);
                }}
                title="Delete"
                className="rounded p-0.5 transition hover:text-danger"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </span>
          </>
        )}
      </div>

      {node.type === "folder" && open && (
        <div>
          {node.children.map((child) => (
            <FileRow key={child._id || child.path} node={child} depth={depth + 1} {...handlers} />
          ))}
          {node.children.length === 0 && (
            <p
              style={{ paddingLeft: (depth + 1) * 12 + 28 }}
              className="py-1 text-[12px] italic text-muted"
            >
              empty
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function FileTree(props) {
  const tree = buildTree(props.files);

  return (
    <div>
      {tree.children.map((child) => (
        <FileRow key={child._id || child.path} node={child} depth={0} {...props} />
      ))}
      {tree.children.length === 0 && <p className="mt-2 px-2 text-xs text-muted">No files yet.</p>}
    </div>
  );
}
