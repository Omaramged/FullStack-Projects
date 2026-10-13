import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-2 text-slate-500 text-sm">This page could not be found.</p>
      <Link href="/" className="inline-block mt-4 text-sm bg-blue-600 text-white px-4 py-2 rounded-lg">Go home</Link>
    </div>
  );
}
