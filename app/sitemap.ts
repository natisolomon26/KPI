import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://books.evasue.net",
      priority: 1,
    },
    {
      url: "https://books.evasue.net/register",
      priority: 0.9,
    },
  ];
}