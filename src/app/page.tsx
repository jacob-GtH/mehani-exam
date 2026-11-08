import Link from "next/link";
import { getExams } from "@/lib/data";
import { SITE } from "@/lib/site";
import ProfessionSearch from "@/components/ProfessionSearch";
import type { Exam } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "التدريب على الاختبارات المهنية في اليمن",
  description: "استعد للاختبارات المهنية في اليمن عبر نماذج تدريبية تفاعلية، وأسئلة اختيار من متعدد، ومحاكاة زمنية، ومراجعة الإجابات والشروحات.",
  alternates: { canonical: "/" },
  openGraph: { title: "التدريب على الاختبارات المهنية في اليمن", description: "نماذج تدريبية ومحاكاة تساعدك على الاستعداد للاختبارات المهنية.", url: "/", type: "website" },
};

export const revalidate = 60;

export default async function Home() {
  const exams: Exam[] = await getExams();
  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE.name,
      url: SITE.url,
      inLanguage: "ar",
      description: "منصة تدريبية مستقلة للاستعداد للاختبارات المهنية في اليمن.",
      audience: { "@type": "Audience", geographicArea: { "@type": "Country", name: "اليمن" } },
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "الاختبارات المهنية التدريبية المتاحة",
      itemListElement: exams.map((e: Exam, i: number) => ({
        "@type": "ListItem", position: i + 1, url: `${SITE.url}/exam/${e.slug}`, name: e.title,
      })),
    },
  ];

  return (
    <div className="space-y-16 md:space-y-20 ">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />

      <section className="relative isolate overflow-hidden rounded-[2rem] bg-[color:var(--color-bg-dark)] px-6 py-12 text-center shadow-[0_24px_70px_rgba(16,44,42,.13)] sm:px-10 md:py-16">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full border border-white/10" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-20 h-56 w-56 rounded-full border border-white/10" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="relative mx-auto max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold text-[#D8E9DF] sm:text-sm">
            <span className="h-2 w-2 rounded-full bg-[#B9D6A9]" /> نماذج تدريبية للمهن والاعتمادات المهنية
          </span>
          <h1 className="mt-7 text-3xl font-extrabold leading-[1.35] tracking-tight text-white sm:text-4xl md:text-5xl">
            استعد لاختبارك المهني
            <span className="mt-1 block text-[#B9D6A9]">بمعرفة وثقة أكبر</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-[#D1DED7] sm:text-base">
            منصة تدريبية مستقلة للمتقدمين في اليمن؛ تدرّب على نماذج أسئلة متنوعة، وقِس مستواك، وراجع الإجابات والشروحات لتستعد بصورة أفضل لاختبارك المهني.
          </p>
          <ProfessionSearch exams={exams} />
          <div className="mt-5 flex justify-center">
            <a href="https://wa.me/967777829664" target="_blank" rel="noopener noreferrer" aria-label="تواصل معنا عبر واتساب، يفتح في نافذة جديدة" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-white/10">تواصل معنا عبر واتساب <span className="mr-2" aria-hidden="true">↗</span></a>
          </div>
        </div>
        <div className="relative mx-auto mt-12 grid max-w-2xl grid-cols-3 divide-x divide-x-reverse divide-white/15 border-t border-white/15 pt-6">
          <div className="px-2"><div className="text-2xl font-extrabold text-white sm:text-3xl">{exams.length}</div><div className="mt-1 text-[11px] text-[#C2D2C9] sm:text-xs">اختبارات متاحة</div></div>
          <div className="px-2"><div className="text-2xl font-extrabold text-white sm:text-3xl">100%</div><div className="mt-1 text-[11px] text-[#C2D2C9] sm:text-xs">مجانية للتدريب</div></div>
          <div className="px-2"><div className="text-2xl font-extrabold text-white sm:text-3xl">∞</div><div className="mt-1 text-[11px] text-[#C2D2C9] sm:text-xs">إعادة المحاولة</div></div>
        </div>
      </section>

      <section id="exams" className="scroll-mt-28 space-y-7">
        <div className="flex flex-col gap-3 border-b border-[color:var(--color-line)] pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-xs font-extrabold tracking-wide text-[color:var(--color-pri)]">ابدأ من هنا</span>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">اختر اختبار مهنتك</h2>
            <p className="mt-2 text-sm">تصفح النماذج المتاحة واختر الاختبار الذي يناسب استعدادك.</p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-3.5 py-2 text-xs font-bold text-[color:var(--color-text-light)] ring-1 ring-[color:var(--color-line)]">
            <span className="h-2 w-2 rounded-full bg-[color:var(--color-ok)]" /> {exams.length} اختبار متاح
          </span>
        </div>

        {exams.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {exams.map((exam: Exam, index: number) => (
              <Link key={exam._id} href={`/exam/${exam.slug}`} className="group flex min-h-[245px] flex-col rounded-2xl border border-[color:var(--color-line)] bg-white p-5 transition duration-200 hover:-translate-y-1 hover:border-emerald-700/30 hover:shadow-[0_18px_38px_rgba(16,44,42,.08)]">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF3ED] text-lg font-extrabold text-[color:var(--color-pri)]">{String(index + 1).padStart(2, "0")}</span>
                  <span className="rounded-lg bg-[#F4F1E8] px-3 py-1.5 text-[11px] font-extrabold text-[#80683A]">النجاح {exam.passMark}%</span>
                </div>
                <h3 className="mt-5 text-lg font-extrabold leading-7 text-[color:var(--color-hd)] transition group-hover:text-[color:var(--color-pri)]">{exam.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-7">{exam.description || "اختبار تدريبي لتقييم المهارات والمعارف المهنية الأساسية."}</p>
                <div className="mt-auto flex items-center justify-between border-t border-[color:var(--color-line)] pt-4">
                  <span className="text-xs font-semibold text-[color:var(--color-text-light)]">{exam.count} سؤال · مجاني</span>
                  <span className="inline-flex items-center gap-2 text-xs font-extrabold text-[color:var(--color-pri)]">عرض الاختبار <span className="transition-transform group-hover:-translate-x-1" aria-hidden="true">←</span></span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[color:var(--color-line)] bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--color-card2)] text-2xl" aria-hidden="true">⌕</div>
            <h3 className="mt-4 text-lg font-extrabold">لا توجد اختبارات منشورة حالياً</h3>
            <p className="mt-2 text-sm">نعمل على إضافة نماذج مهنية جديدة. يرجى العودة لاحقاً.</p>
          </div>
        )}
      </section>

      <section className="grid gap-6 rounded-[1.75rem] border border-[color:var(--color-line)] bg-white p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="text-xs font-extrabold tracking-wide text-[color:var(--color-pri)]">دليل الاستعداد</p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight">كيف تستعد لاختبارك المهني؟</h2>
          <p className="mt-3 max-w-3xl text-sm leading-8 text-[color:var(--color-text-light)]">
            ابدأ بتحديد موضوعات الاختبار ومتطلباته من الجهة المنظمة، ثم قسّم المراجعة إلى جلسات قصيرة، ودوّن النقاط التي تحتاج إلى تقوية. تساعدك النماذج التدريبية على التعرّف على نوعية الأسئلة وقياس تقدمك، لكنها لا تحل محل المراجع والتعليمات الرسمية.
          </p>
        </div>
        <Link href="/guide/preparing-for-professional-exams" className="btn-secondary inline-flex min-h-12 items-center justify-center rounded-xl px-5 text-sm font-extrabold">
          اقرأ دليل الاستعداد <span className="mr-2" aria-hidden="true">←</span>
        </Link>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-[color:var(--color-line)] bg-white p-6">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF3ED] text-xl" aria-hidden="true">✦</span>
          <h3 className="mt-4 text-base font-extrabold">تدرّب بطريقتك</h3>
          <p className="mt-2 text-sm leading-7">تعرّف على نمط الأسئلة وتدرّب بالوتيرة التي تناسبك.</p>
        </div>
        <div className="rounded-2xl border border-[color:var(--color-line)] bg-white p-6">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F4F1E8] text-xl" aria-hidden="true">◎</span>
          <h3 className="mt-4 text-base font-extrabold">افهم إجاباتك</h3>
          <p className="mt-2 text-sm leading-7">راجع الإجابات والشروحات لتتعلم من الأخطاء وتثبت المعلومات.</p>
        </div>
        <div className="rounded-2xl border border-[color:var(--color-line)] bg-white p-6">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF0F5] text-xl" aria-hidden="true">◷</span>
          <h3 className="mt-4 text-base font-extrabold">استعد للوقت</h3>
          <p className="mt-2 text-sm leading-7">استخدم المحاكاة الزمنية عندما ترغب في قياس جاهزيتك.</p>
        </div>
      </section>
    </div>
  );
}
