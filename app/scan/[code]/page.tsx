import { redirect } from "next/navigation";

export default async function ScanRedirect({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const decoded = decodeURIComponent(code);
  redirect(`/verify?code=${encodeURIComponent(decoded)}`);
}
