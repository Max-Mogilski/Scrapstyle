"use client";

import { useState } from "react";
import { setUserConfig } from "@/app/lib/storage";
import { PROVIDER_COPY, type AIProvider } from "@/app/lib/constants";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (config: { provider: AIProvider; apiKey: string; model?: string }) => void;
  initialProvider?: AIProvider;
  initialApiKey?: string;
  initialModel?: string;
}

export default function ApiKeyModal({
  isOpen,
  onClose,
  onSubmit,
  initialProvider = "gemini",
  initialApiKey = "",
  initialModel,
}: ApiKeyModalProps) {
  const [provider, setProvider] = useState<AIProvider>(initialProvider);
  const [apiKey, setApiKeyState] = useState(initialApiKey);
  const [model, setModel] = useState(initialModel || "");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedKey = apiKey.trim();
    const trimmedModel = model.trim();

    if (!trimmedKey) {
      setError("Please enter your API key");
      return;
    }

    setUserConfig({ provider, apiKey: trimmedKey, model: trimmedModel || undefined });
    onSubmit({ provider, apiKey: trimmedKey, model: trimmedModel || undefined });
    setApiKeyState("");
    setModel("");
    setError("");
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-md bg-white border-2 border-[var(--color-dark)] rounded-xl shadow-[var(--shadow-lg)] overflow-hidden animate-fade-in-up">
        <ModalHeader onClose={onClose} />
        <ModalContent
          apiKey={apiKey}
          provider={provider}
          model={model}
          error={error}
          onApiKeyChange={(value) => {
            setApiKeyState(value);
            setError("");
          }}
          onProviderChange={(value) => {
            setProvider(value);
            setError("");
          }}
          onModelChange={(value) => {
            setModel(value);
            setError("");
          }}
          onSubmit={handleSubmit}
          onClose={onClose}
        />
      </div>
    </div>
  );
}

function ModalHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="relative p-6 border-b-2 border-[var(--color-dark)] bg-[var(--color-gray-100)]">
      <div className="absolute -top-2 -left-2 w-6 h-6 bg-[var(--color-accent-yellow)] border-2 border-[var(--color-dark)]" />
      <div className="absolute -top-2 -right-2 w-4 h-4 bg-[var(--color-accent-teal)] border-2 border-[var(--color-dark)]" />

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[var(--color-primary)] border-2 border-[var(--color-dark)] rounded-lg flex items-center justify-center shadow-[-2px_2px_0px_0px_#383838]">
          <KeyIcon />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[var(--color-dark)]">API Key Required</h2>
          <p className="text-sm text-[var(--color-gray-500)]">One-time setup</p>
        </div>
      </div>

      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-[var(--color-gray-500)] hover:text-[var(--color-dark)] transition-colors"
      >
        <CloseIcon />
      </button>
    </div>
  );
}

interface ModalContentProps {
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

function ModalContent({
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
    <div className="p-6">
      <p className="text-sm text-[var(--color-gray-600)] mb-4 leading-relaxed">
        Keys stay in your browser. Choose your provider and paste the key.
      </p>

      <div className="flex gap-2 mb-4">
        {(["gemini", "openrouter"] as AIProvider[]).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onProviderChange(p)}
            className={`flex-1 px-3 py-2 text-sm font-semibold border-2 rounded-lg ${
              provider === p
                ? "bg-[var(--color-primary)] text-white border-[var(--color-dark)]"
                : "bg-white text-[var(--color-dark)] border-[var(--color-gray-300)]"
            }`}
          >
            {PROVIDER_COPY[p].label}
          </button>
        ))}
      </div>

      <a
        href={PROVIDER_COPY[provider].link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-primary)] hover:underline mb-5"
      >
        <ExternalLinkIcon />
        {provider === "gemini" ? "Get your free Gemini API key" : "Get your OpenRouter key"}
      </a>

      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label htmlFor="apiKey" className="block text-sm font-medium text-[var(--color-dark)] mb-2">
            API Key ({PROVIDER_COPY[provider].label})
          </label>
          <input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
            placeholder={PROVIDER_COPY[provider].placeholder}
            className="w-full px-4 py-3 text-sm bg-white border-2 border-[var(--color-dark)] rounded-lg focus:outline-none placeholder:text-[var(--color-gray-400)] shadow-[var(--shadow-sm)]"
            autoComplete="off"
          />
          {error && <p className="mt-2 text-sm text-[var(--color-accent-red)]">{error}</p>}
        </div>

        {provider === "openrouter" && (
          <div className="mb-4">
            <label htmlFor="model" className="block text-sm font-medium text-[var(--color-dark)] mb-2">
              Model (optional)
            </label>
            <input
              id="model"
              type="text"
              value={model}
              onChange={(e) => onModelChange(e.target.value)}
              placeholder="gpt-4o-mini"
              className="w-full px-4 py-3 text-sm bg-white border-2 border-[var(--color-dark)] rounded-lg focus:outline-none placeholder:text-[var(--color-gray-400)] shadow-[var(--shadow-sm)]"
              autoComplete="off"
            />
          </div>
        )}

        <p className="text-xs text-[var(--color-gray-600)] mb-4">
          {PROVIDER_COPY[provider].helper}
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-white text-[var(--color-dark)] font-semibold text-sm border-2 border-[var(--color-dark)] rounded-lg shadow-[-3px_3px_0px_0px_#383838] hover:shadow-[-4px_4px_0px_0px_#383838] hover:translate-x-[1px] hover:translate-y-[-1px] active:shadow-none active:translate-x-0 active:translate-y-0 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-3 bg-[var(--color-primary)] text-white font-semibold text-sm border-2 border-[var(--color-dark)] rounded-lg shadow-[-3px_3px_0px_0px_#383838] hover:shadow-[-4px_4px_0px_0px_#383838] hover:translate-x-[1px] hover:translate-y-[-1px] active:shadow-none active:translate-x-0 active:translate-y-0 transition-all cursor-pointer"
          >
            Save & Continue
          </button>
        </div>
      </form>

      <p className="mt-4 text-xs text-[var(--color-gray-500)] text-center">
        🔒 Your key is stored locally and never leaves your browser
      </p>
    </div>
  );
}

function KeyIcon() {
  return (
    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
      />
    </svg>
  );
}
