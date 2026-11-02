import { NextResponse } from "next/server";
import { writer } from "@/lib/sanity";

// تسجيل محاولة مجهولة. التصحيح يتم على الخادم حتى لا تُزوَّر الإحصاءات.
export async function POST(req: Request) {
  try {
    const b = await req.json();
    const slug = String(b.slug || "");
    const answers: { key: string; chosen: string | null }[] = Array.isArray(b.answers) ? b.answers.slice(0, 300) : [];
    const exam = await writer.fetch(
      `*[_type=="exam" && slug.current==$slug][0]{_id, passMark, questions[]{_key, options, correct}}`, { slug });
    if (!exam) return NextResponse.json({ error: "not_found" }, { status: 404 });

    const map = new Map<string, { options: string[]; correct: number }>(exam.questions.map((q: any) => [q._key, q]));
    let ok = 0, total = 0;
    const wrong: string[] = [];
    for (const a of answers) {
      const q = map.get(a.key);
      if (!q) continue;
      total++;
      if (q.options[q.correct] === a.chosen) ok++; else wrong.push(a.key);
    }
    if (!total) return NextResponse.json({ error: "empty" }, { status: 400 });
    const pct = Math.round((ok / total) * 100);

    await writer.create({
      _type: "attempt", exam: { _type: "reference", _ref: exam._id, _weak: true }, slug,
      mode: b.mode === "exam" ? "exam" : "practice", ok, total, pct, passed: pct >= exam.passMark,
      seconds: Math.min(Math.max(Number(b.seconds) || 0, 0), 86400), wrong, createdAt: new Date().toISOString(),
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
