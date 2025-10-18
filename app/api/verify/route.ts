import { NextRequest, NextResponse } from "next/server";
import { verifyCodeOnce } from "@/lib/verifyCode";

export const runtime = "nodejs"; // ensure Node.js runtime (not edge)
export const dynamic = "force-dynamic"; // disable caching

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code") ?? "";
    const result = await verifyCodeOnce(code);
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error("/api/verify error", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const code = (body?.code as string | undefined) ?? "";
    const result = await verifyCodeOnce(code);
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error("/api/verify error", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
