"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [sec, setSec] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const val = sec.trim();
    if (!val) return setError("Veuillez saisir le code de sécurité.");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/check", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ securityCode: val }),
      });
      if (res.status === 200) {
        // Stocker un indicateur de session très simple (local)
        sessionStorage.setItem("qrv:sec", val);
        router.replace("/manual");
      } else if (res.status === 403) {
        setError("Code de sécurité incorrect.");
      } else {
        setError("Service indisponible, réessayez.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-zinc-50">
      <div className="w-full max-w-sm rounded-2xl border bg-white p-6 shadow-lg">
        <h1 className="text-xl font-semibold">Connexion</h1>
        <p className="mt-1 text-sm text-zinc-600">Entrez le code de sécurité pour accéder à la saisie.</p>
        <form onSubmit={submit} className="mt-4 grid gap-3">
          <input
            type="password"
            autoFocus
            value={sec}
            onChange={(e) => setSec(e.target.value)}
            placeholder="Code de sécurité"
            className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-400"
          />
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-800 disabled:opacity-50"
          >
            {loading ? "Vérification…" : "Se connecter"}
          </button>
        </form>
      </div>
    </main>
  );
}
