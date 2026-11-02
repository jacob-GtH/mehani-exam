import { writer } from "@/lib/sanity";

export const dynamic = "force-dynamic";
type A = { slug: string; pct: number; passed: boolean; seconds: number; mode: string; createdAt: string; wrong?: string[] };
type E = { slug: string; title: string; questions?: { _key: string; text: string }[] };
const DAY = 864e5;

function Card({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-xl border border-line bg-card p-3 text-center"><b className="block text-2xl text-hd">{value}</b><span className="text-sm text-mute">{label}</span></div>;
}

export default async function Stats() {
  const since = new Date(Date.now() - 90 * DAY).toISOString();
  const [att, exams] = await Promise.all([
    writer.fetch<A[]>(`*[_type=="attempt" && createdAt>$since] | order(createdAt desc)[0...5000]{slug,pct,passed,seconds,mode,createdAt,wrong}`, { since }),
    writer.fetch<E[]>(`*[_type=="exam"]{"slug": slug.current, title, questions[]{_key,text}}`),
  ]);
  const n = att.length;
  const avg = (f: (a: A) => number, list = att) => (list.length ? Math.round(list.reduce((s, a) => s + f(a), 0) / list.length) : 0);
  const passRate = n ? Math.round((att.filter((a) => a.passed).length / n) * 100) : 0;
  const days = [...Array(14)].map((_, i) => new Date(Date.now() - (13 - i) * DAY).toISOString().slice(0, 10));
  const perDay = days.map((d) => att.filter((a) => a.createdAt.slice(0, 10) === d).length);
  const maxDay = Math.max(1, ...perDay);

  const perExam = exams.map((e) => {
    const ea = att.filter((a) => a.slug === e.slug);
    return { title: e.title, n: ea.length, avg: avg((a) => a.pct, ea), pass: ea.length ? Math.round((ea.filter((a) => a.passed).length / ea.length) * 100) : 0 };
  }).sort((a, b) => b.n - a.n);

  const hard: { exam: string; text: string; rate: number }[] = [];
  for (const e of exams) {
    const ea = att.filter((a) => a.slug === e.slug);
    if (ea.length < 3) continue;
    const wc: Record<string, number> = {};
    ea.forEach((a) => a.wrong?.forEach((k) => (wc[k] = (wc[k] || 0) + 1)));
    e.questions?.forEach((q) => { if (wc[q._key]) hard.push({ exam: e.title, text: q.text, rate: Math.round((wc[q._key] / ea.length) * 100) }); });
  }
  hard.sort((a, b) => b.rate - a.rate);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-hd">الإحصاءات <small className="text-base text-mute">(آخر 90 يومًا)</small></h1>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card label="محاولة" value={n} /><Card label="نسبة النجاح" value={`${passRate}%`} />
        <Card label="متوسط الدرجة" value={`${avg((a) => a.pct)}%`} /><Card label="متوسط الزمن (د)" value={(avg((a) => a.seconds) / 60).toFixed(1)} />
      </div>
      <p className="text-sm text-mute">محاكاة: {att.filter((a) => a.mode === "exam").length} · تدريب: {att.filter((a) => a.mode !== "exam").length}</p>

      <section className="rounded-2xl border-2 border-line bg-card p-5">
        <h2 className="mb-3 text-lg font-bold text-hd">المحاولات آخر 14 يومًا</h2>
        <div className="flex h-32 items-end gap-1" dir="ltr">
          {perDay.map((c, i) => (
            <div key={days[i]} className="flex flex-1 flex-col items-center justify-end" title={`${days[i]}: ${c}`}>
              <span className="text-xs text-mute">{c || ""}</span>
              <div className="w-full rounded-t bg-pri2" style={{ height: `${(c / maxDay) * 100}%`, minHeight: c ? 4 : 1 }} />
            </div>))}
        </div>
        <div className="mt-1 flex justify-between text-xs text-mute" dir="ltr"><span>{days[0].slice(5)}</span><span>{days[13].slice(5)}</span></div>
      </section>

      <section className="rounded-2xl border-2 border-line bg-card p-5">
        <h2 className="mb-3 text-lg font-bold text-hd">حسب الاختبار</h2>
        {perExam.map((e) => (
          <div key={e.title} className="flex items-center gap-3 border-b border-line py-2">
            <span className="flex-1">{e.title}</span><span className="text-sm text-mute">{e.n} محاولة</span>
            <span className="w-16 text-center">{e.avg}%</span><span className={`w-16 text-center ${e.pass >= 50 ? "text-ok" : "text-bad"}`}>نجاح {e.pass}%</span>
          </div>))}
        {!perExam.length && <p className="text-mute">لا توجد بيانات.</p>}
      </section>

      <section className="rounded-2xl border-2 border-line bg-card p-5">
        <h2 className="mb-1 text-lg font-bold text-hd">أصعب الأسئلة</h2>
        <p className="mb-3 text-sm text-mute">نسبة المحاولات التي أخطأ فيها المتقدمون (تقريبية، وتظهر بعد 3 محاولات على الأقل لكل اختبار). راجع الأسئلة المرتفعة، فقد تكون صياغتها ملتبسة.</p>
        {hard.slice(0, 10).map((h, i) => (
          <div key={i} className="border-b border-line py-2"><div className="flex justify-between gap-3"><span>{h.text}</span><b className="text-bad">{h.rate}%</b></div><small className="text-mute">{h.exam}</small></div>))}
        {!hard.length && <p className="text-mute">لا توجد بيانات كافية بعد.</p>}
      </section>
    </div>
  );
}
