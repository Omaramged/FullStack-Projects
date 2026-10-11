export default function DashboardStats({ tasks }) {
  const total = tasks.length;
  const pending = tasks.filter((t) => t.status === "todo").length;
  const inProgress = tasks.filter((t) => t.status === "in_progress").length;
  const done = tasks.filter((t) => t.status === "done").length;

  const boxes = [
    { label: "Total", value: total, color: "bg-gray-900" },
    { label: "To Do", value: pending, color: "bg-yellow-500" },
    { label: "In Progress", value: inProgress, color: "bg-blue-500" },
    { label: "Done", value: done, color: "bg-green-500" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {boxes.map((b) => (
        <div
          key={b.label}
          className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow transition"
        >
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${b.color}`}></div>
            <p className="text-sm text-gray-500">{b.label}</p>
          </div>
          <p className="text-2xl font-bold mt-1">{b.value}</p>
        </div>
      ))}
    </div>
  );
}
