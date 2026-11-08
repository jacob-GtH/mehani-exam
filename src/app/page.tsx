import Link from "next/link";
import { getExams } from "@/lib/data";
import { SITE } from "@/lib/site";

export const revalidate = 60;

export default async function Home() {
  const exams = await getExams();
  const ld = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: SITE.name,
    itemListElement: exams.map((e, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE.url}/exam/${e.slug}`,
      name: e.title,
    })),
  };

  return (
    <div className="space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }}
      />

      {/* Hero Section */}
      <section className="text-center relative py-6 md:py-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[color:var(--color-bg-dark)]/[0.8] border border-[color:var(--color-pri)]/[0.3] text-[color:var(--color-gold)] text-xs md:text-sm font-semibold mb-6">
          <span className="w-2 h-2 rounded-full bg-[color:var(--color-line)]/[1] animate-ping" />
          <span>تحديثات مستمرة لأسئلة الاختبارات المهنية</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[color:var(--color-text)] max-w-3xl mx-auto leading-tight">
          تدرّب على <span 
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: 'linear-gradient(to left, var(--color-pri2), var(--color-pri-hover), var(--color-pri))' }}
          >
            اختبارات الاعتماد المهني
          </span>
        </h1>

        <p className="mt-4 text-base md:text-lg text-[color:var(--color-mute)] max-w-2xl mx-auto leading-relaxed">
          حاكي بيئة الاختبار الفعلي، واكتشف نقاط قوتك وضعفك مع تصحيح فوري وشروحات وافية لكل سؤال لضمان اجتيازك من أول محاولة.
        </p>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-xl mx-auto text-xs md:text-sm font-medium">
          <Link
          href="https://wa.me/777829664"
           className="p-3 rounded-xl glass-card flex items-center justify-center gap-2 text-[color:var(--color-text-light)]">
            <span>⏱️</span> محاكاة بوقت
          </Link>
          <div className="p-3 rounded-xl glass-card flex items-center justify-center gap-2 text-[color:var(--color-text-light)]">
            <span>💡</span> شروحات تفصيلية
          </div>
          <div className="p-3 rounded-xl glass-card col-span-2 sm:col-span-1 flex items-center justify-center gap-2 text-[color:var(--color-text-light)]">
            <span>🔄</span> إعادة غير محدودة
          </div>
        </div>
      </section>

      {/* Exams Grid Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-[color:var(--color-line)]/[0.4] pb-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[color:var(--color-hd)] flex items-center gap-2">
              <span>📋</span> الاختبارات المهنية المتاحة
            </h2>
            <p className="text-xs md:text-sm text-[color:var(--color-mute)] mt-1">اختر مهنتك وابدأ التدريب فوراً مجاناً</p>
          </div>
          <span className="text-xs px-3 py-1 rounded-lg bg-[color:var(--color-bg-dark)]/[0.6] border border-[color:var(--color-line)]/[0.4] text-[color:var(--color-hd)] font-semibold">
            {exams.length} مهنة متاحة
          </span>
        </div>

        {exams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {exams.map((e) => (
              <Link
                key={e._id}
                href={`/exam/${e.slug}`}
                className="group relative flex flex-col justify-between rounded-2xl glass-card p-6"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-lg md:text-xl font-bold text-[color:var(--color-text)] group-hover:text-[color:var(--color-hd)] transition-colors">
                      {e.title}
                    </h3>
                    <span className="flex-shrink-0 text-xs px-2.5 py-1 rounded-md bg-[color:var(--color-bg-dark)] text-[color:var(--color-line)]/[0.6] border border-[color:var(--color-line)]/[0.6] font-semibold">
                      {e.passMark}% النجاح
                    </span>
                  </div>

                  <p className="text-sm text-[color:var(--color-mute)] line-clamp-2 leading-relaxed mb-5">
                    {e.description || "اختبار تجريبي شامل لتقييم المهارات المهنية والالتزام بالمعايير الفنية المطلوبة."}
                  </p>
                </div>

                <div className="pt-4 border-t border-[color:var(--color-line)]/[0.4] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-[color:var(--color-mute)] font-medium">
                    <span className="text-[color:var(--color-pri-hover)]">📝 {e.count} سؤال</span>
                    <span>•</span>
                    <span className="text-[color:var(--color-pri-hover)]">مجاني بالكامل</span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[color:var(--color-hd)] group-hover:translate-x-[-4px] transition-transform">
                    ابدأ الآن <span>←</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 rounded-2xl glass-panel border border-dashed border-[color:var(--color-line)]">
            <span className="text-4xl">🔍</span>
            <p className="mt-3 text-[color:var(--color-mute)] font-medium">لا توجد اختبارات منشورة حالياً، سيتم إضافة مهن جديدة قريباً.</p>
          </div>
        )}
      </section>

      {/* Why Practice Section */}
      <section className="rounded-3xl glass-panel p-6 sm:p-8 border border-[color:var(--color-line)]/[0.3]">
        <h3 className="text-xl font-bold text-[color:var(--color-hd)] mb-6 text-center">لماذا يجب عليك التدرب هنا قبل الاختبار الفعلي؟</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="space-y-2">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[color:var(--color-bg-dark)]/[0.4] border border-[color:var(--color-line)]/[0.3] flex items-center justify-center text-xl">
              🎯
            </div>
            <h4 className="font-bold text-[color:var(--color-text)] text-base">كسر حاجز الرهبة</h4>
            <p className="text-xs text-[color:var(--color-mute)] leading-relaxed">
              التعود على طريقة صياغة الأسئلة ونمط الخيارات من متعدد لتجنب التوتر أثناء الاختبار الحقيقي.
            </p>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[color:var(--color-bg-dark)]/[0.4] border border-[color:var(--color-line)]/[0.3] flex items-center justify-center text-xl">
              📊
            </div>
            <h4 className="font-bold text-[color:var(--color-text)] text-base">معرفة الأخطاء فوراً</h4>
            <p className="text-xs text-[color:var(--color-mute)] leading-relaxed">
              التصحيح المباشر مع توضيح سبب الإجابة الصحيحة يعزز الفهم العملي للمفاهيم الأساسية.
            </p>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[color:var(--color-bg-dark)]/[0.4] border border-[color:var(--color-line)]/[0.3] flex items-center justify-center text-xl">
              ⚡
            </div>
            <h4 className="font-bold text-[color:var(--color-text)] text-base">إدارة وقت الاختبار</h4>
            <p className="text-xs text-[color:var(--color-mute)] leading-relaxed">
              تنمية مهارة الإجابة بسرعة ودقة تحت ضغط المؤقت الزمني المحدد لكل سؤال.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

