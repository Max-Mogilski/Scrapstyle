"use client";

import { CloseIcon, SettingsIcon, TrashIcon } from "@/app/components/ui/icons";
import { PROVIDER_COPY, OPENROUTER_MODELS } from "@/app/lib/constants";
import { ApiKeyDisplay } from "./ApiKeyDisplay";
import type { SettingsModalProps } from "./types";

export default function SettingsModal({
  isOpen,
  onClose,
  config,
  onReset,
}: SettingsModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleReset = () => {
    onReset();
    onClose();
  };

  const getModelLabel = (modelId: string): string => {
    const model = OPENROUTER_MODELS.find((m) => m.id === modelId);
    return model ? model.label : modelId || "Default";
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-lg bg-white border-3 border-[var(--color-dark)] rounded-lg shadow-[-8px_8px_0px_0px_#383838] overflow-hidden animate-fade-in-up">
        {/* Accent stripe */}
        <div className="h-2 bg-[var(--color-accent-teal)]" />

        {/* Header */}
        <div className="relative px-8 pt-6 pb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[var(--color-accent-teal)] border-2 border-[var(--color-dark)] rounded-md flex items-center justify-center shadow-[-3px_3px_0px_0px_#383838]">
              <SettingsIcon className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--color-dark)] tracking-tight">
              Settings
            </h2>
          </div>

          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-[var(--color-gray-100)] border-2 border-[var(--color-dark)] rounded-md text-[var(--color-dark)] hover:bg-[var(--color-accent-red)] hover:text-white transition-colors shadow-[-2px_2px_0px_0px_#383838] hover:shadow-none hover:translate-x-[-2px] hover:translate-y-[2px] cursor-pointer"
            aria-label="Close modal"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 pb-8 space-y-6">
          {/* Provider */}
          <div>
            <label className="block text-sm font-bold text-[var(--color-dark)] mb-2 uppercase tracking-wide">
              Provider
            </label>
            <div className="px-4 py-3 bg-[var(--color-gray-100)] border-2 border-[var(--color-dark)] rounded-md text-sm font-medium">
              {PROVIDER_COPY[config.provider].label}
            </div>
          </div>

          {/* API Key */}
          <div>
            <label className="block text-sm font-bold text-[var(--color-dark)] mb-2 uppercase tracking-wide">
              API Key
            </label>
            <ApiKeyDisplay apiKey={config.apiKey} />
          </div>

          {/* Model (OpenRouter only) */}
          {config.provider === "openrouter" && config.model && (
            <div>
              <label className="block text-sm font-bold text-[var(--color-dark)] mb-2 uppercase tracking-wide">
                Model
              </label>
              <div className="px-4 py-3 bg-[var(--color-gray-100)] border-2 border-[var(--color-dark)] rounded-md text-sm font-medium">
                {getModelLabel(config.model)}
              </div>
            </div>
          )}

          {/* Reset Button */}
          <div className="pt-4 border-t-2 border-[var(--color-gray-200)]">
            <button
              type="button"
              onClick={handleReset}
              className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-white text-[var(--color-accent-red)] font-bold text-sm border-2 border-[var(--color-accent-red)] rounded-md shadow-[-4px_4px_0px_0px_var(--color-accent-red)] hover:bg-[var(--color-accent-red)] hover:text-white hover:shadow-[-5px_5px_0px_0px_#383838] hover:translate-x-[1px] hover:translate-y-[-1px] active:shadow-none active:translate-x-[-4px] active:translate-y-[4px] transition-all cursor-pointer uppercase tracking-wide"
            >
              <TrashIcon />
              Reset All Settings
            </button>
            <p className="mt-2 text-xs text-[var(--color-gray-500)] text-center">
              This will clear your API key and all preferences
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

