import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const provided =
      (body?.securityCode as string | undefined) || req.headers.get("x-security-code") || "";
    const expected = process.env.SECURITY_CODE || process.env.NEXT_PUBLIC_SECURITY_CODE || "";
    if (!expected) {
      return NextResponse.json({ error: "not_configured" }, { status: 500 });
    }
    if (provided !== expected) {
      return NextResponse.json({ error: "unauthorized" }, { status: 403 });
    }
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
