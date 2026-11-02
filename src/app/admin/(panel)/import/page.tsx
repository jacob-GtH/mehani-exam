import ImportForm from "@/components/admin/ImportForm";
import { writer } from "@/lib/sanity";

export const dynamic = "force-dynamic";

export default async function ImportPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const exams = await writer.fetch<{ _id: string; title: string }[]>(`*[_type=="exam"] | order(title asc){_id, title}`);
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-extrabold text-hd">استيراد اختبارات وأسئلة</h1>
      {sp.added !== undefined && (
        <div className="rounded-xl border-2 border-ok bg-card p-4">
          تمت إضافة <b>{sp.added}</b> سؤال، وإنشاء <b>{sp.created}</b> اختبار جديد. تُجوهل <b>{sp.skipped}</b> سؤال مكرر
          {Number(sp.bad) > 0 && <>، و<b className="text-bad">{sp.bad}</b> سؤال به خطأ لم يُستورد</>}
          {Number(sp.nt) > 0 && <>، و<b className="text-bad">{sp.nt}</b> سؤال بلا اختبار محدد</>}.
          الاختبارات الجديدة مسودة ما لم تنشرها من صفحة الاختبار.
        </div>
      )}
      <ImportForm exams={exams} />
    </div>
  );
}
