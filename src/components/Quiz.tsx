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
    const list = shuffle(src).map((q) => {
      const idx = shuffle(q.options.map((_, k) => k));
      return { key: q._key, text: q.text, options: idx.map((k) => q.options[k]), correct: idx.indexOf(q.correct), explanation: q.explanation };
    });
    setItems(list); setI(0); setAns({}); setFlag({}); setLeft(list.length * 60);
    t0.current = Date.now(); done.current = false; setPhase("quiz");
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
    <div className="max-w-xl mx-auto rounded-3xl glass-panel p-6 sm:p-8 space-y-6 text-center border border-emerald-800/40 shadow-2xl">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-3xl shadow-inner">
        🎯
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">{exam.title}</h1>
        <p className="mt-2 text-sm text-mute">
          {exam.count} سؤال تدريبي · حد النجاح المطلوب {exam.passMark}%
        </p>
      </div>

      <div className="space-y-3 text-right">
        <label className="text-xs font-bold text-emerald-300 block">اختر أسلوب الاختبار:</label>
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
              className={`text-right rounded-2xl p-4 border-2 transition-all flex flex-col justify-between ${
                mode === m
                  ? "border-emerald-400 bg-emerald-950/60 shadow-lg shadow-emerald-950"
                  : "border-emerald-900/50 bg-card/60 hover:border-emerald-800"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-white text-base">{t}</span>
                <span className="text-xl">{icon}</span>
              </div>
              <p className="text-xs text-mute leading-relaxed">{d}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="pt-2 space-y-3">
        <button
          onClick={() => start(exam.questions!)}
          className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-3.5 px-6 font-bold text-lg shadow-lg shadow-emerald-950 transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          ابدأ التدريب الآن ←
        </button>
        <Link
          href={`/exam/${exam.slug}`}
          className="block text-xs font-semibold text-mute hover:text-white transition-colors"
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
        <div className="rounded-3xl glass-panel p-8 text-center border border-emerald-800/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-green-500" />
          <div className="w-20 h-20 mx-auto mb-4 rounded-3xl flex items-center justify-center text-4xl shadow-inner bg-card2/80">
            {pass ? "🎉" : "📚"}
          </div>
          <div className={`text-6xl sm:text-7xl font-black mb-2 tracking-tight ${pass ? "text-emerald-400" : "text-rose-400"}`}>
            {pct}%
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {pass ? `مبروك! اجتزت الاختبار بنجاح (المطلوب ${exam.passMark}%)` : `فرصة أفضل في المرة القادمة (المطلوب ${exam.passMark}%)`}
          </h2>
          <p className="mt-2 text-sm text-mute">
            أجبت بشكل صحيح على <b className="text-white">{ok}</b> من أصل <b className="text-white">{items.length}</b> سؤال · استغرقت <b className="text-white">{Math.floor(sec / 60)}</b> دقيقة و <b className="text-white">{sec % 60}</b> ثانية
          </p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => start(exam.questions!)}
            className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-3.5 px-4 font-bold text-sm shadow-md transition-all active:scale-95"
          >
            إعادة الاختبار كامل 🔄
          </button>
          {!!wrongKeys.size && (
            <button
              onClick={() => start(exam.questions!.filter((q) => wrongKeys.has(q._key)))}
              className="rounded-2xl glass-card text-emerald-300 border border-emerald-500/30 hover:border-emerald-400 py-3.5 px-4 font-bold text-sm transition-all active:scale-95"
            >
              تدرب على أخطائك فقط ({wrongKeys.size}) ⚠️
            </button>
          )}
          <Link
            href="/"
            className="rounded-2xl glass-card text-mute hover:text-white py-3.5 px-4 font-bold text-sm text-center transition-all flex items-center justify-center"
          >
            جميع المهن 📋
          </Link>
        </div>

        {/* Mistakes Review */}
        <div className="rounded-3xl glass-panel p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-900/40 pb-3">
            <h3 className="text-lg font-bold text-hd flex items-center gap-2">
              <span>🔍</span> مراجعة الأخطاء والإجابات
            </h3>
            <span className="text-xs text-mute font-medium">
              {wrongKeys.size ? `${wrongKeys.size} أسئلة بحاجة لمراجعة` : "لا توجد أي أخطاء!"}
            </span>
          </div>

          <div className="space-y-4 divide-y divide-emerald-900/30">
            {items.map((q, n) => {
              const isWrong = ans[n] !== q.correct;
              if (!isWrong) return null;
              return (
                <div key={q.key} className="pt-4 space-y-3">
                  <p className="font-bold text-white text-base leading-snug">{q.text}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs md:text-sm">
                    <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-900/40 text-rose-300">
                      <span className="font-bold block mb-1">❌ إجابتك:</span>
                      <span>{ans[n] === undefined ? "لم تجب على السؤال" : q.options[ans[n]]}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-300">
                      <span className="font-bold block mb-1">✓ الإجابة الصحيحة:</span>
                      <span>{q.options[q.correct]}</span>
                    </div>
                  </div>
                  {q.explanation && (
                    <div className="p-3 rounded-xl bg-card2/60 border border-emerald-900/30 text-xs text-mute leading-relaxed">
                      <b className="text-emerald-300 ml-1">💡 التوضيح والشرح:</b>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}

            {!wrongKeys.size && (
              <div className="py-8 text-center text-emerald-300 font-medium">
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
      <div className="rounded-2xl glass-panel p-4 flex flex-col sm:flex-row items-center justify-between gap-3 border border-emerald-800/40">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-white">{exam.title}</h1>
          <div className="flex items-center gap-2 text-xs text-mute mt-1">
            <span className="font-semibold text-emerald-300">السؤال {i + 1} من {items.length}</span>
            {mode === "exam" && (
              <>
                <span>•</span>
                <span className={`font-mono font-bold px-2 py-0.5 rounded ${left < 120 ? "bg-rose-950 text-rose-400 border border-rose-800/60 animate-pulse" : "bg-emerald-950 text-emerald-300 border border-emerald-800/40"}`}>
                  ⏱️ {fmt(left)}
                </span>
              </>
            )}
          </div>
        </div>

        <button
          onClick={() => {
            const un = items.length - answeredCount;
            if (confirm(un ? `لديك ${un} سؤالاً لم تجب عليه. إنهاء الاختبار؟` : "إنهاء الاختبار؟")) {
              finish();
            }
          }}
          className="w-full sm:w-auto px-4 py-2 rounded-xl border border-rose-800/60 bg-rose-950/40 text-rose-300 hover:bg-rose-900/50 text-xs font-bold transition-colors"
        >
          إنهاء الاختبار 🏁
        </button>
      </div>

      {/* Main Question Card */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 space-y-6 border border-emerald-800/40 shadow-xl">
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-mute font-medium">
            <span>إنجاز الإجابات</span>
            <span className="text-emerald-300 font-bold">{progressPct}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-card2/80">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        <p className="text-lg sm:text-xl font-extrabold text-white leading-relaxed">{q.text}</p>

        {/* Options */}
        <div className="space-y-2.5">
          {q.options.map((t, k) => {
            const isChosen = a === k;
            let btnStyle = "border-emerald-900/40 bg-card2/60 hover:bg-card2 text-white";
            if (show) {
              if (k === q.correct) btnStyle = "border-emerald-500 bg-emerald-950/70 text-emerald-200";
              else if (isChosen) btnStyle = "border-rose-500 bg-rose-950/70 text-rose-200";
              else btnStyle = "border-emerald-950/40 bg-card2/30 text-mute opacity-60";
            } else if (isChosen) {
              btnStyle = "border-emerald-400 bg-emerald-950/80 text-white shadow-lg";
            }

            return (
              <button
                key={k}
                disabled={show}
                onClick={() => setAns({ ...ans, [i]: k })}
                className={`flex w-full items-center gap-3.5 rounded-2xl border-2 p-4 text-start transition-all ${btnStyle}`}
              >
                <span className={`w-6 h-6 flex-shrink-0 rounded-full border-2 flex items-center justify-center text-xs font-bold ${isChosen || (show && k === q.correct) ? "border-emerald-400 bg-emerald-400 text-black" : "border-mute/50"}`}>
                  {show && k === q.correct ? "✓" : isChosen ? "✓" : ""}
                </span>
                <span className="text-sm sm:text-base font-medium">{t}</span>
              </button>
            );
          })}
        </div>

        {show && q.explanation && (
          <div className="rounded-2xl bg-card2/90 border border-emerald-800/40 p-4 text-xs sm:text-sm text-emerald-100/90">
            <b className="text-emerald-300 block mb-1">💡 التوضيح:</b>
            {q.explanation}
          </div>
        )}

        <div className="pt-2 flex items-center justify-between gap-2">
          <div className="flex gap-2">
            <button disabled={i === 0} onClick={() => setI(i - 1)} className="rounded-xl px-4 py-2.5 font-bold text-xs border border-emerald-900/60 bg-card2/60 disabled:opacity-30">← السابق</button>
            <button disabled={i === items.length - 1} onClick={() => setI(i + 1)} className="rounded-xl px-5 py-2.5 font-bold text-xs bg-emerald-600 text-white disabled:opacity-30">التالي →</button>
          </div>
          <button onClick={() => setFlag({ ...flag, [i]: !flag[i] })} className={`rounded-xl px-3.5 py-2.5 font-semibold text-xs border ${flag[i] ? "border-amber-400 bg-amber-950/40 text-amber-300" : "border-emerald-900 text-mute"}`}>
            {flag[i] ? "⚑ معلّم للمراجعة" : "⚐ علّم للمراجعة"}
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="rounded-3xl glass-panel p-5 space-y-3 border border-emerald-800/40">
        <b className="text-sm font-bold text-white block">خارطة الأسئلة:</b>
        <div className="grid grid-cols-6 sm:grid-cols-10 gap-2">
          {items.map((_, n) => (
            <button key={n} onClick={() => setI(n)} className={`relative h-10 rounded-xl border-2 text-xs font-bold transition-all flex items-center justify-center ${n === i ? "bg-emerald-600 border-emerald-400 text-white" : ans[n] !== undefined ? "bg-card2 border-emerald-500 text-emerald-300" : "bg-card2/60 border-emerald-900/40 text-mute"}`}>
              {n + 1}
              {flag[n] && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border border-black" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

