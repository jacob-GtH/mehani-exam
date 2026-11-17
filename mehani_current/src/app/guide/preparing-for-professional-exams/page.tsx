import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "الفحص المهني والاعتماد المهني في السعودية | دليل للمتقدمين من اليمن",
  description: "دليل للمتقدمين من اليمن يشرح الفحص المهني السعودي والتحقق المهني والفرق بينهما، وكيفية التحقق من متطلبات المهنة من المصادر الرسمية والاستعداد بنماذج تدريبية.",
  alternates: { canonical: "/guide/preparing-for-professional-exams" },
  openGraph: { title: "دليل الفحص المهني والاعتماد المهني في السعودية", description: "افهم الفرق بين الفحص المهني والتحقق المهني ضمن برنامج الاعتماد المهني السعودي، واستعد من اليمن بمعلومات موثوقة.", url: "/guide/preparing-for-professional-exams", type: "article", locale: SITE.locale },
};

const ministryExam = "https://www.hrsd.gov.sa/knowledge-centre/decisions-and-regulations/regulation-and-procedures/الدليل-الاجرائي-لبرامج-الفحص-المهني";
const ministryVerification = "https://www.hrsd.gov.sa/care-about-you/skillsandtrain";

export default function PreparationGuidePage() {
  const jsonLd = {
    "@context": "https://schema.org", "@type": "Article",
    headline: "دليل الفحص المهني والاعتماد المهني في السعودية للمتقدمين من اليمن",
    description: "شرح عام للفحص المهني والتحقق المهني وكيفية الاستعداد لهما.",
    inLanguage: "ar", mainEntityOfPage: `${SITE.url}/guide/preparing-for-professional-exams`,
    publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
  };
  return (
    <article className="mx-auto max-w-4xl space-y-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <nav aria-label="مسار التنقل" className="text-sm text-[color:var(--color-mute)]"><Link href="/" className="font-bold hover:text-[color:var(--color-pri)]">الرئيسية</Link><span className="mx-2" aria-hidden="true">/</span><span>دليل الفحص المهني</span></nav>
      <header className="rounded-[2rem] bg-[color:var(--color-bg-dark)] px-6 py-10 text-white sm:px-10 sm:py-14">
        <p className="text-sm font-bold text-[#B9D6A9]">دليل للمتقدمين من اليمن</p>
        <h1 className="mt-3 text-3xl font-black leading-relaxed sm:text-4xl">الفحص المهني والاعتماد المهني في السعودية</h1>
        <p className="mt-4 max-w-3xl text-sm leading-8 text-white/80 sm:text-base">إذا كنت تستعد للعمل في المملكة العربية السعودية، فمن المهم أن تعرف أي متطلب ينطبق على مهنتك: الفحص المهني أم التحقق المهني. يشرح هذا الدليل الفرق بصورة مبسطة، ويوجهك إلى المصادر الرسمية، ثم يساعدك على الاستعداد المعرفي من خلال التدريب.</p>
      </header>
      <div className="rounded-2xl border border-[color:var(--color-line)] bg-[#F7F8F5] p-5 text-sm leading-8 text-[color:var(--color-text-light)]"><strong className="text-[color:var(--color-hd)]">تنبيه أساسي:</strong> هذه منصة تدريبية مستقلة وليست تابعة لوزارة الموارد البشرية والتنمية الاجتماعية، ولا تصدر شهادات أو نتائج رسمية. لا يعني وجود نموذج تدريبي لمهنة ما أن الفحص مطلوب حتماً لكل من يعمل بها أو لكل متقدم من اليمن. تحقق من المهنة والدولة والمسار والمتطلبات السارية من القنوات الرسمية قبل الحجز أو دفع أي رسوم.</div>
      <section className="space-y-3">
        <h2 className="text-2xl font-black text-[color:var(--color-hd)]">ما هو برنامج الاعتماد المهني السعودي؟</h2>
        <p className="text-sm leading-8 text-[color:var(--color-text-light)]">توضح وزارة الموارد البشرية والتنمية الاجتماعية أن منظومة الاعتماد المهني تتضمن خدمات للتحقق من كفاءة العمالة الوافدة وملاءمة مهاراتها ومؤهلاتها لمتطلبات سوق العمل السعودي. ومن أبرز المسارات التي تشرحها الوزارة: الفحص المهني والتحقق المهني. لذلك من المهم عدم استخدام الاسمين على أنهما اختبار واحد؛ فلكل خدمة نطاق وآلية مختلفة.</p>
      </section>
      <section className="rounded-2xl border border-[color:var(--color-line)] bg-white p-6 space-y-3">
        <h2 className="text-2xl font-black text-[color:var(--color-hd)]">أولاً: الفحص المهني في السعودية</h2>
        <p className="text-sm leading-8 text-[color:var(--color-text-light)]">بحسب وصف الوزارة، يهدف الفحص المهني إلى تقييم امتلاك العامل المهني المهارات اللازمة لأداء المهنة، ويشمل تقييماً نظرياً وعملياً في مجال التخصص. ويستهدف البرنامج مهنًا محددة، ولا يصح افتراض أن جميع المهن أو جميع الجنسيات تخضع للإجراء نفسه.</p>
        <p className="text-sm leading-8 text-[color:var(--color-text-light)]">إذا كنت في اليمن، فتحقق أولاً من أن مهنتك مشمولة وأن مسار الفحص متاح لحالتك وبلدك، ثم راجع تعليمات التسجيل والمراكز والمواعيد من المصدر الرسمي.</p>
        <a className="inline-flex text-sm font-extrabold text-[color:var(--color-pri)] hover:underline" href={ministryExam} target="_blank" rel="noopener noreferrer">الدليل الإجرائي لبرامج الفحص المهني – وزارة الموارد البشرية ←</a>
      </section>
      <section className="rounded-2xl border border-[color:var(--color-line)] bg-white p-6 space-y-3">
        <h2 className="text-2xl font-black text-[color:var(--color-hd)]">ثانياً: التحقق المهني ضمن الاعتماد المهني</h2>
        <p className="text-sm leading-8 text-[color:var(--color-text-light)]">توضح الوزارة أن خدمة التحقق المهني تركز على التحقق من المؤهلات والخبرات ومواءمتها مع متطلبات المهنة في السوق السعودي، وتستهدف فئات من العمالة الوافدة ذات المهارات العالية وفق التصنيف المعتمد. وقد تختلف متطلبات هذا المسار عن الاختبارات العملية والنظرية للفحص المهني.</p>
        <a className="inline-flex text-sm font-extrabold text-[color:var(--color-pri)] hover:underline" href={ministryVerification} target="_blank" rel="noopener noreferrer">المهارات والتدريب والتحقق المهني – وزارة الموارد البشرية ←</a>
      </section>
      <section className="space-y-4">
        <h2 className="text-2xl font-black text-[color:var(--color-hd)]">ما الفرق بين الفحص المهني والتحقق المهني؟</h2>
        <div className="overflow-x-auto rounded-2xl border border-[color:var(--color-line)] bg-white"><table className="w-full min-w-[520px] text-right text-sm"><thead className="bg-[#F1F5F1]"><tr><th className="p-4">وجه المقارنة</th><th className="p-4">الفحص المهني</th><th className="p-4">التحقق المهني</th></tr></thead><tbody className="divide-y divide-[color:var(--color-line)]"><tr><th className="p-4">التركيز</th><td className="p-4">تقييم المهارات المهنية</td><td className="p-4">التحقق من المؤهلات والخبرات ومواءمتها</td></tr><tr><th className="p-4">الآلية العامة</th><td className="p-4">اختبارات نظرية وعملية</td><td className="p-4">التحقق من الشهادات والخبرات والبيانات</td></tr><tr><th className="p-4">النطاق</th><td className="p-4">مهن مستهدفة وفق البرنامج</td><td className="p-4">مهن وفئات وفق التصنيف والاشتراطات</td></tr></tbody></table></div>
        <p className="text-xs leading-7 text-[color:var(--color-mute)]">هذا تلخيص توعوي عام لمعلومات الوزارة، وليس تحديداً لأهلية مهنة أو حالة فردية. المرجع النهائي هو التعليمات الرسمية المحدثة.</p>
      </section>
      <section className="space-y-4">
        <h2 className="text-2xl font-black text-[color:var(--color-hd)]">كيف تستعد من اليمن؟</h2>
        <ol className="list-decimal space-y-3 pr-6 text-sm leading-8 text-[color:var(--color-text-light)]"><li>اكتب المسمى المهني الدقيق كما يظهر في مستنداتك أو إجراءات التوظيف.</li><li>تحقق من تصنيف المهنة وما إذا كان ينطبق عليها الفحص المهني أو التحقق المهني.</li><li>تأكد من أن الإجراء متاح للمتقدمين من اليمن، ولا تعتمد على معلومات قديمة أو تجارب غير موثقة.</li><li>راجع المهارات الأساسية المرتبطة بمهمات المهنة، واستخدم نماذج التدريب لقياس فهمك.</li><li>احتفظ بمعلومات الموعد والمركز والوثائق المطلوبة من القناة الرسمية أو جهة التوظيف المعنية.</li></ol>
      </section>
      <section className="rounded-2xl border border-[color:var(--color-line)] bg-[#F7F8F5] p-6 space-y-3">
        <h2 className="text-xl font-black text-[color:var(--color-hd)]">أسئلة شائعة</h2>
        <details className="border-b border-[color:var(--color-line)] py-3"><summary className="cursor-pointer font-bold">هل الاعتماد المهني هو نفسه الفحص المهني؟</summary><p className="mt-2 text-sm leading-7">الاعتماد المهني هو المظلة التي تندرج ضمنها خدمات، من بينها الفحص المهني والتحقق المهني. لذلك فالمصطلحات مترابطة لكنها ليست مترادفة تماماً.</p></details>
        <details className="border-b border-[color:var(--color-line)] py-3"><summary className="cursor-pointer font-bold">هل كل شخص من اليمن يحتاج إلى الفحص المهني؟</summary><p className="mt-2 text-sm leading-7">لا يمكن تعميم ذلك. الانطباق يعتمد على المهنة والمسار والدولة والقرارات السارية. تحقق من حالتك عبر الجهة الرسمية أو صاحب العمل.</p></details>
        <details className="py-3"><summary className="cursor-pointer font-bold">هل نماذج الموقع هي أسئلة الاختبار الرسمي؟</summary><p className="mt-2 text-sm leading-7">لا. هي أسئلة تدريبية مستقلة أُعدت للمراجعة ولا تمثل بنك الأسئلة الرسمي أو ضماناً للنجاح.</p></details>
      </section>
      <section className="rounded-2xl border border-[color:var(--color-line)] bg-white p-6"><h2 className="text-xl font-extrabold">ابدأ التدريب حسب مهنتك</h2><p className="mt-2 text-sm leading-7 text-[color:var(--color-text-light)]">اختر المهنة من النماذج المتاحة، واستخدم الأسئلة والشروحات لمراجعة المهارات والمعارف الأساسية.</p><Link href="/#exams" className="btn-primary mt-4 inline-flex min-h-12 items-center justify-center rounded-xl px-5 text-sm font-extrabold">استعرض الاختبارات التدريبية</Link></section>
    </article>
  );
}
