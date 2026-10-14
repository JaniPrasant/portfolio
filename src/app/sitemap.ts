import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      lastModified: new Date(`${site.lastUpdated}T00:00:00Z`),
      changeFrequency: "monthly",
      priority: 1,
      images: [`${site.url}/img/portrait.webp`],
    },
  ];
}
