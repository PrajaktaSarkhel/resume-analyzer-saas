import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-bold">
        Resume Analyzer SaaS
      </h1>

      <div className="flex gap-4">
        <Link
          href="/signup"
          className="px-4 py-2 bg-black text-white rounded"
        >
          Sign Up
        </Link>

        <Link
          href="/login"
          className="px-4 py-2 border rounded"
        >
          Login
        </Link>
      </div>
    </main>
  );
}
