export default function EmptyState() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-8 text-center shadow-sm">
      <p className="font-semibold">No tasks found</p>
      <p className="text-sm text-gray-500 mt-1">
        Create your first task or try different filters.
      </p>
    </div>
  );
}
