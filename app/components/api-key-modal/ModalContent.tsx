"use client";

import { ExternalLinkIcon, LockIcon } from "@/app/components/ui/icons";
import { PROVIDER_COPY } from "@/app/lib/constants";
import { ProviderTabs } from "./ProviderTabs";
import { ModelSelect } from "./ModelSelect";
import type { ModalContentProps } from "./types";

export function ModalContent({
  apiKey,
  provider,
  model,
  error,
  onApiKeyChange,
  onProviderChange,
  onModelChange,
  onSubmit,
  onClose,
}: ModalContentProps) {
  return (
    <div className="px-8 pb-8">
      <ProviderTabs provider={provider} onProviderChange={onProviderChange} />

      <form onSubmit={onSubmit} className="space-y-5">
        <ApiKeyInput
          apiKey={apiKey}
          provider={provider}
          error={error}
          onApiKeyChange={onApiKeyChange}
        />

        {provider === "openrouter" && (
          <ModelSelect value={model} onChange={onModelChange} />
        )}

        <ApiKeyLink provider={provider} />

        <ActionButtons onClose={onClose} />
      </form>

      <PrivacyNotice />
    </div>
  );
}

interface ApiKeyInputProps {
  apiKey: string;
  provider: "gemini" | "openrouter";
  error: string;
  onApiKeyChange: (value: string) => void;
}

function ApiKeyInput({ apiKey, provider, error, onApiKeyChange }: ApiKeyInputProps) {
  return (
    <div>
      <label
        htmlFor="apiKey"
        className="block text-sm font-bold text-[var(--color-dark)] mb-2 uppercase tracking-wide"
      >
        API Key
      </label>
      <input
        id="apiKey"
        type="password"
        value={apiKey}
        onChange={(e) => onApiKeyChange(e.target.value)}
        placeholder={PROVIDER_COPY[provider].placeholder}
        className="w-full px-4 py-3.5 text-base bg-white border-2 border-[var(--color-dark)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-1 placeholder:text-[var(--color-gray-400)] shadow-[-3px_3px_0px_0px_#383838] transition-shadow"
        autoComplete="off"
      />
      {error && (
        <p className="mt-2 text-sm font-medium text-[var(--color-accent-red)] flex items-center gap-1">
          <span className="inline-block w-1.5 h-1.5 bg-[var(--color-accent-red)] rounded-full" />
          {error}
        </p>
      )}
    </div>
  );
}

interface ApiKeyLinkProps {
  provider: "gemini" | "openrouter";
}

function ApiKeyLink({ provider }: ApiKeyLinkProps) {
  const linkText =
    provider === "gemini"
      ? "Get your free Gemini API key"
      : "Get your OpenRouter key";

  return (
    <a
      href={PROVIDER_COPY[provider].link}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:underline underline-offset-2 cursor-pointer"
    >
      <ExternalLinkIcon />
      {linkText}
    </a>
  );
}

interface ActionButtonsProps {
  onClose: () => void;
}

function ActionButtons({ onClose }: ActionButtonsProps) {
  const buttonBaseStyles =
    "flex-1 px-5 py-3.5 font-bold text-sm border-2 border-[var(--color-dark)] rounded-md shadow-[-4px_4px_0px_0px_#383838] hover:shadow-[-5px_5px_0px_0px_#383838] hover:translate-x-[1px] hover:translate-y-[-1px] active:shadow-none active:translate-x-[-4px] active:translate-y-[4px] transition-all cursor-pointer uppercase tracking-wide";

  return (
    <div className="flex gap-4 pt-2">
      <button
        type="button"
        onClick={onClose}
        className={`${buttonBaseStyles} bg-white text-[var(--color-dark)]`}
      >
        Cancel
      </button>
      <button
        type="submit"
        className={`${buttonBaseStyles} bg-[var(--color-primary)] text-white`}
      >
        Save & Continue
      </button>
    </div>
  );
}

function PrivacyNotice() {
  return (
    <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[var(--color-gray-500)]">
      <LockIcon />
      <span>Your key is stored locally and never leaves your browser</span>
    </div>
  );
}

