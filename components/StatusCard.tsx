"use client";

import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

export type StatusKind = "accepted" | "used" | "invalid" | "loading" | "error";

export function StatusCard(props: {
  status: StatusKind;
  code?: string;
  last_scanned_at?: string | null;
  onBack?: () => void;
}) {
  const { status, code, last_scanned_at, onBack } = props;

  const map = {
    accepted: {
      title: "Code accepté",
      desc: "Ce code a été validé avec succès.",
      ring: "ring-emerald-200/60",
      text: "text-emerald-600",
      Icon: CheckCircle2,
    },
    used: {
      title: "Code déjà utilisé",
      desc: "Ce code a déjà été consommé.",
      ring: "ring-amber-200/60",
      text: "text-amber-600",
      Icon: AlertTriangle,
    },
    invalid: {
      title: "Code invalide",
      desc: "Ce code n'est pas reconnu.",
      ring: "ring-rose-200/60",
      text: "text-rose-600",
      Icon: XCircle,
    },
    loading: {
      title: "Vérification…",
      desc: "Veuillez patienter quelques instants.",
      ring: "ring-zinc-200/60",
      text: "text-zinc-600",
      Icon: AlertTriangle,
    },
    error: {
      title: "Erreur",
      desc: "Impossible de vérifier pour le moment.",
      ring: "ring-zinc-200/60",
      text: "text-zinc-600",
      Icon: AlertTriangle,
    },
  } as const;

  const current = map[status];
  const Icon = current.Icon;

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25 }}
        className={`w-full max-w-md rounded-2xl border bg-white p-6 shadow-lg ring-1 ${current.ring}`}
      >
        <div className="flex items-center gap-3">
          <Icon className={`h-8 w-8 ${current.text}`} />
          <h2 className="text-xl font-semibold">{current.title}</h2>
        </div>
        <p className="mt-2 text-sm text-zinc-600">{current.desc}</p>
        {code ? (
          <p className="mt-4 text-sm">
            Code: <span className="font-medium">{code}</span>
          </p>
        ) : null}
        {last_scanned_at ? (
          <p className="mt-1 text-xs text-zinc-500">
            Dernier scan: {new Date(last_scanned_at).toLocaleString()}
          </p>
        ) : null}
        {/* {onBack ? (
          <div className="mt-6">
            <button
              onClick={onBack}
              className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400"
            >
              Scanner un autre code
            </button>
          </div>
        ) : null} */}
      </motion.div>
    </div>
  );
}
