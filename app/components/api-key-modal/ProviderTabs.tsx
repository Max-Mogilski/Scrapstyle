"use client";

import { GeminiIcon, RouterIcon } from "@/app/components/ui/icons";
import { AI_PROVIDERS, type ProviderTabsProps } from "./types";

const PROVIDER_LABELS = {
  gemini: "Gemini",
  openrouter: "OpenRouter",
} as const;

const PROVIDER_ICONS = {
  gemini: GeminiIcon,
  openrouter: RouterIcon,
} as const;

export function ProviderTabs({ provider, onProviderChange }: ProviderTabsProps) {
  return (
    <div className="flex p-1 bg-[var(--color-gray-100)] border-2 border-[var(--color-dark)] rounded-md mb-6">
      {AI_PROVIDERS.map((p) => {
        const Icon = PROVIDER_ICONS[p];
        const isActive = provider === p;

        return (
          <button
            key={p}
            type="button"
            onClick={() => onProviderChange(p)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold rounded transition-all cursor-pointer ${
              isActive
                ? "bg-white text-[var(--color-dark)] border-2 border-[var(--color-dark)] shadow-[-3px_3px_0px_0px_#383838]"
                : "bg-transparent text-[var(--color-gray-500)] border-2 border-transparent hover:text-[var(--color-dark)]"
            }`}
          >
            <Icon />
            {PROVIDER_LABELS[p]}
          </button>
        );
      })}
    </div>
  );
}

