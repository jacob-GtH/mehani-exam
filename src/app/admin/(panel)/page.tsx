import Link from "next/link";
import { createExam } from "@/app/admin/actions";
import { writer } from "@/lib/sanity";

export const dynamic = "force-dynamic";

export default async function Admin() {
  const exams = await writer.fetch<{ _id: string; title: string; slug: string; published: boolean; count: number }[]>(
    `*[_type=="exam"] | order(title asc){_id, title, "slug": slug.current, published, "count": count(questions)}`);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-hd">إدارة الاختبارات المهنية</h1>
      <p className="text-mute text-sm">يمكنك إضافة اختبارات جديدة، تعديل الموجودة، أو حذفها.</p>
      
      {/* Exams List */}
      <div className="space-y-3 rounded-2xl glass-panel p-5 border border-emerald-800/40">
        <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <span>📋</span> الاختبارات الموجودة ({exams.length})
        </h2>
        {exams.length > 0 ? (
          <div className="space-y-2">
            {exams.map((e) => (
              <Link
                key={e._id}
                href={`/admin/exams/${e._id}`}
                className="flex items-center justify-between rounded-xl glass-card p-4 hover:border-hd transition-all"
              >
                <span className="font-bold text-white">{e.title}</span>
                <span className="text-sm text-mute flex items-center gap-2">
                  <span>{e.count} سؤال</span>
                  <span className="h-1 w-1 rounded-full bg-line" />
                  <span className={e.published ? "text-emerald-400" : "text-amber-400"}>
                    {e.published ? "منشور" : "مسودة"}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-mute bg-card2/30 rounded-xl border border-dashed border-emerald-900/50">
            <p>لا توجد اختبارات بعد. ابدأ بإنشاء واحد!</p>
          </div>
        )}
      </div>

      {/* New Exam Form */}
      <form action={createExam} className="space-y-4 rounded-2xl glass-panel p-6 border border-emerald-800/40 shadow-xl">
        <h2 className="text-xl font-bold text-hd mb-2 flex items-center gap-2">
          <span>✨</span> إنشاء اختبار جديد
        </h2>
        <input
          name="title"
          required
          placeholder="اسم الاختبار (مثال: عامل مخزن)"
          className="w-full rounded-xl border border-emerald-900/60 bg-card2 px-4 py-2.5 text-white placeholder-mute focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-colors"
        />
        <input
          name="slug"
          dir="ltr"
          placeholder="الرابط بالإنجليزية (اختياري، مثال: warehouse-worker)"
          className="w-full rounded-xl border border-emerald-900/60 bg-card2 px-4 py-2.5 text-white placeholder-mute focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-colors"
        />
        <button className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-3.5 px-6 font-bold text-lg shadow-lg shadow-emerald-950/50 transition-all hover:scale-[1.005] active:scale-[0.99]">
          إنشاء الاختبار
        </button>
      </form>
    </div>
  );
}
