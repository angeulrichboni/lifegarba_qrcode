export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-zinc-50">
      <header className="mx-auto max-w-5xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-zinc-900 grid place-items-center text-white font-bold">LG</div>
            <div>
              <h1 className="text-lg font-semibold">LifeGarba</h1>
              <p className="text-xs text-zinc-500">Ticket Validation</p>
            </div>
          </div>
          <nav>
            <a href="/login" className="rounded-md border px-3 py-1 text-sm hover:bg-zinc-50">Se connecter</a>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-12 text-center">
        <h2 className="text-4xl font-extrabold text-zinc-900">Validation simple et sécurisée des tickets</h2>
        <p className="mt-4 text-zinc-600">Saisissez rapidement les tickets, vérifiez leur statut, et empêchez toute réutilisation.</p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <a
            href="/login"
            className="rounded-full bg-zinc-900 px-6 py-3 text-white text-sm shadow hover:bg-zinc-800"
          >
            Commencer
          </a>
          <a
            href="/manual"
            className="rounded-full border px-6 py-3 text-sm hover:bg-zinc-50"
          >
            Saisie manuelle
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-8">
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border bg-white p-4 text-center shadow-sm">
            <h3 className="font-semibold">Sécurisé</h3>
            <p className="mt-2 text-sm text-zinc-600">Validation protégée par code, refus des accès non autorisés.</p>
          </div>
          <div className="rounded-2xl border bg-white p-4 text-center shadow-sm">
            <h3 className="font-semibold">Fiable</h3>
            <p className="mt-2 text-sm text-zinc-600">Opération atomique côté serveur: un ticket = une seule validation.</p>
          </div>
          <div className="rounded-2xl border bg-white p-4 text-center shadow-sm">
            <h3 className="font-semibold">Mobile-first</h3>
            <p className="mt-2 text-sm text-zinc-600">Interface optimisée pour smartphone, tactile et rapide.</p>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-5xl p-6 text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} LifeGarba — Conçu pour la validation d’événements
      </footer>
    </main>
  );
}
