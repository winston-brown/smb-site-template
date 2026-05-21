import type { SiteConfig } from "../config/site.config";

export interface SEOProps {
  title?: string;
  description?: string;
  ogImage?: string;
  canonical?: string;
  config: SiteConfig;
}

export function generateLocalBusinessSchema(config: SiteConfig) {
  const { businessName, description, url, contact, business } = config;

  return {
    "@context": "https://schema.org",
    "@type": business.type || "LocalBusiness",
    name: businessName,
    description,
    url,
    telephone: contact.phone,
    email: contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.address,
      addressLocality: contact.address?.split(",")[0]?.trim() || "",
      addressRegion: contact.address?.split(",")[1]?.trim() || "",
    },
    areaServed: business.areaServed.map((area) => ({
      "@type": "City",
      name: area,
    })),
    priceRange: business.priceRange || "$$",
    image: business.image || `${url}/images/og-image.png`,
    openingHours: contact.hours || "Mo-Fr 08:00-17:00",
  };
}

export function generateWebsiteSchema(config: SiteConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: config.businessName,
    description: config.description,
    url: config.url,
  };
}
