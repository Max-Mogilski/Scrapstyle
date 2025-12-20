import type { AIProvider } from "@/app/lib/constants";

export interface UserConfig {
  provider: AIProvider;
  apiKey: string;
  model?: string;
}

export interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: UserConfig;
  onReset: () => void;
}

export interface ApiKeyDisplayProps {
  apiKey: string;
}

