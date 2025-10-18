# QR Validation App

Application Next.js + Tailwind + Supabase pour valider des codes uniques via lien QR.

## Démarrage local

1. Créez un fichier `.env.local` à la racine avec:

```
NEXT_PUBLIC_SUPABASE_URL=... # URL du projet Supabase
SUPABASE_SERVICE_ROLE_KEY=... # clé service_role (serveur uniquement)
```

2. Installez et lancez:

```
npm install
npm run dev
```

3. Ouvrez http://localhost:3000

## Table Supabase

```
CREATE TABLE IF NOT EXISTS codes (
	id SERIAL PRIMARY KEY,
	code TEXT UNIQUE NOT NULL,
	is_valid BOOLEAN DEFAULT TRUE,
	last_scanned_at TIMESTAMP NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS codes_code_key ON codes(code);
```

## Flux

- `/scan/<CODE>` redirige vers `/verify?code=<CODE>`.
- `/verify` lit `code` (query), appelle `/api/verify`.
- `/api/verify` effectue un `UPDATE ... WHERE is_valid=TRUE RETURNING *` puis fallback `SELECT`.

## Déploiement (Vercel)

- Définir les variables d'environnement dans le projet Vercel:
	- `NEXT_PUBLIC_SUPABASE_URL`
	- `SUPABASE_SERVICE_ROLE_KEY`
- Déployer en pushant sur le repo.

## Tests (suggestion)

- Tests de la route `/api/verify` pour les statuts `accepted`, `used`, `invalid` et concurrence.
