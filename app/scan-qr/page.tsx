"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Scanner } from "@yudiel/react-qr-scanner";

export default function ScanQRPage() {
  const router = useRouter();
  const [detected, setDetected] = useState<string | null>(null);
  const [pendingCode, setPendingCode] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [securityCode, setSecurityCode] = useState("");

  const onResult = useCallback(
    (text: string) => {
      if (detected || pendingCode) return; // prevent multiple prompts
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
        setPendingCode(code);
        setShowModal(true);
      } catch {
        router.replace("/");
      }
    },
    [detected, pendingCode, router]
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

      {showModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
            <h2 className="text-lg font-medium">Code de sécurité</h2>
            <p className="mt-1 text-sm text-zinc-600">Saisissez le code pour autoriser la validation.</p>
            <form
              className="mt-4 grid gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                if (!pendingCode) return;
                const sec = securityCode.trim();
                if (!sec) return;
                router.replace(`/verify?code=${encodeURIComponent(pendingCode)}&sec=${encodeURIComponent(sec)}`);
              }}
            >
              <input
                type="password"
                inputMode="numeric"
                autoFocus
                value={securityCode}
                onChange={(e) => setSecurityCode(e.target.value)}
                placeholder="Code sécurité"
                className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-400"
              />
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-zinc-900 text-white px-4 py-2 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400"
                >
                  Valider
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setPendingCode(null);
                    setDetected(null);
                    setSecurityCode("");
                  }}
                  className="flex-1 rounded-lg border px-4 py-2 hover:bg-zinc-50"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
