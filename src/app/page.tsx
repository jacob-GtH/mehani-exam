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
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs md:text-sm font-semibold mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>تحديثات مستمرة لأسئلة الاختبارات المهنية</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white max-w-3xl mx-auto leading-tight">
          تدرّب على <span className="bg-gradient-to-l from-teal-300 via-emerald-400 to-green-300 bg-clip-text text-transparent">اختبارات الاعتماد المهني</span>
        </h1>

        <p className="mt-4 text-base md:text-lg text-mute max-w-2xl mx-auto leading-relaxed">
          حاكي بيئة الاختبار الفعلي، واكتشف نقاط قوتك وضعفك مع تصحيح فوري وشروحات وافية لكل سؤال لضمان اجتيازك من أول محاولة.
        </p>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-xl mx-auto text-xs md:text-sm font-medium">
          <div className="p-3 rounded-xl glass-card flex items-center justify-center gap-2 text-emerald-200">
            <span>⏱️</span> محاكاة بوقت
          </div>
          <div className="p-3 rounded-xl glass-card flex items-center justify-center gap-2 text-emerald-200">
            <span>💡</span> شروحات تفصيلية
          </div>
          <div className="p-3 rounded-xl glass-card col-span-2 sm:col-span-1 flex items-center justify-center gap-2 text-emerald-200">
            <span>🔄</span> إعادة غير محدودة
          </div>
        </div>
      </section>

      {/* Exams Grid Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-emerald-900/40 pb-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-hd flex items-center gap-2">
              <span>📋</span> الاختبارات المهنية المتاحة
            </h2>
            <p className="text-xs md:text-sm text-mute mt-1">اختر مهنتك وابدأ التدريب فوراً مجاناً</p>
          </div>
          <span className="text-xs px-3 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 font-semibold">
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
                    <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-hd transition-colors">
                      {e.title}
                    </h3>
                    <span className="flex-shrink-0 text-xs px-2.5 py-1 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-semibold">
                      {e.passMark}% النجاح
                    </span>
                  </div>

                  <p className="text-sm text-mute line-clamp-2 leading-relaxed mb-5">
                    {e.description || "اختبار تجريبي شامل لتقييم المهارات المهنية والالتزام بالمعايير الفنية المطلوبة."}
                  </p>
                </div>

                <div className="pt-4 border-t border-emerald-900/40 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-mute font-medium">
                    <span className="text-emerald-400">📝 {e.count} سؤال</span>
                    <span>•</span>
                    <span className="text-emerald-400">مجاني بالكامل</span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-300 group-hover:translate-x-[-4px] transition-transform">
                    ابدأ الآن <span>←</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 rounded-2xl glass-panel border border-dashed border-emerald-900">
            <span className="text-4xl">🔍</span>
            <p className="mt-3 text-mute font-medium">لا توجد اختبارات منشورة حالياً، سيتم إضافة مهن جديدة قريباً.</p>
          </div>
        )}
      </section>
    </div>
  );
}

