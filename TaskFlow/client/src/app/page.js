import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
              T
            </div>
            <span className="font-bold text-lg">TaskFlow</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 transition">
              Login
            </Link>
            <Link
              href="/register"
              className="text-sm bg-indigo-600 hover:bg-indigo-700 transition text-white px-4 py-2 rounded-lg"
            >
              Sign up
            </Link>
          </div>
        </div>
      </nav>
      <main className="flex-1 max-w-5xl mx-auto px-4 py-16 w-full text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Manage your tasks simply
        </h1>
        <p className="text-gray-500 mt-4 max-w-md mx-auto">
          Create an account, add tasks, set priorities and track your progress.
        </p>
        <div className="flex gap-3 justify-center mt-8">
          <Link
            href="/register"
            className="bg-indigo-600 hover:bg-indigo-700 hover:scale-105 transition transform text-white px-6 py-3 rounded-lg font-medium"
          >
            Get Started
          </Link>
          <Link
            href="/dashboard"
            className="bg-white border border-gray-200 hover:shadow transition px-6 py-3 rounded-lg font-medium"
          >
            Dashboard
          </Link>
        </div>
        <div className="grid sm:grid-cols-3 gap-3 mt-12 text-left">
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow transition">
            <p className="font-semibold">Create tasks</p>
            <p className="text-sm text-gray-500 mt-1">Add title, description, priority and due date.</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow transition">
            <p className="font-semibold">Track status</p>
            <p className="text-sm text-gray-500 mt-1">Move tasks from to do to done easily.</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow transition">
            <p className="font-semibold">Search & filter</p>
            <p className="text-sm text-gray-500 mt-1">Find tasks by title, status or priority.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
