import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { writer } from "@/lib/sanity";
import { checkRateLimit } from "@/lib/rate-limit";
import { sealSession } from "@/lib/exam-session";

export const runtime = "nodejs";
const shuffle = <T,>(values: T[]) => { const result = [...values]; for (let i = result.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [result[i], result[j]] = [result[j], result[i]]; } return result; };

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  const limit = checkRateLimit(`exam-start:${ip}`, 5, 60_000);
  if (!limit.allowed) return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  try {
    const body = await req.json() as { slug?: unknown; mode?: unknown; keys?: unknown };
    const slug = typeof body.slug === "string" ? body.slug.trim() : "";
    const mode = body.mode === "exam" || body.mode === "practice" ? body.mode : null;
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 120 || !mode) return NextResponse.json({ error: "invalid_request" }, { status: 400 });
    const exam = await writer.fetch(`*[_type=="exam" && slug.current==$slug && published==true][0]{_id,title,passMark,questions[]{_key,text,options,correct,explanation}}`, { slug });
    if (!exam?.questions?.length) return NextResponse.json({ error: "not_found" }, { status: 404 });
    const requested = Array.isArray(body.keys) ? body.keys.filter((k): k is string => typeof k === "string") : null;
    if (requested && (requested.length < 1 || requested.length > 300 || new Set(requested).size !== requested.length)) return NextResponse.json({ error: "invalid_questions" }, { status: 400 });
    let questions = exam.questions.filter((q: any) => !requested || requested.includes(q._key));
    if (requested && questions.length !== requested.length) return NextResponse.json({ error: "invalid_questions" }, { status: 400 });
    questions = shuffle(questions).map((q: any) => {
      const options = shuffle(Array.isArray(q.options) ? q.options : []);
      return { key: q._key, text: q.text, options, correctOption: options[q.correct], explanation: q.explanation || "" };
    });
    if (!questions.length || questions.some((q: any) => !q.key || !q.text || !q.options.length || !q.options.includes(q.correctOption))) return NextResponse.json({ error: "invalid_exam_data" }, { status: 500 });
    const sessionId = randomUUID();
    const startedAt = Date.now();
    const expiresAt = new Date(startedAt + 4 * 60 * 60 * 1000).toISOString();
    const encrypted = sealSession({ slug, mode, examId: exam._id, title: exam.title, passMark: Number(exam.passMark) || 70, startedAt, questions });
    await writer.create({ _id: sessionId, _type: "examSession", ...encrypted, status: "active", expiresAt, createdAt: new Date(startedAt).toISOString() });
    return NextResponse.json({ sessionId, title: exam.title, passMark: Number(exam.passMark) || 70, questions: questions.map(({ key, text, options }: any) => ({ key, text, options })) });
  } catch (error) {
    console.error("exam session start failed", error);
    return NextResponse.json({ error: "session_start_failed" }, { status: 500 });
  }
}
