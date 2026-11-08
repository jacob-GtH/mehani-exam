import { NextResponse } from "next/server";
import { writer } from "@/lib/sanity";
import { checkRateLimit } from "@/lib/rate-limit";
import { openSession } from "@/lib/exam-session";
import { randomUUID } from "node:crypto";

export const runtime = "nodejs";
type Payload = { slug: string; mode: "exam" | "practice"; examId: string; title: string; passMark: number; startedAt: number; questions: Array<{ key: string; text: string; options: string[]; correctOption: string; explanation: string }> };

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  if (!checkRateLimit(`attempt:${ip}`, 8, 60_000).allowed) return NextResponse.json({ error: "rate_limited", message: "تم تجاوز عدد المحاولات المسموح به. حاول بعد قليل." }, { status: 429 });
  try {
    const body = await req.json() as { sessionId?: unknown; answers?: unknown };
    if (typeof body.sessionId !== "string" || !/^[0-9a-f-]{36}$/i.test(body.sessionId) || !Array.isArray(body.answers) || body.answers.length > 300) return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
    const record = await writer.fetch(`*[_type=="examSession" && _id==$id][0]{_rev,ciphertext,iv,tag,status,expiresAt}`, { id: body.sessionId });
    if (!record || record.status !== "active" || Date.parse(record.expiresAt) < Date.now()) return NextResponse.json({ error: "session_expired" }, { status: 410 });
    const session = openSession<Payload>(record);
    const submitted = new Map<string, string | null>();
    for (const raw of body.answers) {
      if (!raw || typeof raw !== "object") return NextResponse.json({ error: "invalid_answer" }, { status: 400 });
      const answer = raw as { key?: unknown; chosen?: unknown };
      if (typeof answer.key !== "string" || submitted.has(answer.key) || !session.questions.some(q => q.key === answer.key)) return NextResponse.json({ error: "invalid_or_duplicate_question" }, { status: 400 });
      if (answer.chosen !== null && typeof answer.chosen !== "string") return NextResponse.json({ error: "invalid_choice" }, { status: 400 });
      const question = session.questions.find(q => q.key === answer.key)!;
      if (typeof answer.chosen === "string" && !question.options.includes(answer.chosen)) return NextResponse.json({ error: "choice_not_in_question" }, { status: 400 });
      submitted.set(answer.key, answer.chosen as string | null);
    }
    if (submitted.size !== session.questions.length) return NextResponse.json({ error: "incomplete_submission" }, { status: 400 });
    let correct = 0;
    const review = session.questions.map(q => {
      const chosen = submitted.get(q.key) ?? null;
      const isCorrect = chosen !== null && chosen === q.correctOption;
      if (isCorrect) correct++;
      return { key: q.key, text: q.text, options: q.options, chosen, correctOption: q.correctOption, isCorrect, explanation: q.explanation };
    });
    const total = review.length;
    const percentage = Math.round((correct / total) * 100);
    const seconds = Math.max(0, Math.min(86_400, Math.round((Date.now() - session.startedAt) / 1000)));
    const attemptId = randomUUID();
    const transaction = writer.transaction();
    transaction.create({ _id: attemptId, _type: "attempt", exam: { _type: "reference", _ref: session.examId, _weak: true }, slug: session.slug, mode: session.mode, ok: correct, total, pct: percentage, passed: percentage >= session.passMark, seconds, wrong: review.filter(q => !q.isCorrect).map(q => q.key), createdAt: new Date().toISOString() });
    transaction.patch(body.sessionId, patch => patch.ifRevisionId(record._rev).set({ status: "completed", completedAt: new Date().toISOString(), attempt: { _type: "reference", _ref: attemptId, _weak: true } }));
    await transaction.commit();
    return NextResponse.json({ ok: true, score: { correct, total, percentage, passed: percentage >= session.passMark, passMark: session.passMark, seconds }, review });
  } catch (error) {
    console.error("attempt submission failed", error);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
