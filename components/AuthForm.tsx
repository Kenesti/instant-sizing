"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email.includes("@")) return setError("Enter a valid email address.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    setBusy(true);
    try {
      if (mode === "signup") {
        const user = { name: name.trim() || email.split("@")[0], email, plan: "Free" };
        localStorage.setItem("is_user", JSON.stringify(user));
        localStorage.setItem("is_history", JSON.stringify([]));
        localStorage.setItem("is_credits", JSON.stringify({ used: 0, total: 5 }));
      } else {
        const existing = localStorage.getItem("is_user");
        if (existing) {
          const u = JSON.parse(existing);
          if (u.email.toLowerCase() !== email.toLowerCase()) {
            setError("No account found for that email. Sign up instead?");
            setBusy(false);
            return;
          }
        } else {
          const user = { name: email.split("@")[0], email, plan: "Free" };
          localStorage.setItem("is_user", JSON.stringify(user));
          localStorage.setItem("is_history", JSON.stringify([]));
          localStorage.setItem("is_credits", JSON.stringify({ used: 0, total: 5 }));
        }
      }
      router.push("/dashboard");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="card mx-auto w-full max-w-md p-8">
      <h1 className="text-2xl font-bold">{mode === "login" ? "Welcome back" : "Create your free account"}</h1>
      <p className="mt-2 text-sm text-muted">
        {mode === "login" ? "Log in to see your history and credits." : "Free forever. 5 AI background removals per day, no card required."}
      </p>

      <div className="mt-6 space-y-4">
        {mode === "signup" && (
          <div>
            <label htmlFor="name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">Name</label>
            <input id="name" value={name} onChange={(e) => setName(e.target.value)} className="field" placeholder="Alex Rivera" autoComplete="name" />
          </div>
        )}
        <div>
          <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field" placeholder="you@example.com" autoComplete="email" required />
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">Password</label>
          <div className="relative">
            <input id="password" type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="field pr-10" placeholder="••••••••" autoComplete={mode === "login" ? "current-password" : "new-password"} required />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300" aria-label={showPw ? "Hide password" : "Show password"}>
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-rose-400">{error}</p>}

      <button type="submit" disabled={busy} className="btn-primary mt-6 w-full">
        {busy ? "Just a moment…" : mode === "login" ? "Log in" : "Create account"}
      </button>

      <p className="mt-5 text-center text-sm text-muted">
        {mode === "login" ? (
          <>New here? <Link href="/signup" className="font-medium text-violet-300 hover:underline">Sign up free</Link></>
        ) : (
          <>Already have an account? <Link href="/login" className="font-medium text-violet-300 hover:underline">Log in</Link></>
        )}
      </p>
    </form>
  );
}
