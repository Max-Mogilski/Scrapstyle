export type AIProvider = "gemini" | "openrouter";

export const EXTERNAL_LINKS = {
  geminiApiKey: "https://aistudio.google.com/app/apikey",
  openRouterKey: "https://openrouter.ai/keys",
} as const;

export const DEFAULT_PROVIDER: AIProvider = "gemini";
export const DEFAULT_MODELS: Record<AIProvider, string> = {
  gemini: "gemini-2.0-flash",
  openrouter: "gpt-4o-mini",
};

export const PROVIDER_COPY: Record<
  AIProvider,
  { label: string; placeholder: string; helper: string; link: string }
> = {
  gemini: {
    label: "Gemini (Google AI Studio)",
    placeholder: "AIza...",
    helper: "Use your free Gemini API key (data stays in your browser).",
    link: EXTERNAL_LINKS.geminiApiKey,
  },
  openrouter: {
    label: "OpenRouter (OpenAI-compatible)",
    placeholder: "sk-or-...",
    helper: "Uses the OpenRouter API; recommended model: gpt-4o-mini.",
    link: EXTERNAL_LINKS.openRouterKey,
  },
};

