export const siteConfig = {
  name: "Scrape Style",
  url: "https://scrapestyle.com",
  description:
    "Paste a URL, get a design system. Generate AI-ready style guides for Cursor & Lovable in seconds.",
  github: {
    repo: "Max-Mogilski/Scrapstyle",
    url: "https://github.com/Max-Mogilski/Scrapstyle",
  },
  buyMeCoffee: "https://buymeacoffee.com/maxuuu",
  social: {
    website: "https://www.max-mogilski.com/",
    x: "https://x.com/Maxuuu0",
    youtube: "https://www.youtube.com/@max-mogilski",
  },
} as const;

export type SiteConfig = typeof siteConfig;
