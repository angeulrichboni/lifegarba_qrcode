"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (!code) {
      setState({ kind: "invalid", code: "" });
      return;
    }
    setState({ kind: "loading" });
    const controller = new AbortController();
    fetch(`/api/verify?code=${encodeURIComponent(code)}`, {
      method: "GET",
      signal: controller.signal,
      cache: "no-store",
    })
      .then(async (res) => {
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
  }, [code]);

  const onBack = () => router.push("/");

  if (state.kind === "idle" || state.kind === "loading") {
    return <StatusCard status="loading" code={code} onBack={onBack} />;
  }
  if (state.kind === "error") {
    return <StatusCard status="error" code={code} onBack={onBack} />;
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
