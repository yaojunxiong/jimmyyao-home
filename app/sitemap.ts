import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://jimmyyao.com/",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: "https://www.jimmyyao.com/",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9
    }
  ];
}
