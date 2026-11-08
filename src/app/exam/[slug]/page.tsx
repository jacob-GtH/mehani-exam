import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Exam } from "@/lib/data";
import { getExamLanding, getExams } from "@/lib/data";
import { SITE } from "@/lib/site";

export const revalidate = 60;
type P = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getExams()).map((exam: Exam) => ({ slug: exam.slug }));
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { slug } = await params;
  const exam = await getExamLanding(slug);
  if (!exam) return {};
  const title = `اختبار ${exam.title} في اليمن | نموذج تدريبي ومحاكاة`;
  const description = `تدرّب على اختبار ${exam.title} من خلال ${exam.count} سؤالاً تدريبياً، وجرّب المحاكاة الزمنية، وراجع إجاباتك لتقييم استعدادك. محتوى تدريبي مستقل وليس اختباراً رسمياً.`;
  return {
    title,
    description,
    alternates: { canonical: `/exam/${slug}` },
    openGraph: { title, description, url: `/exam/${slug}`, type: "article", locale: "ar_YE" },
    twitter: { card: "summary", title, description },
  };
}

const features = [
  { icon: "✦", title: "تدريب تفاعلي", description: "تدرّب على الأسئلة وتعرّف على الإجابات مع الشرح." },
  { icon: "◷", title: "محاكاة بوقت", description: "اختبر جاهزيتك في تجربة محددة الوقت." },
  { icon: "↻", title: "أعد المحاولة", description: "راجع مستواك وكرر التدريب متى احتجت." },
];

