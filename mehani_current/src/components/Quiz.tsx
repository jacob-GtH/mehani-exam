"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Exam } from "@/lib/data";
import ConfirmModal from "@/components/ui/ConfirmModal";

type Item = { key: string; text: string; options: string[] };
type Review = { key: string; text: string; options: string[]; chosen: string | null; correctOption: string; isCorrect: boolean; explanation: string };
type Report = { score: { correct: number; total: number; percentage: number; passed: boolean; passMark: number; seconds: number }; review: Review[] };
const fmt = (s: number) => `${Math.floor(Math.max(s, 0) / 60)}:${String(Math.max(s, 0) % 60).padStart(2, "0")}`;

export default function Quiz({ exam }: { exam: Exam }) {
  const [phase, setPhase] = useState<"setup" | "quiz" | "result">("setup");
  const [mode, setMode] = useState<"practice" | "exam">("practice");
  const [items, setItems] = useState<Item[]>([]);
  const [sessionId, setSessionId] = useState("");
  const [report, setReport] = useState<Report | null>(null);
  const [feedback, setFeedback] = useState<Record<number, { correct: boolean; correctOption: string; explanation: string }>>({});
  const [i, setI] = useState(0);
  const [ans, setAns] = useState<Record<number, number>>({});
  const [flag, setFlag] = useState<Record<number, boolean>>({});
  const [left, setLeft] = useState(0);
  const [sec, setSec] = useState(0);
  const done = useRef(false);
  const fin = useRef<() => Promise<void>>(async () => {});
  const [confirmExit, setConfirmExit] = useState(false);

  const start = async (keys?: string[]) => {
    try {
      const response = await fetch("/api/exam-session", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: exam.slug, mode, ...(keys ? { keys } : {}) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || data.error || "تعذر بدء الاختبار");
      setSessionId(data.sessionId);
      setItems(data.questions as Item[]); setI(0); setAns({}); setFlag({}); setFeedback({}); setReport(null);
      setLeft((data.questions as Item[]).length * 60);
      done.current = false; setPhase("quiz");
    } catch (error) {
      alert(error instanceof Error ? error.message : "تعذر بدء الاختبار. حاول مرة أخرى.");
    }
  };

  const chooseAnswer = async (index: number) => {
    if (mode === "exam" || feedback[i]) { setAns(prev => ({ ...prev, [i]: index })); return; }
    const chosen = items[i].options[index];
    setAns(prev => ({ ...prev, [i]: index }));
    try {
      const response = await fetch("/api/exam-session/answer", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sessionId, key: items[i].key, chosen }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "تعذر تصحيح الإجابة");
      setFeedback(prev => ({ ...prev, [i]: data }));
    } catch (error) {
      setAns(prev => { const next = { ...prev }; delete next[i]; return next; });
      alert(error instanceof Error ? error.message : "تعذر تصحيح الإجابة");
    }
  };

  const finish = async () => {
    if (done.current) return;
    done.current = true;
    try {
      const response = await fetch("/api/attempt", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, answers: items.map((q, n) => ({ key: q.key, chosen: ans[n] === undefined ? null : q.options[ans[n]] })) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || data.error || "تعذر حفظ المحاولة");
      setReport(data as Report);
      setSec(data.score.seconds);
      setPhase("result");
    } catch (error) {
      done.current = false;
      alert(error instanceof Error ? error.message : "تعذر حفظ المحاولة. تحقق من الاتصال وحاول مجدداً.");
    }
  };
  fin.current = finish;

  useEffect(() => {
    if (phase !== "quiz" || mode !== "exam") return;
    const id = setInterval(() => setLeft((l) => l - 1), 1000);
    return () => clearInterval(id);
  }, [phase, mode]);
  useEffect(() => { if (phase === "quiz" && mode === "exam" && left <= 0) fin.current(); }, [left, phase, mode]);

  if (phase === "setup") return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <Link href={`/exam/${exam.slug}`} className="font-bold text-[color:var(--color-mute)] transition hover:text-[color:var(--color-pri)]">← العودة إلى تفاصيل المهنة</Link>
        <span className="rounded-full border border-[color:var(--color-line)] bg-white px-3 py-1.5 text-xs font-bold text-[color:var(--color-text-light)]">خطوة 1 من 2 · اختيار نمط الاختبار</span>
      </div>

      <section className="overflow-hidden rounded-[2rem] border border-[color:var(--color-line)] bg-white shadow-[0_24px_70px_rgba(16,44,42,.08)]">
        <div className="bg-[#102C2A] px-6 py-8 text-white sm:px-9 sm:py-10">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-2xl" aria-hidden="true">✦</div>
          <p className="mb-2 text-xs font-bold text-[#B9D6A9]">استعد وابدأ بثقة</p>
          <h1 className="text-2xl font-black text-white sm:text-3xl">اختبار {exam.title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/70">اختر الطريقة التي تناسب هدفك. يمكنك التدرّب مع شرح فوري، أو خوض محاكاة بوقت محدد لقياس جاهزيتك.</p>
          <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold text-white/80">
            <span className="rounded-full bg-white/10 px-3 py-1.5">{exam.count} سؤال</span>
            <span className="rounded-full bg-white/10 px-3 py-1.5">حد النجاح {exam.passMark}%</span>
            <span className="rounded-full bg-white/10 px-3 py-1.5">محاولات مجانية</span>
          </div>
        </div>

        <div className="space-y-5 p-5 sm:p-8">
          <div>
            <h2 className="text-lg font-black text-[color:var(--color-hd)]">كيف تريد أن تختبر نفسك؟</h2>
            <p className="mt-1 text-sm text-[color:var(--color-mute)]">يمكنك تغيير اختيارك قبل بدء الأسئلة.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {([
              ["practice", "وضع التدريب", "تعلّم أثناء الحل", "أظهر لك صحة الإجابة وشرحها بعد اختيارك، لتتعلم من كل سؤال.", "💡", ["تصحيح فوري", "شرح الإجابات", "بدون ضغط الوقت"]],
              ["exam", "محاكاة الامتحان", "اختبر جاهزيتك", "أجب عن الأسئلة أولاً، ثم راجع نتيجتك وإجاباتك بعد التسليم.", "◷", ["مؤقت زمني", "النتيجة بعد التسليم", "مراجعة الأخطاء"]],
            ] as const).map(([value, title, subtitle, description, icon, points]) => {
              const selected = mode === value;
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setMode(value)}
                  className={`group relative flex min-h-64 flex-col rounded-3xl border-2 p-5 text-right transition duration-200 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#16745F] ${selected ? "border-[#16745F] bg-[#F1F7F2] shadow-lg shadow-emerald-950/10" : "border-[color:var(--color-line)] bg-white hover:border-[#A9C6B2] hover:bg-[#FAFCFA]"}`}
                >
                  <span className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ${selected ? "bg-[#DDEDE1] text-[#145B46]" : "bg-[color:var(--color-card2)] text-[color:var(--color-hd)]"}`}>{icon}</span>
                  <span className="text-lg font-black text-[color:var(--color-hd)]">{title}</span>
                  <span className="mt-1 text-xs font-bold text-[color:var(--color-pri)]">{subtitle}</span>
                  <span className="mt-3 text-sm leading-7 text-[color:var(--color-text-light)]">{description}</span>
                  <span className="mt-auto flex flex-wrap gap-2 pt-5">
                    {points.map((point) => <span key={point} className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-[color:var(--color-text-light)] ring-1 ring-[color:var(--color-line)]">{point}</span>)}
                  </span>
                  <span className={`absolute left-4 top-4 flex h-6 w-6 items-center justify-center rounded-full border text-xs font-black ${selected ? "border-[#16745F] bg-[#16745F] text-white" : "border-[color:var(--color-line)] text-transparent"}`} aria-hidden="true">✓</span>
                </button>
              );
            })}
          </div>
          <div className="flex flex-col-reverse gap-3 border-t border-[color:var(--color-line)] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-6 text-[color:var(--color-mute)]">لن تبدأ المحاولة حتى تضغط على زر البدء.</p>
            <button
              type="button"
              onClick={() => void start()}
              className="btn-primary inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl px-8 text-base font-extrabold shadow-lg shadow-emerald-950/10"
            >
              ابدأ {mode === "practice" ? "التدريب" : "المحاكاة"} <span aria-hidden="true" className="text-xl">←</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );


  if (phase === "result") {
    if (!report) return <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 text-center">جارٍ تجهيز النتيجة…</div>;
    const ok = report.score.correct;
    const unanswered = report.review.filter(q => q.chosen === null).length;
    const pct = report.score.percentage, pass = report.score.passed;
    const wrongKeys = new Set(report.review.filter(q => !q.isCorrect).map(q => q.key));
    const wrongCount = items.length - ok;
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="relative overflow-hidden rounded-[2rem] border border-[color:var(--color-line)] bg-white shadow-[0_24px_70px_rgba(16,44,42,.08)]">
          <div className="absolute inset-x-0 top-0 h-1.5" style={{ background: "linear-gradient(90deg,var(--color-pri),var(--color-pri-hover),var(--color-pri2))" }} />
          <div className="px-6 py-9 text-center sm:px-10 sm:py-12">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EFF6EF] text-3xl" aria-hidden="true">{pass ? "✓" : "↗"}</div>
            <p className="text-sm font-bold text-[color:var(--color-mute)]">انتهت المحاولة · {exam.title}</p>
            <div className={`my-3 text-6xl font-black tracking-tight sm:text-7xl ${pass ? "text-[color:var(--color-ok)]" : "text-[color:var(--color-hd)]"}`}>{pct}<span className="text-3xl">%</span></div>
            <h1 className="text-xl font-black text-[color:var(--color-hd)] sm:text-2xl">{pass ? "أحسنت! حققت درجة الاجتياز" : "واصل التدرّب للوصول إلى درجة الاجتياز"}</h1>
            <p className="mt-2 text-sm text-[color:var(--color-mute)]">{pass ? `تجاوزت حد النجاح المحدد عند ${exam.passMark}%.` : `حد النجاح هو ${exam.passMark}%. راجع الإجابات وحاول مجدداً.`}</p>
            <div className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
              {[["الإجابات الصحيحة", `${ok} / ${items.length}`, "text-[color:var(--color-ok)]"], ["الإجابات الخاطئة", String(wrongCount), "text-[color:var(--color-bad)]"], ["دون إجابة", String(unanswered), "text-[color:var(--color-mute)]"], ["الوقت المستغرق", `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2,"0")}`, "text-[color:var(--color-hd)]"]].map(([label, value, color]) => (
                <div key={label} className="rounded-2xl border border-[color:var(--color-line)] bg-[#FAFCFA] p-4">
                  <p className="text-xs font-semibold text-[color:var(--color-mute)]">{label}</p>
                  <p className={`mt-2 text-2xl font-black ${color}`}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-[color:var(--color-line)] bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div><h2 className="text-lg font-black text-[color:var(--color-hd)]">ملخص أدائك</h2><p className="mt-1 text-xs text-[color:var(--color-mute)]">توزيع إجاباتك في هذه المحاولة</p></div>
            <span className="rounded-full bg-[#F1F7F2] px-3 py-1.5 text-xs font-bold text-[color:var(--color-hd)]">{items.length} سؤال</span>
          </div>
          <div className="flex h-3 overflow-hidden rounded-full bg-[#EEF1ED]" aria-label={`نسبة الإجابات الصحيحة ${pct}%`}>
            <div className="bg-[color:var(--color-ok)] transition-all" style={{width:`${ok/items.length*100}%`}} />
            <div className="bg-[color:var(--color-bad)]" style={{width:`${wrongCount/items.length*100}%`}} />
          </div>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-[color:var(--color-mute)]">
            <span><i className="ml-1 inline-block h-2.5 w-2.5 rounded-full bg-[color:var(--color-ok)]" />صحيح ({ok})</span>
            <span><i className="ml-1 inline-block h-2.5 w-2.5 rounded-full bg-[color:var(--color-bad)]" />غير صحيح ({wrongCount})</span>
          </div>
        </section>

        <div className="grid gap-3 sm:grid-cols-3">
          <button type="button" onClick={() => void start()} className="btn-primary min-h-12 rounded-2xl px-4 py-3 text-sm font-extrabold">إعادة الاختبار</button>
          {!!wrongKeys.size && <button type="button" onClick={() => void start([...wrongKeys])} className="min-h-12 rounded-2xl border border-[color:var(--color-pri)] bg-[#F1F7F2] px-4 py-3 text-sm font-bold text-[color:var(--color-hd)] transition hover:bg-[#E7F1E8]">التدرّب على الأخطاء ({wrongKeys.size})</button>}
          <Link href={`/exam/${exam.slug}`} className="flex min-h-12 items-center justify-center rounded-2xl border border-[color:var(--color-line)] bg-white px-4 py-3 text-sm font-bold text-[color:var(--color-mute)] transition hover:border-[color:var(--color-pri)]">العودة إلى تفاصيل المهنة</Link>
        </div>

        <section className="space-y-4 rounded-3xl border border-[color:var(--color-line)] bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-wrap items-end justify-between gap-2 border-b border-[color:var(--color-line)] pb-4">
            <div><h2 className="text-lg font-black text-[color:var(--color-hd)]">مراجعة الأسئلة</h2><p className="mt-1 text-xs text-[color:var(--color-mute)]">راجع إجابتك والإجابة الصحيحة والشرح المتاح</p></div>
            <span className="text-xs font-bold text-[color:var(--color-mute)]">{wrongCount ? `${wrongCount} سؤال للمراجعة` : "كل الإجابات صحيحة"}</span>
          </div>
          <div className="space-y-3">
            {items.map((q, n) => {
              const review = report.review.find(item => item.key === q.key)!;
              const isCorrect = review.isCorrect;
              return (
                <details key={q.key} className="group rounded-2xl border border-[color:var(--color-line)] bg-[#FCFDFC] open:bg-white">
                  <summary className="flex cursor-pointer list-none items-center gap-3 p-4 [&::-webkit-details-marker]:hidden">
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-black ${isCorrect ? "bg-[#E8F4EA] text-[color:var(--color-ok)]" : "bg-[#FCEDEC] text-[color:var(--color-bad)]"}`}>{isCorrect ? "✓" : "!"}</span>
                    <span className="min-w-0 flex-1"><span className="block text-[10px] font-bold text-[color:var(--color-mute)]">السؤال {n+1}</span><span className="mt-1 block text-sm font-bold leading-6 text-[color:var(--color-hd)]">{q.text}</span></span>
                    <span className="text-xs text-[color:var(--color-mute)] group-open:rotate-180">⌄</span>
                  </summary>
                  <div className="space-y-3 border-t border-[color:var(--color-line)] p-4">
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div className="rounded-xl bg-[#F8F1F0] p-3 text-sm"><p className="mb-1 text-xs font-bold text-[color:var(--color-bad)]">إجابتك</p><p className="leading-6 text-[color:var(--color-text)]">{review.chosen === null ? "لم تجب عن هذا السؤال" : review.chosen}</p></div>
                      <div className="rounded-xl bg-[#EFF6EF] p-3 text-sm"><p className="mb-1 text-xs font-bold text-[color:var(--color-ok)]">الإجابة الصحيحة</p><p className="leading-6 text-[color:var(--color-text)]">{review.correctOption}</p></div>
                    </div>
                    {review.explanation && <div className="rounded-xl border border-[color:var(--color-line)] bg-[#FAFCFA] p-3 text-sm leading-7 text-[color:var(--color-text-light)]"><p className="mb-1 text-xs font-black text-[color:var(--color-hd)]">التفسير</p>{review.explanation}</div>}
                  </div>
                </details>
              );
            })}
          </div>
        </section>
      </div>
    );
  }

  const q = items[i], a = ans[i], show = mode === "practice" && feedback[i] !== undefined;
  const answeredCount = Object.keys(ans).length;
  const progressPct = Math.round((answeredCount / items.length) * 100);

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <header className="rounded-3xl border border-[color:var(--color-line)] bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0"><p className="text-xs font-bold text-[color:var(--color-mute)]">{mode === "practice" ? "وضع التدريب" : "محاكاة الامتحان"}</p><h1 className="mt-1 truncate text-lg font-black text-[color:var(--color-hd)] sm:text-xl">{exam.title}</h1></div>
          <div className="flex items-center gap-2">
            {mode === "exam" && <div className={`rounded-xl px-3 py-2 font-mono text-sm font-black tabular-nums ${left < 120 ? "bg-[#FCEDEC] text-[color:var(--color-bad)]" : "bg-[#F1F7F2] text-[color:var(--color-hd)]"}`} aria-live="off">◷ {fmt(left)}</div>}
            <button type="button" onClick={() => setConfirmExit(true)} className="rounded-xl border border-[color:var(--color-line)] px-3 py-2 text-xs font-bold text-[color:var(--color-mute)] transition hover:border-[color:var(--color-bad)] hover:text-[color:var(--color-bad)]">إنهاء المحاولة</button>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-[#F7FAF7] p-2"><p className="text-[10px] font-semibold text-[color:var(--color-mute)]">السؤال الحالي</p><p className="mt-1 text-sm font-black text-[color:var(--color-hd)]">{i+1} / {items.length}</p></div>
          <div className="rounded-xl bg-[#F7FAF7] p-2"><p className="text-[10px] font-semibold text-[color:var(--color-mute)]">تمت الإجابة</p><p className="mt-1 text-sm font-black text-[color:var(--color-hd)]">{answeredCount}</p></div>
          <div className="rounded-xl bg-[#F7FAF7] p-2"><p className="text-[10px] font-semibold text-[color:var(--color-mute)]">للمراجعة</p><p className="mt-1 text-sm font-black text-[color:var(--color-amber)]">{Object.values(flag).filter(Boolean).length}</p></div>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#EEF1ED]"><div className="h-full rounded-full bg-[color:var(--color-pri)] transition-all duration-300" style={{width:`${progressPct}%`}} /></div>
        <div className="mt-1 flex justify-between text-[10px] font-semibold text-[color:var(--color-mute)]"><span>تقدم الإجابة</span><span>{progressPct}%</span></div>
      </header>

      <section className="overflow-hidden rounded-[2rem] border border-[color:var(--color-line)] bg-white shadow-[0_18px_55px_rgba(16,44,42,.06)]">
        <div className="flex items-center justify-between border-b border-[color:var(--color-line)] bg-[#FAFCFA] px-5 py-4 sm:px-8">
          <span className="text-xs font-black text-[color:var(--color-pri)]">السؤال {i+1}</span>
          <button type="button" onClick={() => setFlag({ ...flag, [i]: !flag[i] })} aria-pressed={!!flag[i]} className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${flag[i] ? "border-[#D9B66D] bg-[#FBF5E8] text-[#8A641B]" : "border-[color:var(--color-line)] bg-white text-[color:var(--color-mute)] hover:border-[#D9B66D]"}`}>{flag[i] ? "⚑ تمت الإشارة للمراجعة" : "⚐ علّم للمراجعة"}</button>
        </div>
        <div className="space-y-6 p-5 sm:p-8">
          <h2 className="text-lg font-extrabold leading-8 text-[color:var(--color-hd)] sm:text-xl sm:leading-9">{q.text}</h2>
          <div className="space-y-3" role="group" aria-label="خيارات الإجابة">
            {q.options.map((t, k) => {
              const isChosen = a === k;
              let style = "border-[color:var(--color-line)] bg-white hover:border-[#A9C6B2] hover:bg-[#FAFCFA] text-[color:var(--color-text)]";
              if (show) style = q.options[k] === feedback[i].correctOption ? "border-[color:var(--color-ok)] bg-[#EFF6EF] text-[color:var(--color-hd)]" : isChosen ? "border-[color:var(--color-bad)] bg-[#FCEDEC] text-[color:var(--color-text)]" : "border-[color:var(--color-line)] bg-[#FAFCFA] text-[color:var(--color-mute)] opacity-60";
              else if (isChosen) style = "border-[color:var(--color-pri)] bg-[#F1F7F2] text-[color:var(--color-hd)] shadow-sm";
              return <button key={k} type="button" disabled={show} aria-pressed={isChosen} onClick={() => void chooseAnswer(k)} className={`flex min-h-16 w-full items-center gap-4 rounded-2xl border-2 p-4 text-right transition duration-150 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#16745F] ${style}`}>
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border text-xs font-black ${isChosen || (show && q.options[k] === feedback[i].correctOption) ? "border-[color:var(--color-pri)] bg-[color:var(--color-pri)] text-white" : "border-[color:var(--color-line)] bg-[#FAFCFA] text-[color:var(--color-mute)]"}`}>{String.fromCharCode(1571+k)}</span>
                <span className="flex-1 text-sm font-semibold leading-7 sm:text-base">{t}</span>
                {isChosen && <span className="text-sm font-black text-[color:var(--color-pri)]">✓</span>}
              </button>;
            })}
          </div>
          {show && <div className={`rounded-2xl border p-4 ${feedback[i]?.correct ? "border-[#CDE3D0] bg-[#EFF6EF]" : "border-[#F0D2CE] bg-[#FDF3F1]"}`}><p className="text-sm font-black text-[color:var(--color-hd)]">{feedback[i]?.correct ? "إجابة صحيحة، أحسنت" : "ليست الإجابة الصحيحة"}</p>{feedback[i]?.explanation && <p className="mt-2 text-sm leading-7 text-[color:var(--color-text-light)]">{feedback[i].explanation}</p>}</div>}
          <div className="flex items-center justify-between gap-3 border-t border-[color:var(--color-line)] pt-5">
            <button type="button" disabled={i === 0} onClick={() => setI(i-1)} className="min-h-11 rounded-xl border border-[color:var(--color-line)] px-4 text-sm font-bold text-[color:var(--color-mute)] transition hover:bg-[#FAFCFA] disabled:opacity-30">→ السابق</button>
            {i === items.length-1 ? <button type="button" onClick={() => setConfirmExit(true)} className="btn-primary min-h-11 rounded-xl px-6 text-sm font-black">مراجعة وتسليم</button> : <button type="button" onClick={() => setI(i+1)} className="btn-primary min-h-11 rounded-xl px-6 text-sm font-black">التالي ←</button>}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-[color:var(--color-line)] bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2"><div><h2 className="text-sm font-black text-[color:var(--color-hd)]">التنقل بين الأسئلة</h2><p className="mt-1 text-xs text-[color:var(--color-mute)]">يمكنك الانتقال مباشرة إلى أي سؤال</p></div><div className="flex flex-wrap gap-3 text-[10px] font-semibold text-[color:var(--color-mute)]"><span>● تمت الإجابة</span><span>○ لم تتم الإجابة</span><span className="text-[#A47724]">⚑ للمراجعة</span></div></div>
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
          {items.map((_, n) => <button key={n} type="button" onClick={() => setI(n)} aria-label={`انتقل إلى السؤال ${n+1}${ans[n] !== undefined ? "، تمت الإجابة" : "، لم تتم الإجابة"}${flag[n] ? "، معلّم للمراجعة" : ""}`} aria-current={n === i ? "step" : undefined} className={`relative flex h-11 items-center justify-center rounded-xl border-2 text-xs font-black transition ${n === i ? "border-[color:var(--color-pri)] bg-[color:var(--color-pri)] text-white shadow-sm" : ans[n] !== undefined ? "border-[#CDE3D0] bg-[#EFF6EF] text-[color:var(--color-hd)]" : "border-[color:var(--color-line)] bg-[#FAFCFA] text-[color:var(--color-mute)] hover:border-[#A9C6B2]"}`}>{n+1}{flag[n] && <span className="absolute -right-1 -top-1 text-[10px] text-[#A47724]">⚑</span>}</button>)}
        </div>
      </section>

      <ConfirmModal open={confirmExit} title="تسليم المحاولة" message={items.length-answeredCount ? `تبقى ${items.length-answeredCount} أسئلة دون إجابة. هل تريد تسليم المحاولة وعرض النتيجة الآن؟` : "هل تريد تسليم إجاباتك وعرض النتيجة؟"} confirmLabel="نعم، تسليم وعرض النتيجة" cancelLabel="العودة إلى الأسئلة" tone="danger" onConfirm={() => { setConfirmExit(false); finish(); }} onCancel={() => setConfirmExit(false)} />
    </div>
  );
}
