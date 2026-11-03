"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Exam, Q } from "@/lib/data";

type Item = { key: string; text: string; options: string[]; correct: number; explanation?: string };
const shuffle = <T,>(a: T[]) => { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };
const fmt = (s: number) => `${Math.floor(Math.max(s, 0) / 60)}:${String(Math.max(s, 0) % 60).padStart(2, "0")}`;
const btn = "rounded-xl px-4 py-2 font-bold disabled:opacity-40";

export default function Quiz({ exam }: { exam: Exam }) {
  const [phase, setPhase] = useState<"setup" | "quiz" | "result">("setup");
  const [mode, setMode] = useState<"practice" | "exam">("practice");
  const [items, setItems] = useState<Item[]>([]);
  const [i, setI] = useState(0);
  const [ans, setAns] = useState<Record<number, number>>({});
  const [flag, setFlag] = useState<Record<number, boolean>>({});
  const [left, setLeft] = useState(0);
  const [sec, setSec] = useState(0);
  const t0 = useRef(0);
  const done = useRef(false);
  const fin = useRef(() => {});

  const start = (src: Q[]) => {
    if (!src || !src.length) return;
    try {
      const list = shuffle(src).map((q) => {
        const idx = shuffle(q.options.map((_, k) => k));
        return { key: q._key, text: q.text, options: idx.map((k) => q.options[k]), correct: idx.indexOf(q.correct), explanation: q.explanation };
      });
      if (!list.length) return;
      setItems(list); setI(0); setAns({}); setFlag({}); setLeft(list.length * 60);
      t0.current = Date.now(); done.current = false; setPhase("quiz");
    } catch {
      // تجاهل أي خطأ مفاجئ حتى لا يظل التطبيق عالقاً
    }
  };

  const finish = () => {
    if (done.current) return;
    done.current = true;
    const seconds = Math.round((Date.now() - t0.current) / 1000);
    setSec(seconds); setPhase("result");
    fetch("/api/attempt", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: exam.slug, mode, seconds, answers: items.map((q, n) => ({ key: q.key, chosen: ans[n] === undefined ? null : q.options[ans[n]] })) }),
    }).catch(() => {});
  };
  fin.current = finish;

  useEffect(() => {
    if (phase !== "quiz" || mode !== "exam") return;
    const id = setInterval(() => setLeft((l) => l - 1), 1000);
    return () => clearInterval(id);
  }, [phase, mode]);
  useEffect(() => { if (phase === "quiz" && mode === "exam" && left <= 0) fin.current(); }, [left, phase, mode]);

  if (phase === "setup") return (
    <div className="max-w-xl mx-auto rounded-3xl glass-panel p-6 sm:p-8 space-y-6 text-center border border-[color:var(--color-line)]/[0.4] shadow-2xl">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-[color:var(--color-bg-dark)]/[0.2] border border-[color:var(--color-pri)]/[0.3] flex items-center justify-center text-3xl shadow-inner">
        🎯
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[color:var(--color-text)]">{exam.title}</h1>
        <p className="mt-2 text-sm text-[color:var(--color-mute)]">
          {exam.count} سؤال تدريبي · حد النجاح المطلوب {exam.passMark}%
        </p>
      </div>

      <div className="space-y-3 text-right">
        <label className="text-xs font-bold text-[color:var(--color-hd)] block">اختر أسلوب الاختبار:</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {([
            ["practice", "وضع التدريب", "تصحيح فوري وشرح مباشر بعد كل إجابة", "💡"],
            ["exam", "محاكاة الامتحان", "مؤقت زمني وتجربة مطابقة للاختبار الفعلي", "⏱️"],
          ] as const).map(([m, t, d, icon]) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              onClick={() => setMode(m)}
              className={`text-right rounded-2xl p-4 border-2 transition-colors flex flex-col justify-between ${
                mode === m
                  ? "border-[color:var(--color-hd)] bg-[color:var(--color-card)] shadow-lg shadow-[color:var(--color-pri)]/[0.15]"
                  : "border-[color:var(--color-line)]/[0.5] bg-[color:var(--color-card2)]/[0.6] hover:border-[color:var(--color-line)] active:bg-[color:var(--color-card2)]"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-[color:var(--color-text)] text-base">{t}</span>
                <span className="text-xl">{icon}</span>
              </div>
              <p className="text-xs text-[color:var(--color-mute)] leading-relaxed">{d}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="pt-2 space-y-3">
        <button
          type="button"
          onClick={() => start(exam.questions!)}
          className="w-full rounded-2xl text-[color:var(--color-bg)] py-3.5 px-6 font-bold text-lg shadow-lg shadow-[color:var(--color-pri)]/[0.25] transition-colors active:opacity-90"
          style={{ background: 'linear-gradient(to right, var(--color-pri), var(--color-pri-hover))' }}
        >
          ابدأ التدريب الآن ←
        </button>
        <Link
          href={`/exam/${exam.slug}`}
          className="block text-xs font-semibold text-[color:var(--color-mute)] hover:text-[color:var(--color-hd)] transition-colors"
        >
          رجوع لصفحة تفاصيل المهنة
        </Link>
      </div>
    </div>
  );


  if (phase === "result") {
    const ok = items.filter((q, n) => ans[n] === q.correct).length;
    const pct = Math.round((ok / items.length) * 100), pass = pct >= exam.passMark;
    const wrongKeys = new Set(items.filter((q, n) => ans[n] !== q.correct).map((q) => q.key));
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Score Card */}
        <div className="rounded-3xl glass-panel p-8 text-center border border-[color:var(--color-line)]/[0.4] relative overflow-hidden">
          <div 
            className="absolute top-0 right-0 left-0 h-1.5"
            style={{ background: 'linear-gradient(to right, var(--color-pri), var(--color-pri-hover), var(--color-pri2))' }}
          />
          <div className="w-20 h-20 mx-auto mb-4 rounded-3xl flex items-center justify-center text-4xl shadow-inner bg-[color:var(--color-card2)]/[0.8]">
            {pass ? "🎉" : "📚"}
          </div>
          <div className={`text-6xl sm:text-7xl font-black mb-2 tracking-tight ${pass ? "text-[color:var(--color-ok)]" : "text-[color:var(--color-bad)]"}`}>
            {pct}%
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[color:var(--color-text)]">
            {pass ? `مبروك! اجتزت الاختبار بنجاح (المطلوب ${exam.passMark}%)` : `فرصة أفضل في المرة القادمة (المطلوب ${exam.passMark}%)`}
          </h2>
          <p className="mt-2 text-sm text-[color:var(--color-mute)]">
            أجبت بشكل صحيح على <b className="text-[color:var(--color-text)]">{ok}</b> من أصل <b className="text-[color:var(--color-text)]">{items.length}</b> سؤال · استغرقت <b className="text-[color:var(--color-text)]">{Math.floor(sec / 60)}</b> دقيقة و <b className="text-[color:var(--color-text)]">{sec % 60}</b> ثانية
          </p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => start(exam.questions!)}
            className="rounded-2xl text-[color:var(--color-bg)] py-3.5 px-4 font-bold text-sm shadow-md transition-colors active:opacity-85"
            style={{ background: 'linear-gradient(to right, var(--color-pri), var(--color-pri-hover))' }}
          >
            إعادة الاختبار كامل 🔄
          </button>
          {!!wrongKeys.size && (
            <button
              type="button"
              onClick={() => start(exam.questions!.filter((q) => wrongKeys.has(q._key)))}
              className="rounded-2xl glass-card text-[color:var(--color-hd)] border border-[color:var(--color-pri)]/[0.3] hover:border-[color:var(--color-hd)] py-3.5 px-4 font-bold text-sm transition-colors active:opacity-85"
            >
              تدرب على أخطائك فقط ({wrongKeys.size}) ⚠️
            </button>
          )}
          <Link
            href="/"
            className="rounded-2xl glass-card text-[color:var(--color-mute)] hover:text-[color:var(--color-text)] py-3.5 px-4 font-bold text-sm text-center transition-colors flex items-center justify-center"
          >
            جميع المهن 📋
          </Link>
        </div>

        {/* Mistakes Review */}
        <div className="rounded-3xl glass-panel p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-[color:var(--color-line)]/[0.4] pb-3">
            <h3 className="text-lg font-bold text-[color:var(--color-hd)] flex items-center gap-2">
              <span>🔍</span> مراجعة الأخطاء والإجابات
            </h3>
            <span className="text-xs text-[color:var(--color-mute)] font-medium">
              {wrongKeys.size ? `${wrongKeys.size} أسئلة بحاجة لمراجعة` : "لا توجد أي أخطاء!"}
            </span>
          </div>

          <div className="space-y-4 divide-y divide-[color:var(--color-line)]/[0.3]">
            {items.map((q, n) => {
              const isWrong = ans[n] !== q.correct;
              if (!isWrong) return null;
              return (
                <div key={q.key} className="pt-4 space-y-3">
                  <p className="font-bold text-[color:var(--color-text)] text-base leading-snug">{q.text}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs md:text-sm">
                    <div className="p-3 rounded-xl bg-[color:var(--color-bad)]/[0.1] border border-[color:var(--color-bad)]/[0.3] text-[color:var(--color-bad)]">
                      <span className="font-bold block mb-1">❌ إجابتك:</span>
                      <span>{ans[n] === undefined ? "لم تجب على السؤال" : q.options[ans[n]]}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[color:var(--color-ok)]/[0.1] border border-[color:var(--color-ok)]/[0.3] text-[color:var(--color-ok)]">
                      <span className="font-bold block mb-1">✓ الإجابة الصحيحة:</span>
                      <span>{q.options[q.correct]}</span>
                    </div>
                  </div>
                  {q.explanation && (
                    <div className="p-3 rounded-xl bg-[color:var(--color-card2)]/[0.6] border border-[color:var(--color-line)]/[0.3] text-xs text-[color:var(--color-mute)] leading-relaxed">
                      <b className="text-[color:var(--color-hd)] ml-1">💡 التوضيح والشرح:</b>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}

            {!wrongKeys.size && (
              <div className="py-8 text-center text-[color:var(--color-ok)] font-medium">
                ممتاز جداً! جميع إجاباتك كانت صحيحة وبلا أي أخطاء 🌟
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }


  const q = items[i], a = ans[i], show = mode === "practice" && a !== undefined;
  const answeredCount = Object.keys(ans).length;
  const progressPct = Math.round((answeredCount / items.length) * 100);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Top Header Controls */}
      <div className="rounded-2xl glass-panel p-4 flex flex-col sm:flex-row items-center justify-between gap-3 border border-[color:var(--color-line)]/[0.4]">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-[color:var(--color-text)]">{exam.title}</h1>
          <div className="flex items-center gap-2 text-xs text-[color:var(--color-mute)] mt-1">
            <span className="font-semibold text-[color:var(--color-hd)]">السؤال {i + 1} من {items.length}</span>
            {mode === "exam" && (
              <>
                <span>•</span>
                <span className={`font-mono font-bold px-2 py-0.5 rounded ${left < 120 ? "bg-[color:var(--color-bad)]/[0.1] text-[color:var(--color-bad)] border border-[color:var(--color-bad)]/[0.6] animate-pulse" : "bg-[color:var(--color-bg-dark)]/[0.2] text-[color:var(--color-hd)] border border-[color:var(--color-line)]/[0.5]"}`}>
                  ⏱️ {fmt(left)}
                </span>
              </>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            const un = items.length - answeredCount;
            if (confirm(un ? `لديك ${un} سؤالاً لم تجب عليه. إنهاء الاختبار؟` : "إنهاء الاختبار؟")) {
              finish();
            }
          }}
          className="w-full sm:w-auto px-5 py-3 rounded-xl border border-[color:var(--color-bad)]/[0.7] bg-[color:var(--color-bad)]/[0.2] text-[color:var(--color-bad)] hover:bg-[color:var(--color-bad)]/[0.4] text-xs font-bold transition-colors active:opacity-85"
        >
          إنهاء الاختبار 🏁
        </button>
      </div>

      {/* Main Question Card */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 space-y-6 border border-[color:var(--color-line)]/[0.4] shadow-xl">
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-[color:var(--color-mute)] font-medium">
            <span>إنجاز الإجابات</span>
            <span className="text-[color:var(--color-hd)] font-bold">{progressPct}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[color:var(--color-card2)]/[0.8]">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${progressPct}%`, background: 'linear-gradient(to right, var(--color-pri), var(--color-pri-hover))' }}
            />
          </div>
        </div>

        <p className="text-lg sm:text-xl font-extrabold text-[color:var(--color-text)] leading-relaxed">{q.text}</p>

        {/* Options */}
        <div className="space-y-2.5">
          {q.options.map((t, k) => {
            const isChosen = a === k;
            let btnStyle = "border-[color:var(--color-line)]/[0.4] bg-[color:var(--color-card2)]/[0.6] hover:bg-[color:var(--color-card2)] text-[color:var(--color-text)]";
            if (show) {
              if (k === q.correct) btnStyle = "border-[color:var(--color-ok)] bg-[color:var(--color-ok)]/[0.15] text-[color:var(--color-text)]";
              else if (isChosen) btnStyle = "border-[color:var(--color-bad)] bg-[color:var(--color-bad)]/[0.15] text-[color:var(--color-text)]";
              else btnStyle = "border-[color:var(--color-line)]/[0.2] bg-[color:var(--color-card2)]/[0.2] text-[color:var(--color-mute)] opacity-60";
            } else if (isChosen) {
              btnStyle = "border-[color:var(--color-hd)] bg-[color:var(--color-card)] text-[color:var(--color-text)] shadow-lg";
            }

            return (
              <button
                key={k}
                disabled={show}
                onClick={() => setAns({ ...ans, [i]: k })}
                className={`flex w-full items-center gap-3.5 rounded-2xl border-2 p-4 text-start transition-all ${btnStyle}`}
              >
                <span className={`w-6 h-6 flex-shrink-0 rounded-full border-2 flex items-center justify-center text-xs font-bold ${isChosen || (show && k === q.correct) ? "border-[color:var(--color-hd)] bg-[color:var(--color-hd)] text-[color:var(--color-bg)]" : "border-[color:var(--color-mute)]/[0.5]"}`}>
                  {show && k === q.correct ? "✓" : isChosen ? "✓" : ""}
                </span>
                <span className="text-sm sm:text-base font-medium">{t}</span>
              </button>
            );
          })}
        </div>

        {show && q.explanation && (
          <div className="rounded-2xl bg-[color:var(--color-card2)]/[0.9] border border-[color:var(--color-line)]/[0.4] p-4 text-xs sm:text-sm text-[color:var(--color-text)]">
            <b className="text-[color:var(--color-hd)] block mb-1">💡 التوضيح:</b>
            {q.explanation}
          </div>
        )}

        <div className="pt-2 flex items-center justify-between gap-2">
          <div className="flex gap-2">
            <button disabled={i === 0} onClick={() => setI(i - 1)} className="rounded-xl px-4 py-2.5 font-bold text-xs border border-[color:var(--color-line)]/[0.6] bg-[color:var(--color-card2)]/[0.6] text-[color:var(--color-text)] disabled:opacity-30">← السابق</button>
            <button disabled={i === items.length - 1} onClick={() => setI(i + 1)} className="rounded-xl px-5 py-2.5 font-bold text-xs bg-[color:var(--color-pri)] hover:bg-[color:var(--color-pri-hover)] text-[color:var(--color-bg)] disabled:opacity-30">التالي →</button>
          </div>
          <button onClick={() => setFlag({ ...flag, [i]: !flag[i] })} className={`rounded-xl px-3.5 py-2.5 font-semibold text-xs border ${flag[i] ? "border-[color:var(--color-amber)] bg-[color:var(--color-amber)]/[0.1] text-[color:var(--color-amber)]" : "border-[color:var(--color-line)] text-[color:var(--color-mute)]"}`}>
            {flag[i] ? "⚑ معلّم للمراجعة" : "⚐ علّم للمراجعة"}
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="rounded-3xl glass-panel p-5 space-y-3 border border-[color:var(--color-line)]/[0.4]">
        <b className="text-sm font-bold text-[color:var(--color-text)] block">خارطة الأسئلة:</b>
        <div className="grid grid-cols-6 sm:grid-cols-10 gap-2">
          {items.map((_, n) => (
            <button key={n} onClick={() => setI(n)} className={`relative h-10 rounded-xl border-2 text-xs font-bold transition-all flex items-center justify-center ${n === i ? "bg-[color:var(--color-pri)] border-[color:var(--color-hd)] text-[color:var(--color-bg)]" : ans[n] !== undefined ? "bg-[color:var(--color-card2)] border-[color:var(--color-pri)] text-[color:var(--color-hd)]" : "bg-[color:var(--color-card2)]/[0.6] border-[color:var(--color-line)]/[0.4] text-[color:var(--color-mute)]"}`}>
              {n + 1}
              {flag[n] && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[color:var(--color-amber)] border border-[color:var(--color-bg)]" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

