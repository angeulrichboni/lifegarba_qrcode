export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-zinc-50">
      <div className="w-full max-w-lg text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">QR Validation App</h1>
        <p className="mt-2 text-zinc-600">Validez instantanément des codes uniques scannés via QR.</p>

        <div className="mt-8 grid gap-3">
          <a
            href="/scan-qr"
            className="rounded-lg bg-zinc-900 text-white px-4 py-3 text-center hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400"
          >
            Vérifier un code
          </a>
          <p className="text-xs text-zinc-500">
            Scannez un QR pointant vers <code className="font-mono">/scan/&lt;CODE&gt;</code> ou entrez le code manuellement sur la page suivante.
          </p>
        </div>
      </div>
    </main>
  );
}
