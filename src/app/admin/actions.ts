"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writer } from "@/lib/sanity";
import { parseQuestions } from "@/lib/parse";
import { clearSession, passwordOk, requireAdmin, setSession } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";

const refresh = () => revalidatePath("/", "layout");
const keyOk = (k: string) => /^[A-Za-z0-9_-]{1,64}$/.test(k);
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const rnd = () => Math.random().toString(36).slice(2, 8);

export async function login(_: string | null, fd: FormData): Promise<string | null> {
  const requestHeaders = await headers();
  const ip = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || requestHeaders.get("x-real-ip") || "unknown";
  const rate = checkRateLimit(`admin-login:${ip}`, 5, 15 * 60_000);
  if (!rate.allowed) return "تم تجاوز عدد محاولات الدخول. حاول بعد 15 دقيقة.";
  const password = String(fd.get("password") || "");
  if (password.length > 256 || !passwordOk(password)) return "كلمة المرور غير صحيحة";
  await setSession();
  redirect("/admin");
}
export async function logout() { await clearSession(); redirect("/admin/login"); }

async function uniqueSlug(base: string, exceptId?: string) {
  let s = slugify(base) || `exam-${rnd()}`;
  const hit = await writer.fetch(`*[_type=="exam" && slug.current==$s && _id!=$id][0]._id`, { s, id: exceptId || "" });
  return hit ? `${s}-${rnd()}` : s;
}

export async function createExam(fd: FormData) {
  await requireAdmin();
  const title = String(fd.get("title") || "").trim();
  if (!title) return;
  const slug = await uniqueSlug(String(fd.get("slug") || ""));
  const doc = await writer.create({ _type: "exam", title, slug: { _type: "slug", current: slug }, description: `اختبار الاعتماد المهني - ${title}`, passMark: 70, published: false, questions: [] });
  refresh();
  redirect(`/admin/exams/${doc._id}`);
}

export async function updateExam(fd: FormData) {
  await requireAdmin();
  const id = String(fd.get("id"));
  const pass = Math.min(100, Math.max(1, Number(fd.get("passMark")) || 70));
  const slug = await uniqueSlug(String(fd.get("slug") || ""), id);
  await writer.patch(id).set({ title: String(fd.get("title") || "").trim(), description: String(fd.get("description") || "").trim(), passMark: pass, published: fd.get("published") === "on", slug: { _type: "slug", current: slug } }).commit();
  refresh();
  redirect(`/admin/exams/${id}`);
}

export async function deleteExam(fd: FormData) {
  await requireAdmin();
  const id = String(fd.get("id"));
  const slug = await writer.fetch<string | null>(`*[_id==$id][0].slug.current`, { id });
  if (slug) await writer.delete({ query: `*[_type=="attempt" && slug==$slug]`, params: { slug } });
  await writer.delete(id);
  refresh();
  redirect("/admin");
}

export async function saveQuestion(fd: FormData) {
  await requireAdmin();
  const id = String(fd.get("id"));
  const p = JSON.parse(String(fd.get("payload") || "{}"));
  const text = String(p.text || "").trim();
  const raw: string[] = Array.isArray(p.options) ? p.options.map((o: unknown) => String(o).trim()) : [];
  const idx = raw.map((o, i) => (o ? i : -1)).filter((i) => i >= 0);
  const correct = idx.indexOf(Number(p.correct));
  if (!text || idx.length < 2 || correct < 0) return;
  const q: Record<string, unknown> = { text, options: idx.map((i) => raw[i]), correct };
  const exp = String(p.explanation || "").trim();
  if (exp) q.explanation = exp;
  if (p.key && keyOk(String(p.key))) {
    await writer.patch(id).set({ [`questions[_key=="${p.key}"]`]: { _key: p.key, ...q } }).commit();
  } else {
    await writer.patch(id).setIfMissing({ questions: [] }).append("questions", [{ _key: rnd() + rnd(), ...q }]).commit();
  }
  refresh();
  redirect(`/admin/exams/${id}`);
}

export async function deleteQuestion(fd: FormData) {
  await requireAdmin();
  const id = String(fd.get("id")), key = String(fd.get("key"));
  if (!keyOk(key)) return;
  await writer.patch(id).unset([`questions[_key=="${key}"]`]).commit();
  refresh();
  redirect(`/admin/exams/${id}`);
}

export async function importQuestions(fd: FormData) {
  await requireAdmin();
  const raw = String(fd.get("text") || "").slice(0, 500_000);
  const examId = String(fd.get("examId") || "");
  const publishNew = fd.get("publish") === "on";
  const norm = (s: string) => s.replace(/\s+/g, " ").trim();
  type D = { _id: string; texts?: string[] } | null;
  let added = 0, skipped = 0, created = 0, bad = 0, noTarget = 0;

  for (const g of parseQuestions(raw)) {
    bad += g.errors.length;
    let doc: D = g.exam
      ? await writer.fetch<D>(`*[_type=="exam" && title==$t][0]{_id, "texts": questions[].text}`, { t: g.exam })
      : examId ? await writer.fetch<D>(`*[_type=="exam" && _id==$id][0]{_id, "texts": questions[].text}`, { id: examId }) : null;
    if (!doc) {
      if (!g.exam) { noTarget += g.questions.length; continue; }
      const slug = await uniqueSlug(g.slug || g.exam);
      const c = await writer.create({ _type: "exam", title: g.exam, slug: { _type: "slug", current: slug }, description: `اختبار الاعتماد المهني - ${g.exam}`, passMark: 70, published: publishNew, questions: [] });
      doc = { _id: c._id, texts: [] };
      created++;
    }
    const seen = new Set((doc.texts || []).map(norm));
    const fresh: Record<string, unknown>[] = [];
    for (const q of g.questions) {
      const k = norm(q.text);
      if (seen.has(k)) { skipped++; continue; }
      seen.add(k);
      fresh.push({ _key: rnd() + rnd() + fresh.length, ...q });
    }
    if (fresh.length) {
      await writer.patch(doc._id).setIfMissing({ questions: [] }).append("questions", fresh).commit();
      added += fresh.length;
    }
  }
  refresh();
  redirect(`/admin/import?added=${added}&skipped=${skipped}&created=${created}&bad=${bad}&nt=${noTarget}`);
}
