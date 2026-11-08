import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/exam/", "/guide/"],
      disallow: ["/admin", "/api", "/exam/*/start"],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
