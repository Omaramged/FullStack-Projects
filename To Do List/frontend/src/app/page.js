"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Auth states
  const [token, setToken] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [isLoginView, setIsLoginView] = useState(true);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState(null);

  const API_URL = "http://localhost:5000/api";

  useEffect(() => {
    // Check if user is logged in
    const savedToken = localStorage.getItem("token");
    const savedEmail = localStorage.getItem("userEmail");
    if (savedToken) {
      setToken(savedToken);
      setUserEmail(savedEmail);
      fetchTodos(savedToken);
    }
  }, []);

  const fetchTodos = async (currentToken) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/todos`, {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch todos");
      const data = await res.json();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError("Could not load tasks.");
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError(null);
    const endpoint = isLoginView ? "/auth/login" : "/auth/register";

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: authEmail, password: authPassword }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Auth failed");

      if (isLoginView) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userEmail", data.email);
        setToken(data.token);
        setUserEmail(data.email);
        fetchTodos(data.token);
      } else {
        setIsLoginView(true); // Switch to login after register
        setAuthError("Registration successful! Please login.");
      }
      setAuthPassword("");
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setToken(null);
    setUserEmail("");
    setTodos([]);
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await fetch(`${API_URL}/todos`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error("Failed to add todo");
      const newTodo = await res.json();
      setTodos([newTodo, ...todos]);
      setTitle("");
    } catch (err) {
      setError("Could not add task.");
    }
  };

  const handleToggleTodo = async (id, currentStatus) => {
    try {
      const res = await fetch(`${API_URL}/todos/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ completed: !currentStatus }),
      });
      if (!res.ok) throw new Error("Failed to update todo");
      const updatedTodo = await res.json();
      setTodos(
        todos.map((todo) => (todo._id === id ? updatedTodo : todo))
      );
    } catch (err) {
      setError("Could not update task.");
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      const res = await fetch(`${API_URL}/todos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Failed to delete todo");
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (err) {
      setError("Could not delete task.");
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
          <h2 className="text-3xl font-bold text-center text-gray-800">
            {isLoginView ? "Sign In" : "Sign Up"}
          </h2>
          {authError && (
            <div className={`p-3 rounded text-sm ${authError.includes('successful') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {authError}
            </div>
          )}
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
            >
              {isLoginView ? "Login" : "Register"}
            </button>
          </form>
          <div className="text-center text-sm text-gray-600">
            {isLoginView ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => {
                setIsLoginView(!isLoginView);
                setAuthError(null);
              }}
              className="text-blue-600 hover:underline"
            >
              {isLoginView ? "Sign Up" : "Sign In"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex py-10 px-4 sm:px-6 lg:px-8 justify-center">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 space-y-6 h-fit">
        <div className="flex justify-between items-center border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-red-500 hover:text-red-700 font-medium"
          >
            Logout
          </button>
        </div>
        
        <p className="text-sm text-gray-500">Logged in as: {userEmail}</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        <form onSubmit={handleAddTodo} className="flex gap-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
          >
            Add
          </button>
        </form>

        {loading ? (
          <div className="text-center text-gray-500 py-4">Loading tasks...</div>
        ) : todos.length === 0 ? (
          <div className="text-center text-gray-500 py-4 border-2 border-dashed border-gray-200 rounded-lg">
            No tasks yet. Add one above!
          </div>
        ) : (
          <ul className="space-y-3">
            {todos.map((todo) => (
              <li
                key={todo._id}
                className="group flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 border border-gray-200 transition duration-200 ease-in-out"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleTodo(todo._id, todo.completed)}
                    className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <span
                    className={`truncate text-lg ${
                      todo.completed
                        ? "text-gray-400 line-through"
                        : "text-gray-700"
                    } transition-colors duration-200`}
                  >
                    {todo.title}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteTodo(todo._id)}
                  className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:outline-none"
                  aria-label="Delete todo"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
