"use client";
import { useState } from "react";
import { saveQuestion } from "@/app/admin/actions";

type Init = { key?: string; text: string; options: string[]; correct: number; explanation?: string };
const inp = "w-full rounded-lg border border-line bg-card2 px-3 py-2";

export default function QuestionForm({ examId, initial }: { examId: string; initial?: Init }) {
  const [text, setText] = useState(initial?.text ?? "");
  const [opts, setOpts] = useState(initial?.options ?? ["", "", "", ""]);
  const [correct, setCorrect] = useState(initial?.correct ?? 0);
  const [exp, setExp] = useState(initial?.explanation ?? "");
  const ok = text.trim() && opts.filter((o) => o.trim()).length >= 2 && !!opts[correct]?.trim();
  const rm = (i: number) => { setOpts(opts.filter((_, k) => k !== i)); setCorrect(correct === i ? 0 : correct > i ? correct - 1 : correct); };

  return (
    <form action={saveQuestion} className="space-y-3 rounded-2xl border-2 border-line bg-card p-5">
      <h2 className="text-lg font-bold text-hd">{initial?.key ? "تعديل السؤال" : "إضافة سؤال"}</h2>
      <input type="hidden" name="id" value={examId} />
      <input type="hidden" name="payload" value={JSON.stringify({ key: initial?.key, text, options: opts, correct, explanation: exp })} />
      <textarea rows={2} value={text} onChange={(e) => setText(e.target.value)} placeholder="نص السؤال" className={inp} />
      <p className="text-sm text-mute">الخيارات — حدّد الدائرة بجانب الإجابة الصحيحة</p>
      {opts.map((o, i) => (
        <div key={i} className="flex items-center gap-2">
          <input type="radio" checked={correct === i} onChange={() => setCorrect(i)} aria-label="الإجابة الصحيحة" className="h-5 w-5 flex-none accent-[color:var(--color-ok)]" />
          <input value={o} onChange={(e) => setOpts(opts.map((x, k) => (k === i ? e.target.value : x)))} placeholder={`الخيار ${i + 1}`} className={inp} />
          {opts.length > 2 && <button type="button" onClick={() => rm(i)} aria-label="حذف الخيار" className="rounded-lg border border-line px-3 py-2">✕</button>}
        </div>
      ))}
      {opts.length < 6 && <button type="button" onClick={() => setOpts([...opts, ""])} className="rounded-lg border border-line px-3 py-1">+ خيار</button>}
      <input value={exp} onChange={(e) => setExp(e.target.value)} placeholder="شرح الإجابة (اختياري)" className={inp} />
      <div className="flex gap-2">
        <button disabled={!ok} className="flex-1 rounded-xl bg-pri py-2 font-bold disabled:opacity-40">{initial?.key ? "حفظ التعديل" : "إضافة السؤال"}</button>
        {initial?.key && <a href={`/admin/exams/${examId}`} className="rounded-xl border border-line px-4 py-2">إلغاء</a>}
      </div>
    </form>
  );
}
