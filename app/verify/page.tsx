import { Suspense } from "react";
import VerifyClient from "./verify-client";

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-6">
          Vérification…
        </div>
      }
    >
      <VerifyClient />
    </Suspense>
  );
}
