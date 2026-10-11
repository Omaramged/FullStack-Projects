export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  function statusColor() {
    if (task.status === "done") return "bg-green-100 text-green-700";
    if (task.status === "in_progress") return "bg-blue-100 text-blue-700";
    return "bg-yellow-100 text-yellow-700";
  }

  function priorityColor() {
    if (task.priority === "high") return "bg-red-100 text-red-700";
    if (task.priority === "low") return "bg-gray-100 text-gray-600";
    return "bg-orange-100 text-orange-700";
  }

  function statusText() {
    if (task.status === "in_progress") return "In Progress";
    if (task.status === "done") return "Done";
    return "To Do";
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold">{task.title}</h3>
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(task)}
            className="text-xs bg-gray-100 hover:bg-gray-200 transition px-3 py-1 rounded-lg"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task)}
            className="text-xs bg-red-50 text-red-600 hover:bg-red-100 transition px-3 py-1 rounded-lg"
          >
            Delete
          </button>
        </div>
      </div>
      {task.description && (
        <p className="text-sm text-gray-500 mt-1">{task.description}</p>
      )}
      <div className="flex flex-wrap items-center gap-2 mt-3">
        <span className={`text-xs px-2 py-1 rounded-full ${statusColor()}`}>
          {statusText()}
        </span>
        <span className={`text-xs px-2 py-1 rounded-full ${priorityColor()}`}>
          {task.priority}
        </span>
        {task.dueDate && (
          <span className="text-xs text-gray-500">
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>
      <select
        value={task.status}
        onChange={(e) => onStatusChange(task, e.target.value)}
        className="mt-3 w-full text-sm border border-gray-200 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="todo">To Do</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
      </select>
    </div>
  );
}