export default async function ExamPage({ params }: P) {
  const { slug } = await params;
  const [exam, allExams] = await Promise.all([getExamLanding(slug), getExams()]);
  if (!exam) notFound();

  const faq: [string, string][] = [
    [`كم عدد أسئلة اختبار ${exam.title}؟`, `يتكوّن هذا النموذج التدريبي من ${exam.count} سؤالاً.`],
    ["ما درجة النجاح؟", `حد النجاح المحدد لهذا النموذج هو ${exam.passMark}%.`],
    ["هل يمكنني إعادة الاختبار؟", "نعم، يمكنك إعادة التدريب والمحاولة أكثر من مرة."],
    ["هل هذه أسئلة الاختبار الرسمي؟", "هذه أسئلة تدريبية للمراجعة والاستعداد، ولا تمثل ضماناً لورود الأسئلة نفسها في الاختبار الرسمي."],
  ];
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map(([question, answer]) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: SITE.name, item: SITE.url },
        { "@type": "ListItem", position: 2, name: exam.title, item: `${SITE.url}/exam/${slug}` },
      ],
    },
  ];
  const otherExams: Exam[] = allExams
    .filter((item: Exam) => item.slug !== slug)
    .slice(0, 8);
  const sampleQuestions: string[] = exam.sample ?? [];

  return (
    <div className="mx-auto max-w-5xl space-y-8 sm:space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />

      <nav aria-label="مسار التنقل" className="flex items-center gap-2 text-sm text-[color:var(--color-mute)]">
        <Link href="/" className="font-semibold transition hover:text-[color:var(--color-pri)]">الرئيسية</Link>
        <span aria-hidden="true">/</span>
        <span className="font-bold text-[color:var(--color-hd)]">{exam.title}</span>
      </nav>

      <section className="relative isolate overflow-hidden rounded-[2rem] border border-[color:var(--color-line)] bg-white shadow-[0_24px_70px_rgba(16,44,42,.08)]">
        <div aria-hidden="true" className="absolute -left-20 -top-24 -z-10 h-72 w-72 rounded-full bg-[#B9D6A9]/35 blur-3xl" />
        <div aria-hidden="true" className="absolute -bottom-28 right-1/3 -z-10 h-64 w-64 rounded-full bg-[#B9A477]/15 blur-3xl" />
        <div className="grid gap-8 p-6 sm:p-9 lg:grid-cols-[1fr_280px] lg:items-center lg:p-12">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D8E8DE] bg-[#F0F6F1] px-3.5 py-1.5 text-xs font-bold text-[#28634E]">
              <span className="h-2 w-2 rounded-full bg-[#27815D]" /> نموذج تدريبي متاح
            </div>
            <div className="space-y-3">
              <p className="text-sm font-bold text-[color:var(--color-pri)]">نموذج تدريبي للمتقدمين في اليمن</p>
              <h1 className="max-w-2xl text-3xl font-black leading-[1.35] tracking-tight text-[color:var(--color-hd)] sm:text-4xl lg:text-[2.7rem]">
                استعد لاختبار <span className="text-[color:var(--color-pri)]">{exam.title}</span> بثقة
              </h1>
              <p className="max-w-2xl text-base leading-8 text-[color:var(--color-text-light)]">{exam.description || `راجع معلوماتك ومهاراتك من خلال اختبار ${exam.title} التدريبي، وتعرّف على مستواك قبل الاختبار.`}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href={`/exam/${slug}/start`} className="btn-primary inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl px-7 text-base font-extrabold shadow-lg shadow-emerald-950/10">
                ابدأ الاختبار <span aria-hidden="true" className="text-xl">←</span>
              </Link>
              <Link href="/#exams" className="btn-secondary inline-flex min-h-14 items-center justify-center rounded-2xl px-6 text-sm font-bold">استكشف بقية المهن</Link>
            </div>
            <p className="text-xs leading-6 text-[color:var(--color-mute)]">محتوى تدريبي مستقل للمراجعة والاستعداد، وليس اختباراً رسمياً أو بديلاً عن تعليمات الجهة المنظمة. يُرجى الرجوع إلى الجهة المختصة للتحقق من الشروط والمواعيد المعتمدة.</p>
          </div>

          <div className="rounded-[1.75rem] border border-white/80 bg-[#102C2A] p-5 text-white shadow-xl shadow-emerald-950/15 sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-sm font-bold text-white/75">ملخص النموذج</span>
              <span className="rounded-xl bg-white/10 px-3 py-2 text-xl" aria-hidden="true">✦</span>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4">
                <div className="text-3xl font-black tabular-nums">{exam.count}</div>
                <div className="mt-1 text-xs font-medium text-white/65">سؤال تدريبي</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4">
                  <div className="text-2xl font-black tabular-nums">{exam.passMark}%</div>
                  <div className="mt-1 text-xs text-white/65">حد النجاح</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4">
                  <div className="text-2xl font-black">مجاناً</div>
                  <div className="mt-1 text-xs text-white/65">التدريب والمحاولات</div>
                </div>
              </div>
              <div className="flex items-center gap-2 border-t border-white/10 pt-4 text-xs text-white/70">
                <span className="text-[#B9D6A9]">✓</span> يمكنك اختيار نمط التدريب أو المحاكاة
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="مميزات الاختبار" className="grid gap-3 sm:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.title} className="glass-card flex items-start gap-4 p-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#EAF3ED] text-xl font-black text-[color:var(--color-pri)]">{feature.icon}</span>
            <div>
              <h2 className="text-sm font-extrabold">{feature.title}</h2>
              <p className="mt-1 text-xs leading-6">{feature.description}</p>
            </div>
          </div>
        ))}
      </section>

      {sampleQuestions.length > 0 && (
        <section className="space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="mb-1 text-xs font-bold text-[color:var(--color-pri)]">تعرّف على طبيعة الأسئلة</p>
              <h2 className="text-2xl font-black">عينة من الاختبار</h2>
            </div>
            <span className="rounded-full bg-[color:var(--color-card2)] px-3 py-1.5 text-xs font-bold text-[color:var(--color-text-light)]">{sampleQuestions.length} أسئلة للمعاينة</span>
          </div>
          <div className="grid gap-3">
            {sampleQuestions.map((sample: string, index: number) => (
              <div key={`${index}-${sample.slice(0, 24)}`} className="glass-card flex gap-4 p-4 sm:p-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF3ED] text-sm font-black text-[color:var(--color-pri)]">{String(index + 1).padStart(2, "0")}</span>
                <p className="pt-1 text-sm font-semibold leading-7 text-[color:var(--color-text)]">{sample}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-dashed border-[color:var(--color-line)] bg-white/60 p-4 text-center text-xs leading-6 text-[color:var(--color-mute)]">هذه معاينة لبعض الأسئلة فقط. ابدأ الاختبار للوصول إلى النموذج التدريبي.</div>
        </section>
      )}

      <section className="rounded-2xl border border-[color:var(--color-line)] bg-[#F5F8F5] p-5 sm:p-6">
        <h2 className="text-base font-extrabold">نصيحة للاستعداد</h2>
        <p className="mt-2 text-sm leading-7 text-[color:var(--color-text-light)]">استخدم هذا النموذج لقياس مستواك وتحديد الموضوعات التي تحتاج إلى مراجعة، ثم ارجع إلى المراجع والتعليمات الرسمية الخاصة باختبارك.</p>
        <Link href="/guide/preparing-for-professional-exams" className="mt-3 inline-flex text-sm font-extrabold text-[color:var(--color-pri)] hover:underline">اطّلع على دليل الاستعداد للاختبارات المهنية ←</Link>
      </section>

      <section className="rounded-[1.75rem] border border-[color:var(--color-line)] bg-white p-6 sm:p-8">
        <div className="mb-5">
          <p className="mb-1 text-xs font-bold text-[color:var(--color-pri)]">قبل أن تبدأ</p>
          <h2 className="text-2xl font-black">الأسئلة الشائعة</h2>
        </div>
        <div className="divide-y divide-[color:var(--color-line)]">
          {faq.map(([question, answer]) => (
            <details key={question} className="group py-4 first:pt-0 last:pb-0">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-extrabold text-[color:var(--color-hd)] marker:content-none">
                {question}
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-card2)] text-[color:var(--color-pri)] transition group-open:rotate-45" aria-hidden="true">＋</span>
              </summary>
              <p className="mt-3 max-w-3xl pr-1 text-sm leading-7">{answer}</p>
            </details>
          ))}
        </div>
      </section>

      {otherExams.length > 0 && (
        <section className="space-y-4">
          <div>
            <p className="mb-1 text-xs font-bold text-[color:var(--color-pri)]">واصل الاستعداد</p>
            <h2 className="text-2xl font-black">اختبارات مهن أخرى</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {otherExams.map((item: Exam) => (
              <Link key={item._id} href={`/exam/${item.slug}`} className="glass-card group flex items-center justify-between gap-3 p-4">
                <span className="text-sm font-bold text-[color:var(--color-text)] transition group-hover:text-[color:var(--color-pri)]">{item.title}</span>
                <span className="text-lg text-[color:var(--color-pri)] transition group-hover:-translate-x-1" aria-hidden="true">←</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
