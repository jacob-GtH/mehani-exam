import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Quiz from "@/components/Quiz";
import { getExamLanding } from "@/lib/data";

type P = { params: Promise<{ slug: string }> };
export const metadata: Metadata = { robots: { index: false, follow: true } }; // صفحة التفاعل لا تُفهرس

export default async function Start({ params }: P) {
  const { slug } = await params;
  const exam = await getExamLanding(slug);
  if (!exam || !exam.count) notFound();
  return <Quiz exam={exam} />;
}
