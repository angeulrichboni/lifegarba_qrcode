import { redirect } from "next/navigation";

type Props = { params: { code: string } };

export default function ScanRedirect({ params }: Props) {
  const code = decodeURIComponent(params.code);
  redirect(`/verify?code=${encodeURIComponent(code)}`);
}
