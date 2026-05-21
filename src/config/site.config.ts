export interface ServiceItem {
  title: string;
  description: string;
  icon: string;
  link?: string;
  ctaLabel?: string;
}

export interface TestimonialItem {
  quote: string;
  name: string;
  location?: string;
  rating?: number;
}

export interface GalleryItem {
  image: string;
  alt: string;
  title?: string;
  description?: string;
}

export interface SocialLinks {
  googleBusiness?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  x?: string;
  youtube?: string;
}

export interface BusinessAddress {
  street: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
}

export interface SiteConfig {
  businessName: string;
  tagline: string;
  description: string;
  url: string;

  contact: {
    phone: string;
    email: string;
    address?: string;
    hours?: string;
  };

  hero: {
    headline: string;
    subheadline: string;
    primaryCta: string;
    primaryCtaHref: string;
    secondaryCta: string;
    secondaryCtaHref: string;
    image?: string;
  };

  trustItems: string[];

  services: ServiceItem[];

  whyChooseUs: {
    headline: string;
    items: string[];
  };

  testimonials: TestimonialItem[];

  gallery: {
    enabled: boolean;
    headline: string;
    items: GalleryItem[];
  };

  about: {
    enabled: boolean;
    headline: string;
    story: string;
    image?: string;
    yearsOfExperience?: number;
  };

  finalCta: {
    headline: string;
    subheadline: string;
    cta: string;
    ctaHref: string;
  };

  footer: {
    description: string;
    navigation: { label: string; href: string }[];
    privacyUrl?: string;
    termsUrl?: string;
  };

  socialLinks: SocialLinks;

  seo: {
    ogImage?: string;
    twitterHandle?: string;
  };

  business: {
    type: string;
    areaServed: string[];
    priceRange?: string;
    image?: string;
  };
}

export const siteConfig: SiteConfig = {
  businessName: "Acme Local Services",
  tagline: "Reliable service from people you can trust.",
  description:
    "A modern small business website template built with Astro and Cloudflare. Fast, accessible, and easy to customize.",
  url: "https://example.com",

  contact: {
    phone: "(555) 123-4567",
    email: "hello@example.com",
    address: "Tulsa, OK",
    hours: "Mon-Fri 8:00 AM - 5:00 PM",
  },

  hero: {
    headline: "Professional Local Services Made Simple",
    subheadline:
      "A clean, fast website template for service businesses that need more leads. Fully customizable and ready to deploy.",
    primaryCta: "Request a Quote",
    primaryCtaHref: "#contact",
    secondaryCta: "View Services",
    secondaryCtaHref: "#services",
  },

  trustItems: [
    "Locally Owned",
    "Fast Response",
    "Free Estimates",
    "Satisfaction Guaranteed",
    "Licensed & Insured",
    "5-Star Rated",
  ],

  services: [
    {
      title: "Residential Service",
      description:
        "Friendly, reliable help for homeowners with clear pricing and fast response times.",
      icon: "Home",
    },
    {
      title: "Commercial Service",
      description:
        "Professional solutions for businesses that need consistent, high-quality service.",
      icon: "Building2",
    },
    {
      title: "Emergency Service",
      description:
        "24/7 emergency response when you need it most. We're here when others aren't.",
      icon: "Clock",
    },
    {
      title: "Preventive Maintenance",
      description:
        "Regular maintenance plans to keep everything running smoothly and prevent costly repairs.",
      icon: "ShieldCheck",
    },
    {
      title: "Free Consultation",
      description:
        "Not sure what you need? We'll come take a look and give you honest advice — no pressure.",
      icon: "MessageSquare",
    },
    {
      title: "Custom Solutions",
      description:
        "Every home and business is different. We tailor our approach to fit your specific needs.",
      icon: "Wrench",
    },
  ],

  whyChooseUs: {
    headline: "Why Choose Us",
    items: [
      "Fast response times — we return calls within 2 hours",
      "Transparent, upfront pricing with no hidden fees",
      "Locally owned and operated — we know the area",
      "Friendly, respectful technicians who treat your home like their own",
      "Fully licensed, insured, and bonded for your protection",
      "No-pressure estimates with a 100% satisfaction guarantee",
    ],
  },

  testimonials: [
    {
      quote:
        "They showed up on time, explained everything clearly, and the price was exactly what they quoted. No surprises — that's rare these days.",
      name: "Sarah M.",
      location: "Tulsa, OK",
      rating: 5,
    },
    {
      quote:
        "We've used them for years. Always professional, always reliable. Wouldn't trust anyone else with our property.",
      name: "James T.",
      location: "Broken Arrow, OK",
      rating: 5,
    },
    {
      quote:
        "Called on a Sunday for an emergency and they were here within the hour. Can't ask for better service than that.",
      name: "Maria G.",
      location: "Bixby, OK",
      rating: 5,
    },
  ],

  gallery: {
    enabled: false,
    headline: "Our Work",
    items: [
      {
        image: "/images/gallery/example-1.webp",
        alt: "Completed project example",
        title: "Recent Project",
        description: "Description of the work performed.",
      },
    ],
  },

  about: {
    enabled: true,
    headline: "About Us",
    story:
      "We're a locally owned business serving the Tulsa area with honest pricing, clear communication, and work we're proud to stand behind. Founded with the belief that quality service and treating people right never goes out of style, we've grown by letting our results speak for themselves. Every job — big or small — gets the same attention to detail and commitment to doing it right the first time.",
    yearsOfExperience: 15,
  },

  finalCta: {
    headline: "Ready to Get Started?",
    subheadline:
      "Tell us what you need and we'll get back to you quickly with a free estimate.",
    cta: "Request a Quote",
    ctaHref: "#contact",
  },

  footer: {
    description:
      "Your trusted local service provider. Quality work, fair prices, and real people who care.",
    navigation: [
      { label: "Home", href: "/" },
      { label: "Services", href: "#services" },
      { label: "About", href: "#about" },
      { label: "Contact", href: "#contact" },
      { label: "Privacy", href: "/privacy" },
    ],
    privacyUrl: "/privacy",
    termsUrl: undefined,
  },

  socialLinks: {
    googleBusiness: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    x: "",
    youtube: "",
  },

  seo: {
    ogImage: "/images/og-image.png",
    twitterHandle: "",
  },

  business: {
    type: "LocalBusiness",
    areaServed: ["Tulsa", "Broken Arrow", "Bixby", "Jenks", "Owasso"],
    priceRange: "$$",
  },
};
