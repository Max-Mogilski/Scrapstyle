import type { AIProvider } from "./constants";

export interface ScrapeRequest {
  url: string;
  apiKey: string;
  provider: AIProvider;
  model?: string;
}

export interface ScrapeResponse {
  styleGuide: string;
  designTokens: {
    colors: string[];
    fonts: string[];
    cssVariables: Record<string, string>;
  };
}

export interface ApiError {
  error: string;
}

export async function scrapeUrl(request: ScrapeRequest): Promise<ScrapeResponse> {
  const response = await fetch("/api/scrape", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.error || "Failed to generate style guide");
    (error as Error & { status: number }).status = response.status;
    throw error;
  }

  return data;
}

export function cleanMarkdown(markdown: string): string {
  return markdown
    .replace(/^```(?:markdown)?\n?/i, "")
    .replace(/\n?```\s*$/i, "")
    .trim();
}

