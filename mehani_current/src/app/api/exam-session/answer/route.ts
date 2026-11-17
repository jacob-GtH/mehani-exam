import { NextResponse } from "next/server";
import { writer } from "@/lib/sanity";
import { openSession } from "@/lib/exam-session";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
type Payload = { slug: string; mode: string; examId: string; title: string; passMark: number; startedAt: number; questions: Array<{ key: string; text: string; options: string[]; correctOption: string; explanation: string }> };
export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkRateLimit(`exam-answer:${ip}`, 120, 60_000).allowed) return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  try {
    const body = await req.json() as { sessionId?: unknown; key?: unknown; chosen?: unknown };
    if (typeof body.sessionId !== "string" || !/^[0-9a-f-]{36}$/i.test(body.sessionId) || typeof body.key !== "string" || typeof body.chosen !== "string") return NextResponse.json({ error: "invalid_request" }, { status: 400 });
    const record = await writer.fetch(`*[_type=="examSession" && _id==$id][0]{ciphertext,iv,tag,status,expiresAt}`, { id: body.sessionId });
    if (!record || record.status !== "active" || Date.parse(record.expiresAt) < Date.now()) return NextResponse.json({ error: "session_expired" }, { status: 410 });
    const payload = openSession<Payload>(record);
    if (payload.mode !== "practice") return NextResponse.json({ error: "feedback_unavailable" }, { status: 403 });
    const question = payload.questions.find(q => q.key === body.key);
    if (!question || !question.options.includes(body.chosen)) return NextResponse.json({ error: "invalid_answer" }, { status: 400 });
    return NextResponse.json({ correct: body.chosen === question.correctOption, correctOption: question.correctOption, explanation: question.explanation });
  } catch (error) {
    console.error("exam answer validation failed", error);
    return NextResponse.json({ error: "answer_check_failed" }, { status: 500 });
  }
}
