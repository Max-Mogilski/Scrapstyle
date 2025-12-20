import type { AIProvider } from "@/app/lib/constants";

/**
 * Available AI providers - use this instead of inline type casting
 */
export const AI_PROVIDERS: readonly AIProvider[] = ["gemini", "openrouter"] as const;

/**
 * Configuration object returned on successful form submission
 */
export interface ApiKeyConfig {
  provider: AIProvider;
  apiKey: string;
  model?: string;
}

/**
 * Props for the main ApiKeyModal component
 */
export interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (config: ApiKeyConfig) => void;
  initialProvider?: AIProvider;
  initialApiKey?: string;
  initialModel?: string;
}

/**
 * Props for the ModalHeader component
 */
export interface ModalHeaderProps {
  onClose: () => void;
}

/**
 * Props for the ProviderTabs component
 */
export interface ProviderTabsProps {
  provider: AIProvider;
  onProviderChange: (provider: AIProvider) => void;
}

/**
 * Props for the ModalContent component
 */
export interface ModalContentProps {
  apiKey: string;
  provider: AIProvider;
  model: string;
  error: string;
  onApiKeyChange: (value: string) => void;
  onProviderChange: (provider: AIProvider) => void;
  onModelChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

