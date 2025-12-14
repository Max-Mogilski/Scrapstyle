import { DEFAULT_PROVIDER, type AIProvider } from "./constants";

type UserConfig = { provider: AIProvider; apiKey: string; model?: string };

const STORAGE_KEYS = {
  legacyGemini: "gemini-api-key",
  config: "scrapestyle-ai-config",
} as const;

const DEFAULT_CONFIG: UserConfig = { provider: DEFAULT_PROVIDER, apiKey: "" };

function readConfig(): UserConfig {
  if (typeof window === "undefined") return DEFAULT_CONFIG;
  const raw = localStorage.getItem(STORAGE_KEYS.config);
  if (!raw) return DEFAULT_CONFIG;
  try {
    return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function getUserConfig(): UserConfig {
  if (typeof window === "undefined") return DEFAULT_CONFIG;
  const config = readConfig();
  if (!config.apiKey) {
    const legacy = localStorage.getItem(STORAGE_KEYS.legacyGemini);
    if (legacy) return { ...config, apiKey: legacy, provider: "gemini" };
  }
  return config;
}

export function setUserConfig(update: Partial<UserConfig>): UserConfig {
  if (typeof window === "undefined") return DEFAULT_CONFIG;
  const next = { ...getUserConfig(), ...update };
  localStorage.setItem(STORAGE_KEYS.config, JSON.stringify(next));
  if (update.apiKey && next.provider === "gemini") {
    localStorage.setItem(STORAGE_KEYS.legacyGemini, update.apiKey);
  }
  return next;
}

export function clearUserConfig(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.config);
  localStorage.removeItem(STORAGE_KEYS.legacyGemini);
}

