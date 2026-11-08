import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getExamLanding, getExams } from "@/lib/data";
import { SITE } from "@/lib/site";

export const revalidate = 60;
type P = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getExams()).map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { slug } = await params;
  const e = await getExamLanding(slug);
  if (!e) return {};
  const title = `اختبار ${e.title} التجريبي — ${e.count} سؤال مع الشرح`;
  const description = `تدرّب على اختبار الاعتماد المهني لـ${e.title}: ${e.count} سؤال اختيار من متعدد مع تصحيح فوري. حد النجاح ${e.passMark}%.`;
  return { title, description, alternates: { canonical: `/exam/${slug}` }, openGraph: { title, description, url: `/exam/${slug}`, type: "article" } };
}

export default async function ExamPage({ params }: P) {
  const { slug } = await params;
  const [e, all] = await Promise.all([getExamLanding(slug), getExams()]);
  if (!e) notFound();
  const faq = [
    [`كم عدد أسئلة اختبار ${e.title}؟`, `يتكوّن الاختبار التجريبي من ${e.count} سؤال اختيار من متعدد.`],
    ["ما درجة النجاح؟", `حد النجاح في هذا التدريب ${e.passMark}%.`],
    ["هل يمكنني إعادة الاختبار؟", "نعم، يمكنك إعادة الاختبار عدة مرات مجانًا ومراجعة أخطائك."],
  ];
  const ld = [
    { "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: SITE.name, item: SITE.url },
      { "@type": "ListItem", position: 2, name: e.title, item: `${SITE.url}/exam/${slug}` }] },
  ];
  return (
    <article className="space-y-10 max-w-3xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }}
      />

      {/* Header Card */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-[color:var(--color-hd)]">
          <Link href="/" className="hover:underline">الرئيسية</Link>
          <span>/</span>
          <span className="text-[color:var(--color-mute)]">اختبارات الاعتماد المهني</span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[color:var(--color-text)] leading-tight">
            اختبار <span className="text-[color:var(--color-hd)]">{e.title}</span> التجريبي
          </h1>
          <p className="mt-3 text-sm md:text-base text-[color:var(--color-mute)] leading-relaxed">
            {e.description}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 py-4 border-y border-[color:var(--color-line)]/[0.4] text-center">
          <div className="p-3 rounded-xl bg-[color:var(--color-card2)]/[0.6]">
            <span className="block text-xl md:text-2xl font-black text-[color:var(--color-hd)]">{e.count}</span>
            <span className="text-xs text-[color:var(--color-mute)] font-medium">سؤال تدريبي</span>
          </div>
          <div className="p-3 rounded-xl bg-[color:var(--color-card2)]/[0.6]">
            <span className="block text-xl md:text-2xl font-black text-[color:var(--color-hd)]">{e.passMark}%</span>
            <span className="text-xs text-[color:var(--color-mute)] font-medium">نسبة النجاح</span>
          </div>
          <div className="p-3 rounded-xl bg-[color:var(--color-card2)]/[0.6]">
            <span className="block text-xl md:text-2xl font-black text-[color:var(--color-hd)]">مجاني</span>
            <span className="text-xs text-[color:var(--color-mute)] font-medium">إعادة غير محدودة</span>
          </div>
        </div>

        {/* CTA Button */}
        <Link
          href={`/exam/${slug}/start`}
          className="flex items-center justify-center gap-2 w-full rounded-2xl text-gold py-4 px-6 font-black text-lg shadow-lg shadow-[color:var(--color-gold)]/[0.35] transition-colors hover:brightness-105 active:opacity-90"
          style={{ color: 'var(--color-gold)', background: 'linear-gradient(to right, var(--color-pri), var(--color-pri-hover))' }}
        >
          <span>بدء الاختبار الآن</span>
          <span className="text-xl">←</span>
        </Link>
      </div>

      {/* Sample Questions */}
      {!!e.sample?.length && (
        <section className="rounded-3xl glass-panel p-6 sm:p-8 space-y-4">
          <h2 className="text-lg md:text-xl font-bold text-[color:var(--color-hd)] flex items-center gap-2">
            <span>📝</span> عينة من أسئلة الاختبار
          </h2>
          <div className="space-y-3">
            {e.sample.map((t, idx) => (
              <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-[color:var(--color-card2)]/[0.4] border border-[color:var(--color-line)]/[0.3] text-sm md:text-base text-[color:var(--color-text)] leading-relaxed">
                <span className="w-6 h-6 rounded-full bg-[color:var(--color-bg-dark)]/[0.1] text-[color:var(--color-hd)] border border-[color:var(--color-line)]/[0.6] flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{t}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="rounded-3xl glass-panel p-6 sm:p-8 space-y-4">
        <h2 className="text-lg md:text-xl font-bold text-[color:var(--color-hd)] flex items-center gap-2">
          <span>❓</span> الأسئلة الشائعة
        </h2>
        <div className="space-y-4 divide-y divide-[color:var(--color-line)]/[0.3]">
          {faq.map(([q, a], idx) => (
            <div key={idx} className={idx > 0 ? "pt-4" : ""}>
              <h3 className="font-bold text-[color:var(--color-text)] text-base mb-1.5 flex items-center gap-2">
                <span className="text-[color:var(--color-pri)]">•</span> {q}
              </h3>
              <p className="text-sm text-[color:var(--color-mute)] leading-relaxed pr-4">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Other Exams */}
      <section className="space-y-4">
        <h2 className="text-lg md:text-xl font-bold text-[color:var(--color-hd)]">اختبارات مهن أخرى قد تهمك</h2>
        <div className="flex flex-wrap gap-2.5">
          {all
            .filter((x) => x.slug !== slug)
            .slice(0, 10)
            .map((x) => (
              <Link
                key={x._id}
                href={`/exam/${x.slug}`}
                className="rounded-xl px-4 py-2 text-xs md:text-sm font-semibold glass-card text-[color:var(--color-text)] hover:text-[color:var(--color-hd)]"
              >
                {x.title}
              </Link>
            ))}
        </div>
      </section>
    </article>
  );
}

