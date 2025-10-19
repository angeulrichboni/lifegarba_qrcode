"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { StatusCard } from "@/components/StatusCard";

export default function ManualPage() {
  const router = useRouter();
  const [color, setColor] = useState<"B" | "V" | "VI">("B");
  const [num, setNum] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<
    | null
    | { status: "accepted"; code: string; last_scanned_at: string }
    | { status: "used"; code: string; last_scanned_at: string | null }
    | { status: "invalid"; code: string }
    | { error: string }
  >(null);

  // Security guard: require a session flag
  useEffect(() => {
    const sec = sessionStorage.getItem("qrv:sec");
    if (!sec) {
      router.replace("/login");
    }
  }, [router]);

  const code = useMemo(() => {
    const padded = (parseInt(num || "0", 10) || 0).toString().padStart(4, "0");
    return `LG-${color}-${padded}`;
  }, [color, num]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);
    try {
      const sec = sessionStorage.getItem("qrv:sec") || "";
      const res = await fetch(`/api/verify?code=${encodeURIComponent(code)}&sec=${encodeURIComponent(sec)}`, {
        method: "GET",
        headers: { "x-security-code": sec },
        cache: "no-store",
      });
      if (res.status === 403) {
        setResult({ error: "Vous n’avez pas l’autorisation de valider ce code." });
        return;
      }
      if (!res.ok) {
        setResult({ error: "Erreur serveur, réessayez." });
        return;
      }
      const json = await res.json();
      setResult(json);
    } catch (e) {
      setResult({ error: "Erreur réseau, réessayez." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen p-4 bg-zinc-50">
      <div className="mx-auto w-full max-w-md">
        <header className="flex items-center justify-between py-2">
          <h1 className="text-lg font-medium">Validation manuelle de ticket</h1>
          <button
            onClick={() => {
              sessionStorage.removeItem("qrv:sec");
              router.replace("/login");
            }}
            className="rounded-lg border px-3 py-2 text-sm hover:bg-zinc-50"
          >
            Déconnexion
          </button>
        </header>

        <form onSubmit={submit} className="mt-4 grid gap-4 rounded-2xl border bg-white p-4 shadow-sm">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Couleur</label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { k: "B", label: "Bleu" },
                  { k: "V", label: "Vert" },
                  { k: "VI", label: "Violet" },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.k}
                  type="button"
                  onClick={() => setColor(opt.k)}
                  className={`rounded-lg px-3 py-2 text-sm border ${
                    color === opt.k ? "bg-zinc-900 text-white" : "bg-white hover:bg-zinc-50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Numéro (4 chiffres)</label>
            <input
              type="number"
              min={0}
              max={9999}
              inputMode="numeric"
              value={num}
              onChange={(e) => setNum(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-400"
              placeholder="Ex: 0010"
            />
            <p className="text-xs text-zinc-500">Code complet: <span className="font-mono">{code}</span></p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-zinc-900 text-white px-4 py-2 hover:bg-zinc-800 disabled:opacity-50"
          >
            {submitting ? "Vérification…" : "Valider"}
          </button>
        </form>

        <div className="mt-6">
          {result && "status" in result && (
            <StatusCard
              status={result.status}
              code={result.code}
              last_scanned_at={"last_scanned_at" in result ? result.last_scanned_at ?? undefined : undefined}
              onBack={() => setResult(null)}
            />
          )}
          {result && "error" in result && (
            <div className="mt-4 rounded-lg border bg-white p-4 text-sm text-rose-600">{result.error}</div>
          )}
        </div>
      </div>
    </main>
  );
}
