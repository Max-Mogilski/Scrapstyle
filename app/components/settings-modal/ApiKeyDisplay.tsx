"use client";

import { useState } from "react";
import { EyeIcon, EyeOffIcon, CopyIcon, CheckIcon } from "@/app/components/ui/icons";
import type { ApiKeyDisplayProps } from "./types";

export function ApiKeyDisplay({ apiKey }: ApiKeyDisplayProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const maskKey = (key: string): string => {
    if (key.length <= 6) return key;
    const visibleStart = key.slice(0, 3);
    const visibleEnd = key.slice(-3);
    const maskedLength = key.length - 6;
    return `${visibleStart}${"•".repeat(Math.min(maskedLength, 20))}${visibleEnd}`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = apiKey;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex items-stretch gap-2">
      <div className="flex-1 px-4 py-3 bg-[var(--color-gray-100)] border-2 border-[var(--color-dark)] rounded-md font-mono text-sm overflow-hidden flex items-center shadow-[-2px_2px_0px_0px_#383838]">
        <span className="block truncate">
          {isRevealed ? apiKey : maskKey(apiKey)}
        </span>
      </div>
      
      <button
        type="button"
        onClick={() => setIsRevealed(!isRevealed)}
        className="w-11 flex items-center justify-center bg-white border-2 border-[var(--color-dark)] rounded-md text-[var(--color-dark)] hover:bg-[var(--color-gray-100)] transition-colors shadow-[-2px_2px_0px_0px_#383838] hover:shadow-[-3px_3px_0px_0px_#383838] hover:translate-x-[1px] hover:translate-y-[-1px] active:shadow-none active:translate-x-[-2px] active:translate-y-[2px] cursor-pointer"
        aria-label={isRevealed ? "Hide API key" : "Show API key"}
      >
        {isRevealed ? <EyeOffIcon /> : <EyeIcon />}
      </button>

      <button
        type="button"
        onClick={handleCopy}
        className={`w-11 flex items-center justify-center border-2 border-[var(--color-dark)] rounded-md transition-all shadow-[-2px_2px_0px_0px_#383838] hover:shadow-[-3px_3px_0px_0px_#383838] hover:translate-x-[1px] hover:translate-y-[-1px] active:shadow-none active:translate-x-[-2px] active:translate-y-[2px] cursor-pointer ${
          copied
            ? "bg-[var(--color-accent-teal)] text-white"
            : "bg-white text-[var(--color-dark)] hover:bg-[var(--color-gray-100)]"
        }`}
        aria-label="Copy API key"
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </button>
    </div>
  );
}

