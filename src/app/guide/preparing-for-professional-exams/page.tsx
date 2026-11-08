import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "دليل الاستعداد للاختبارات المهنية في اليمن",
  description: "خطوات عملية لتنظيم المذاكرة، وفهم متطلبات الاختبار، والاستفادة من النماذج التدريبية دون الاعتماد عليها بديلاً عن المصادر الرسمية.",
  alternates: { canonical: "/guide/preparing-for-professional-exams" },
  openGraph: {
    title: "دليل الاستعداد للاختبارات المهنية في اليمن",
    description: "إرشادات عملية لتنظيم الاستعداد للاختبار المهني وقياس التقدم.",
    url: "/guide/preparing-for-professional-exams",
    type: "article",
    locale: SITE.locale,
  },
};

const steps = [
  {
    title: "تحقق من متطلبات الاختبار من مصدرها الرسمي",
    body: "ابدأ بتحديد اسم الاختبار والجهة المنظمة والفئة التي يستهدفها. راجع أحدث التعليمات المنشورة من الجهة المختصة، بما في ذلك شروط التقديم والوثائق والرسوم والمواعيد ونطاق الموضوعات. قد تتغير هذه التفاصيل، لذلك لا تعتمد على منشور قديم أو تجربة شخص آخر وحدها.",
  },
  {
    title: "حوّل الموضوعات إلى خطة مراجعة",
    body: "اكتب قائمة بالموضوعات المطلوبة، ثم قسّمها إلى جلسات قصيرة وفق الوقت المتاح لك. ابدأ بالموضوعات التي تجدها أصعب، واترك وقتاً للمراجعة المتكررة بدلاً من تأجيلها إلى اليوم الأخير.",
  },
  {
    title: "استخدم الأسئلة التدريبية لقياس الفهم",
    body: "حل مجموعة من الأسئلة دون الرجوع إلى الإجابات أولاً. بعد ذلك راجع سبب صحة الإجابة وسبب عدم ملاءمة الخيارات الأخرى. الهدف ليس حفظ ترتيب الخيارات، بل فهم الفكرة والقدرة على تطبيقها في سؤال بصياغة مختلفة.",
  },
  {
    title: "سجّل أخطاءك وراجعها",
    body: "أنشئ قائمة بالأخطاء المتكررة، وصنّفها بحسب الموضوع أو سبب الخطأ: نقص معرفة، أو سوء فهم للسؤال، أو تسرّع. أعد مراجعة هذه القائمة بعد فترة، ثم اختبر نفسك بأسئلة أخرى للتأكد من تحسن الفهم.",
  },
  {
    title: "تدرّب على إدارة الوقت",
    body: "بعد أن تفهم المادة الأساسية، جرّب نموذجاً تدريبياً بوقت محدد إذا كان الاختبار الفعلي يعتمد على الوقت. تدرب على توزيع الوقت وترك السؤال الصعب مؤقتاً ثم العودة إليه، ولا تعتبر مدة النموذج التدريبي دليلاً على مدة الاختبار الرسمي ما لم تؤكدها الجهة المنظمة.",
  },
  {
    title: "استعد ليوم الاختبار عملياً",
    body: "تحقق مسبقاً من مكان الاختبار وموعده ومتطلبات الحضور والوثائق المسموح بها. احصل على هذه المعلومات من الجهة المنظمة مباشرة، ونظّم وقتك ونومك قبل الموعد لتصل مستعداً وهادئاً.",
  },
];

export default function PreparationGuidePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "دليل الاستعداد للاختبارات المهنية في اليمن",
    description: "خطوات عملية لتنظيم المذاكرة والاستفادة من النماذج التدريبية.",
    inLanguage: "ar",
    mainEntityOfPage: `${SITE.url}/guide/preparing-for-professional-exams`,
    publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
  };

  return (
    <article className="mx-auto max-w-4xl space-y-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <nav aria-label="مسار التنقل" className="text-sm text-[color:var(--color-mute)]">
        <Link href="/" className="font-bold hover:text-[color:var(--color-pri)]">الرئيسية</Link>
        <span className="mx-2" aria-hidden="true">/</span>
        <span>دليل الاستعداد</span>
      </nav>
      <header className="rounded-[2rem] bg-[color:var(--color-bg-dark)] px-6 py-10 text-white sm:px-10 sm:py-14">
        <p className="text-sm font-bold text-[#B9D6A9]">دليل تعليمي</p>
        <h1 className="mt-3 text-3xl font-black leading-relaxed sm:text-4xl">دليل الاستعداد للاختبارات المهنية في اليمن</h1>
        <p className="mt-4 max-w-3xl text-sm leading-8 text-white/80 sm:text-base">خطة عملية تساعدك على تنظيم المراجعة، واستخدام النماذج التدريبية بفاعلية، والاستعداد ليوم الاختبار بالاعتماد على المعلومات الرسمية.</p>
      </header>
      <div className="rounded-2xl border border-[color:var(--color-line)] bg-[#F7F8F5] p-5 text-sm leading-8 text-[color:var(--color-text-light)]">
        <strong className="text-[color:var(--color-hd)]">تنبيه مهم:</strong> تختلف شروط الاختبارات ومحتوياتها ومواعيدها بحسب المهنة والجهة المنظمة. هذا الدليل إرشادي عام، ولا يقدم معلومات رسمية عن اختبار بعينه. تحقّق دائماً من أحدث التعليمات لدى الجهة المختصة في اليمن.
      </div>
      <div className="space-y-7">
        {steps.map((step, index) => (
          <section key={step.title} className="flex gap-4 border-b border-[color:var(--color-line)] pb-7 last:border-0">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF3ED] text-sm font-black text-[color:var(--color-pri)]">{index + 1}</span>
            <div>
              <h2 className="text-xl font-extrabold text-[color:var(--color-hd)]">{step.title}</h2>
              <p className="mt-2 text-sm leading-8 text-[color:var(--color-text-light)]">{step.body}</p>
            </div>
          </section>
        ))}
      </div>
      <section className="rounded-2xl border border-[color:var(--color-line)] bg-white p-6">
        <h2 className="text-xl font-extrabold">ابدأ بالتدريب</h2>
        <p className="mt-2 text-sm leading-7 text-[color:var(--color-text-light)]">تصفح النماذج المنشورة، واختر المهنة المناسبة لك، واستخدم النتيجة لتحديد ما تحتاج إلى مراجعته.</p>
        <Link href="/#exams" className="btn-primary mt-4 inline-flex min-h-12 items-center justify-center rounded-xl px-5 text-sm font-extrabold">استعرض الاختبارات المتاحة</Link>
      </section>
    </article>
  );
}
