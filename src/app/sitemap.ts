import type { MetadataRoute } from "next";
import { Exam, getExams } from "@/lib/data";
import { SITE } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const exams = await getExams();
  return [
    { url: SITE.url, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/guide/preparing-for-professional-exams`, changeFrequency: "monthly", priority: 0.9 },
    ...exams.map((exam:Exam) => ({
      url: `${SITE.url}/exam/${exam.slug}`,
      lastModified: exam._updatedAt ? new Date(exam._updatedAt) : undefined,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
