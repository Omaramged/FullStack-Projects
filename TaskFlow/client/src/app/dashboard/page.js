"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import DashboardStats from "../../components/DashboardStats";
import TaskFilters from "../../components/TaskFilters";
import TaskCard from "../../components/TaskCard";
import TaskForm from "../../components/TaskForm";
import LoadingState from "../../components/LoadingState";
import EmptyState from "../../components/EmptyState";
import { getMe, getTasks, createTask, updateTask, deleteTask } from "../../lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [status, priority]);

  useEffect(() => {
    if (!user) return;
    const t = setTimeout(() => {
      loadTasks();
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  async function loadUser() {
    try {
      const me = await getMe();
      setUser(me);
      const list = await getTasks();
      setTasks(list);
    } catch (err) {
      router.push("/login");
      return;
    }
    setLoading(false);
  }

  async function loadTasks() {
    try {
      let q = "";
      const parts = [];
      if (search) parts.push("search=" + encodeURIComponent(search));
      if (status) parts.push("status=" + status);
      if (priority) parts.push("priority=" + priority);
      if (parts.length > 0) q = "?" + parts.join("&");
      const list = await getTasks(q);
      setTasks(list);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleCreate(data) {
    setSaving(true);
    try {
      if (editing) {
        await updateTask(editing._id, data);
        setMessage("Task updated");
      } else {
        await createTask(data);
        setMessage("Task created");
      }
      setShowForm(false);
      setEditing(null);
      await loadTasks();
    } catch (err) {
      setMessage(err.message);
    }
    setSaving(false);
    setTimeout(() => setMessage(""), 2000);
  }

  async function handleDelete(task) {
    const ok = window.confirm("Delete this task?");
    if (!ok) return;
    try {
      await deleteTask(task._id);
      setMessage("Task deleted");
      await loadTasks();
    } catch (err) {
      setMessage(err.message);
    }
    setTimeout(() => setMessage(""), 2000);
  }

  async function handleStatus(task, newStatus) {
    try {
      await updateTask(task._id, { status: newStatus });
      await loadTasks();
    } catch (err) {
      setMessage(err.message);
      setTimeout(() => setMessage(""), 2000);
    }
  }

  function openNew() {
    setEditing(null);
    setShowForm(true);
  }

  function openEdit(task) {
    setEditing(task);
    setShowForm(true);
  }

  if (loading) {
    return (
      <div>
        <Navbar user={null} />
        <div className="max-w-5xl mx-auto px-4 py-6">
          <LoadingState />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar user={user} />
      <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
            <p className="text-sm text-gray-500">Here are your tasks for today</p>
          </div>
          <button
            onClick={openNew}
            className="bg-indigo-600 hover:bg-indigo-700 hover:scale-105 transition transform text-white px-4 py-2 rounded-lg text-sm"
          >
            + New Task
          </button>
        </div>

        <DashboardStats tasks={tasks} />

        <TaskFilters
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
          priority={priority}
          setPriority={setPriority}
        />

        {message && (
          <p className="text-sm bg-green-50 text-green-700 border border-green-200 rounded-lg px-3 py-2">
            {message}
          </p>
        )}

        {error && (
          <p className="text-sm bg-red-50 text-red-600 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        {tasks.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={openEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatus}
              />
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <TaskForm
          initial={editing}
          onSubmit={handleCreate}
          onClose={() => {
            setShowForm(false);
            setEditing(null);
          }}
          saving={saving}
        />
      )}
    </div>
  );
}
