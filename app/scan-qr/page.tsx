"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Scanner } from "@yudiel/react-qr-scanner";

export default function ScanQRPage() {
  const router = useRouter();
  const [detected, setDetected] = useState<string | null>(null);

  const onResult = useCallback(
    (text: string) => {
      if (detected) return; // prevent multiple redirects
      setDetected(text);
      try {
        // If the QR contains a full URL with ?code=, extract it; else treat as raw code
        let code = text.trim();
        try {
          const url = new URL(text);
          code = url.searchParams.get("code") ?? url.pathname.split("/").pop() ?? text;
        } catch {
          // not a URL; keep text as code
        }
        router.replace(`/verify?code=${encodeURIComponent(code)}`);
      } catch {
        router.replace("/");
      }
    },
    [detected, router]
  );

  const constraints = useMemo<MediaTrackConstraints>(
    () => ({ facingMode: { ideal: "environment" } }),
    []
  );

  return (
    <main className="min-h-screen flex flex-col p-4 bg-zinc-50">
      <header className="flex items-center justify-between py-2">
        <h1 className="text-lg font-medium">Scanner un code</h1>
        <button
          onClick={() => router.push("/")}
          className="rounded-lg bg-zinc-900 text-white px-3 py-2 text-sm hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400"
        >
          Annuler
        </button>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <div className="w-full max-w-md aspect-square overflow-hidden rounded-2xl border bg-black">
          <Scanner
            onScan={(res: unknown) => {
              if (!res) return;
              if (typeof res === "string") return onResult(res);
              if (Array.isArray(res)) {
                const first = res[0] as unknown;
                if (first && typeof first === "object") {
                  const raw = (first as { rawValue?: unknown; data?: unknown }).rawValue ?? (first as { data?: unknown }).data ?? "";
                  const val = typeof raw === "string" ? raw : String(raw);
                  if (val) onResult(val);
                }
                return;
              }
              if (typeof res === "object") {
                const raw = (res as { rawValue?: unknown; data?: unknown }).rawValue ?? (res as { data?: unknown }).data ?? "";
                const val = typeof raw === "string" ? raw : String(raw);
                if (val) onResult(val);
              }
            }}
            onError={() => {}}
            constraints={constraints}
          />
        </div>
        <p className="text-sm text-zinc-600">
          {detected ? "Code détecté, redirection…" : "Scanning… Cadrez le QR dans le cadre"}
        </p>
      </div>
    </main>
  );
}
