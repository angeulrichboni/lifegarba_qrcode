"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { StatusCard } from "@/components/StatusCard";

export default function VerifyClient() {
  const search = useSearchParams();
  const router = useRouter();
  const code = (search.get("code") || "").trim();

  const [state, setState] = useState<
    | { kind: "idle" | "loading" }
    | { kind: "accepted"; code: string; last_scanned_at: string }
    | { kind: "used"; code: string; last_scanned_at: string | null }
    | { kind: "invalid"; code: string }
    | { kind: "error" }
  >({ kind: "idle" });

  const secFromUrl = useMemo(() => (search.get("sec") || "").trim(), [search]);

  useEffect(() => {
    if (!code) {
      setState({ kind: "invalid", code: "" });
      return;
    }
    const sec = secFromUrl;
    if (!sec) {
      setState({ kind: "error" });
      return;
    }

    setState({ kind: "loading" });
    const controller = new AbortController();
    fetch(`/api/verify?code=${encodeURIComponent(code)}&sec=${encodeURIComponent(sec)}`, {
      method: "GET",
      signal: controller.signal,
      cache: "no-store",
      headers: { "x-security-code": sec },
    })
      .then(async (res) => {
        if (res.status === 403) throw new Error("unauthorized");
        if (!res.ok) throw new Error("bad_response");
        return res.json();
      })
      .then((json) => {
        if (json.status === "accepted") {
          setState({ kind: "accepted", code: json.code, last_scanned_at: json.last_scanned_at });
        } else if (json.status === "used") {
          setState({ kind: "used", code: json.code, last_scanned_at: json.last_scanned_at ?? null });
        } else {
          setState({ kind: "invalid", code });
        }
      })
      .catch(() => setState({ kind: "error" }));

    return () => controller.abort();
  }, [code, secFromUrl]);

  const onBack = () => router.push("/");

  if (state.kind === "idle" || state.kind === "loading") {
    return <StatusCard status="loading" code={code} onBack={onBack} />;
  }
  if (state.kind === "error") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-2xl border bg-white p-6 shadow-lg">
          <h2 className="text-lg font-semibold">Autorisation requise</h2>
          <p className="mt-2 text-sm text-zinc-600">Veuillez ouvrir le scanner et saisir le code de sécurité.</p>
          <div className="mt-4">
            <button
              onClick={() => router.push("/scan-qr")}
              className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400"
            >
              Ouvrir le scanner
            </button>
          </div>
        </div>
      </div>
    );
  }
  if (state.kind === "accepted") {
    return (
      <StatusCard
        status="accepted"
        code={state.code}
        last_scanned_at={state.last_scanned_at}
        onBack={onBack}
      />
    );
  }
  if (state.kind === "used") {
    return (
      <StatusCard
        status="used"
        code={state.code}
        last_scanned_at={state.last_scanned_at ?? undefined}
        onBack={onBack}
      />
    );
  }
  return <StatusCard status="invalid" code={code} onBack={onBack} />;
}
