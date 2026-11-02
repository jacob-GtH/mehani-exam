import type { MetadataRoute } from "next";
import { getExams } from "@/lib/data";
import { SITE } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const exams = await getExams();
  return [
    { url: SITE.url, changeFrequency: "weekly", priority: 1 },
    ...exams.map((e) => ({ url: `${SITE.url}/exam/${e.slug}`, lastModified: e._updatedAt, changeFrequency: "weekly" as const, priority: 0.8 })),
  ];
}
