import { NextRequest, NextResponse } from "next/server";
import { verifyCodeOnce } from "@/lib/verifyCode";

export const runtime = "nodejs"; // ensure Node.js runtime (not edge)
export const dynamic = "force-dynamic"; // disable caching

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code") ?? "";
    // Authorization: optional server-side security code
    const provided =
      req.headers.get("x-security-code") || searchParams.get("sec") || "";
    const expected = process.env.SECURITY_CODE || process.env.NEXT_PUBLIC_SECURITY_CODE || "";
    if (expected && provided !== expected) {
      return NextResponse.json({ error: "unauthorized" }, { status: 403 });
    }
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
    const provided =
      (body?.securityCode as string | undefined) || req.headers.get("x-security-code") || "";
    const expected = process.env.SECURITY_CODE || process.env.NEXT_PUBLIC_SECURITY_CODE || "";
    if (expected && provided !== expected) {
      return NextResponse.json({ error: "unauthorized" }, { status: 403 });
    }
    const result = await verifyCodeOnce(code);
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error("/api/verify error", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
