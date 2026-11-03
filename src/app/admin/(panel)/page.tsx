import Link from "next/link";
import { createExam } from "@/app/admin/actions";
import { writer } from "@/lib/sanity";

export const dynamic = "force-dynamic";

export default async function Admin() {
  const exams = await writer.fetch<{ _id: string; title: string; slug: string; published: boolean; count: number }[]>(
    `*[_type=="exam"] | order(title asc){_id, title, "slug": slug.current, published, "count": count(questions)}`);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-[color:var(--color-hd)]">إدارة الاختبارات المهنية</h1>
      <p className="text-[color:var(--color-mute)] text-sm">يمكنك إضافة اختبارات جديدة، تعديل الموجودة، أو حذفها.</p>

      {/* Exams List */}
      <div className="space-y-3 rounded-2xl glass-panel p-5 border border-[color:var(--color-line)]/[0.4]">
        <h2 className="text-lg font-bold text-[color:var(--color-text)] mb-3 flex items-center gap-2">
          <span>📋</span> الاختبارات الموجودة ({exams.length})
        </h2>
        {exams.length > 0 ? (
          <div className="space-y-2">
            {exams.map((e) => (
              <Link
                key={e._id}
                href={`/admin/exams/${e._id}`}
                className="flex items-center justify-between rounded-xl glass-card p-4 hover:border-[color:var(--color-hd)] transition-all"
              >
                <span className="font-bold text-[color:var(--color-text)]">{e.title}</span>
                <span className="text-sm text-[color:var(--color-mute)] flex items-center gap-2">
                  <span>{e.count} سؤال</span>
                  <span className="h-1 w-1 rounded-full bg-[color:var(--color-line)]" />
                  <span className={e.published ? "text-[color:var(--color-ok)]" : "text-[color:var(--color-amber)]"}>
                    {e.published ? "منشور" : "مسودة"}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-[color:var(--color-mute)] bg-[color:var(--color-card2)]/[0.3] rounded-xl border border-dashed border-[color:var(--color-line)]/[0.5]">
            <p>لا توجد اختبارات بعد. ابدأ بإنشاء واحد!</p>
          </div>
        )}
      </div>

      {/* New Exam Form */}
      <form action={createExam} className="space-y-4 rounded-2xl glass-panel p-6 border border-[color:var(--color-line)]/[0.4] shadow-xl">
        <h2 className="text-xl font-bold text-[color:var(--color-hd)] mb-2 flex items-center gap-2">
          <span>✨</span> إنشاء اختبار جديد
        </h2>
        <input
          name="title"
          required
          placeholder="اسم الاختبار (مثال: عامل مخزن)"
          className="w-full rounded-xl border border-[color:var(--color-line)]/[0.6] bg-[color:var(--color-card2)] px-4 py-2.5 text-[color:var(--color-text)] placeholder-[color:var(--color-mute)] focus:ring-2 focus:ring-[color:var(--color-pri)] focus:border-transparent outline-none transition-colors"
        />
        <input
          name="slug"
          dir="ltr"
          placeholder="الرابط بالإنجليزية (اختياري، مثال: warehouse-worker)"
          className="w-full rounded-xl border border-[color:var(--color-line)]/[0.6] bg-[color:var(--color-card2)] px-4 py-2.5 text-[color:var(--color-text)] placeholder-[color:var(--color-mute)] focus:ring-2 focus:ring-[color:var(--color-pri)] focus:border-transparent outline-none transition-colors"
        />
        <button className="w-full rounded-xl bg-[color:var(--color-pri)] hover:bg-[color:var(--color-pri-hover)] text-[color:var(--color-bg)] py-3.5 px-6 font-bold text-lg shadow-lg shadow-[color:var(--color-pri)]/[0.3] transition-all hover:scale-[1.005] active:scale-[0.99]">
          إنشاء الاختبار
        </button>
      </form>
    </div>
  );
}
