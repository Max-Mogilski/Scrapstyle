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

/**
 * Popular OpenRouter models as of December 2025
 * Format: { id: "provider/model-name", label: "Display Name" }
 */
export const OPENROUTER_MODELS = [
  { id: "x-ai/grok-4.1-fast", label: "Grok 4.1 Fast (xAI)" },
  { id: "anthropic/claude-sonnet-4.5", label: "Claude Sonnet 4.5" },
  { id: "google/gemini-2.5-flash", label: "Gemini 2.5 Flash" },
  { id: "openai/gpt-4o", label: "GPT-4o" },
  { id: "openai/gpt-4o-mini", label: "GPT-4o Mini" },
  { id: "deepseek/deepseek-v3.2", label: "DeepSeek V3.2" },
  { id: "meta-llama/llama-3.3-70b-instruct", label: "Llama 3.3 70B" },
  { id: "x-ai/grok-code-fast-1", label: "Grok Code Fast 1 (xAI)" },
] as const;

export const CUSTOM_MODEL_VALUE = "__custom__" as const;

