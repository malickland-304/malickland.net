import type { MetadataRoute } from "next";
import { serviceOffers } from "./services/offers";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://malickland.net";
  const lastModified = new Date();

  const coreRoutes = [
    {
      url: `${baseUrl}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/services`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/listings`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
  ];

  const serviceOfferRoutes = serviceOffers.map((offer) => ({
    url: `${baseUrl}/services/${offer.slug}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...coreRoutes, ...serviceOfferRoutes];
}
