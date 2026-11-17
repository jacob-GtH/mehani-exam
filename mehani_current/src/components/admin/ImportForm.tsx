"use client";
import { useMemo, useState } from "react";
import { importQuestions } from "@/app/admin/actions";
import { parseQuestions } from "@/lib/parse";
import { TEMPLATE } from "@/lib/template";

const inp = "w-full rounded-lg border border-line bg-card2 px-3 py-2";

export default function ImportForm({ exams }: { exams: { _id: string; title: string }[] }) {
  const [text, setText] = useState("");
  const [examId, setExamId] = useState("");
  const groups = useMemo(() => parseQuestions(text), [text]);
  const total = groups.reduce((s, g) => s + g.questions.length, 0);
  const errs = groups.reduce((s, g) => s + g.errors.length, 0);
  const needTarget = groups.some((g) => !g.exam && g.questions.length);
  const can = (total > 0 || groups.some((g) => g.exam)) && (!needTarget || examId);

  return (
    <form action={importQuestions} className="space-y-4">
      <div className="rounded-2xl border-2 border-line bg-card p-5 text-sm leading-7 text-mute">
        <p className="mb-2 font-bold text-hd">الصيغة المقبولة</p>
        <p>افصل بين الأسئلة بسطر فارغ. للتنقل بين الاختبارات ابدأ سطرًا بـ <b className="text-[color:var(--color-text)]">##</b> ثم اسم الاختبار، واختياريًا <b>| slug-بالإنجليزية</b>. الاختبار غير الموجود يُنشأ تلقائيًا، والسؤال المكرر يُتجاهل.</p>
        <pre dir="rtl" className="mt-2 whitespace-pre-wrap rounded-lg bg-[color:var(--color-card2)] p-3 text-[color:var(--color-text)]">{`## عامل مخزن | warehouse
ما الغرض من ترتيب البضائع في الرفوف؟
أ) الزينة
ب) سهولة الوصول وتقليل الحوادث
ج) زيادة الوزن
د) لا غرض
الإجابة: ب
الشرح: (اختياري)`}</pre>
        <p className="mt-2">يمكنك أيضًا لصق صفوف من Excel بالأعمدة: السؤال | الخيار 1 | 2 | 3 | 4 | الإجابة (رقم 1-4 أو حرف) | الشرح.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setText(TEMPLATE)} className="rounded-lg border border-line px-3 py-2">ضع القالب الجاهز (15 اختبارًا)</button>
        <label className="cursor-pointer rounded-lg border border-line px-3 py-2">رفع ملف نصي
          <input type="file" accept=".txt,.csv,.tsv" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (f) setText(await f.text()); }} /></label>
        {text && <button type="button" onClick={() => setText("")} className="rounded-lg border border-line px-3 py-2">مسح</button>}
      </div>

      <textarea name="text" value={text} onChange={(e) => setText(e.target.value)} rows={14} placeholder="الصق الأسئلة هنا..." className={inp} />

      {!!groups.length && (
        <div className="rounded-2xl border-2 border-line bg-card p-5">
          <p className="font-bold text-hd">المعاينة: {total} سؤال صالح{errs ? ` · ${errs} به خطأ` : ""}</p>
          {groups.map((g, i) => (
            <div key={i} className="border-b border-line py-2">
              <b>{g.exam ?? "الاختبار المحدد أدناه"}</b> <span className="text-mute">— {g.questions.length} سؤال</span>
              {g.errors.map((e, k) => <p key={k} className="text-sm text-bad">{e}</p>)}
            </div>))}
        </div>
      )}

      {needTarget && (
        <select name="examId" value={examId} onChange={(e) => setExamId(e.target.value)} className={inp} required>
          <option value="">اختر الاختبار الذي ستُضاف إليه الأسئلة...</option>
          {exams.map((x) => <option key={x._id} value={x._id}>{x.title}</option>)}
        </select>
      )}
      <label className="flex items-center gap-2"><input type="checkbox" name="publish" className="h-5 w-5 accent-[color:var(--color-ok)]" /> انشر الاختبارات الجديدة فورًا (وإلا تبقى مسودة)</label>
      <button disabled={!can} className="w-full rounded-xl bg-pri py-3 font-bold disabled:opacity-40">استيراد</button>
    </form>
  );
}
