import type { MetadataRoute } from "next";
import { demoMode } from "@/lib/demo-opportunities";
export default function robots(): MetadataRoute.Robots {
  const origin = process.env.APP_ORIGIN || "http://localhost:3000";
  if (demoMode) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/me", "/recruiter", "/api/"],
      },
    ],
    sitemap: new URL("/sitemap.xml", origin).toString(),
  };
}
