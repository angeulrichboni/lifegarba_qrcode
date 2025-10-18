import { getSupabaseServerClient } from "./supabaseServer";

export type VerifyStatus = "accepted" | "used" | "invalid";

export type VerifyResult =
  | { status: "accepted"; code: string; last_scanned_at: string }
  | { status: "used"; code: string; last_scanned_at: string }
  | { status: "invalid"; code: string };

// Performs an atomic validation using an UPDATE ... WHERE is_valid = TRUE RETURNING *;
export async function verifyCodeOnce(codeRaw: string): Promise<VerifyResult> {
  const code = codeRaw?.trim();
  if (!code) {
    return { status: "invalid", code: codeRaw ?? "" };
  }

  const supabase = getSupabaseServerClient();

  // Try atomic update first
  const { data: updated, error: updateError } = await supabase
    .from("codes")
    .update({ is_valid: false, last_scanned_at: new Date().toISOString() })
    .eq("code", code)
    .eq("is_valid", true)
    .select("code, last_scanned_at")
    .limit(1);

  if (updateError) {
    // Bubble up; API layer logs/handles
    throw updateError;
  }

  if (updated && updated.length === 1) {
    const row = updated[0] as { code: string; last_scanned_at: string };
    return { status: "accepted", code: row.code, last_scanned_at: row.last_scanned_at };
  }

  // No row updated: either used or invalid
  const { data: existing, error: selectError } = await supabase
    .from("codes")
    .select("code, is_valid, last_scanned_at")
    .eq("code", code)
    .limit(1);

  if (selectError) {
    throw selectError;
  }

  if (existing && existing.length === 1) {
    const row = existing[0] as { code: string; is_valid: boolean; last_scanned_at: string | null };
    return {
      status: "used",
      code: row.code,
      last_scanned_at: row.last_scanned_at ?? new Date().toISOString(),
    };
  }

  return { status: "invalid", code };
}
