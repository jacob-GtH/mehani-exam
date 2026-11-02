import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteExam, deleteQuestion, updateExam } from "@/app/admin/actions";
import ConfirmButton from "@/components/admin/ConfirmButton";
import QuestionForm from "@/components/admin/QuestionForm";
import { writer } from "@/lib/sanity";
import type { Q } from "@/lib/data";

export const dynamic = "force-dynamic";
const inp = "w-full rounded-lg border border-line bg-card2 px-3 py-2";

export default async function EditExam({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ edit?: string }> }) {
  const { id } = await params;
  const { edit } = await searchParams;
  const exam = await writer.fetch<{ _id: string; title: string; slug: string; description: string; passMark: number; published: boolean; questions?: Q[] } | null>(
    `*[_type=="exam" && _id==$id][0]{_id, title, "slug": slug.current, description, passMark, published, questions[]{_key,text,options,correct,explanation}}`, { id });
  if (!exam) notFound();
  const cur = exam.questions?.find((q) => q._key === edit);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-hd">{exam.title}</h1>
        {exam.published && <Link href={`/exam/${exam.slug}`} className="text-mute underline">عرض الصفحة</Link>}
      </div>

      <form action={updateExam} className="space-y-3 rounded-2xl border-2 border-line bg-card p-5">
        <h2 className="text-lg font-bold text-hd">إعدادات الاختبار</h2>
        <input type="hidden" name="id" value={exam._id} />
        <input name="title" defaultValue={exam.title} required className={inp} />
        <input name="slug" defaultValue={exam.slug} dir="ltr" className={inp} aria-label="الرابط" />
        <textarea name="description" defaultValue={exam.description} rows={2} className={inp} />
        <label className="block text-sm text-mute">حد النجاح %<input name="passMark" type="number" min={1} max={100} defaultValue={exam.passMark} className={inp} /></label>
        <label className="flex items-center gap-2"><input type="checkbox" name="published" defaultChecked={exam.published} className="h-5 w-5 accent-green-500" /> منشور (يظهر للزوار)</label>
        <button className="w-full rounded-xl bg-pri py-2 font-bold">حفظ الإعدادات</button>
      </form>

      <QuestionForm key={cur?._key ?? "new"} examId={exam._id} initial={cur ? { key: cur._key, text: cur.text, options: cur.options, correct: cur.correct, explanation: cur.explanation } : undefined} />

      <div className="rounded-2xl border-2 border-line bg-card p-5">
        <h2 className="mb-2 text-lg font-bold text-hd">الأسئلة ({exam.questions?.length ?? 0})</h2>
        {exam.questions?.map((q, i) => (
          <div key={q._key} className="flex items-center gap-2 border-b border-line py-2">
            <span className="flex-1">{i + 1}. {q.text}</span>
            <Link href={`/admin/exams/${exam._id}?edit=${q._key}`} className="rounded-lg border border-line px-3 py-1">تعديل</Link>
            <form action={deleteQuestion}>
              <input type="hidden" name="id" value={exam._id} /><input type="hidden" name="key" value={q._key} />
              <ConfirmButton msg="حذف هذا السؤال؟" className="rounded-lg border border-bad px-3 py-1 text-bad">حذف</ConfirmButton>
            </form>
          </div>
        ))}
        {!exam.questions?.length && <p className="text-mute">لا توجد أسئلة بعد.</p>}
      </div>

      <form action={deleteExam} className="text-center">
        <input type="hidden" name="id" value={exam._id} />
        <ConfirmButton msg="حذف الاختبار نهائيًا مع كل أسئلته وإحصاءاته؟" className="rounded-lg border border-bad px-4 py-2 text-bad">حذف الاختبار</ConfirmButton>
      </form>
    </div>
  );
}
