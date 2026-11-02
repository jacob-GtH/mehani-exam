import { reader } from "./sanity";

export type Q = { _key: string; text: string; options: string[]; correct: number; explanation?: string };
export type Exam = {
  _id: string; title: string; slug: string; description: string; passMark: number;
  count: number; _updatedAt: string; questions?: Q[]; sample?: string[];
};

const card = `_id, title, "slug": slug.current, description, passMark, "count": count(questions), _updatedAt`;
const opt = { next: { revalidate: 60 } };

export const getExams = () =>
  reader.fetch<Exam[]>(`*[_type=="exam" && published==true] | order(title asc){${card}}`, {}, opt);

// صفحة SEO: بدون الإجابات الصحيحة
export const getExamLanding = (slug: string) =>
  reader.fetch<Exam | null>(
    `*[_type=="exam" && slug.current==$slug && published==true][0]{${card}, "sample": questions[0...3].text}`,
    { slug }, opt);

// صفحة الاختبار: كاملة
export const getExamFull = (slug: string) =>
  reader.fetch<Exam | null>(
    `*[_type=="exam" && slug.current==$slug && published==true][0]{${card}, questions[]{_key,text,options,correct,explanation}}`,
    { slug }, opt);
