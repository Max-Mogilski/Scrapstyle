"use client";

import { KeyIcon, CloseIcon } from "@/app/components/ui/icons";
import type { ModalHeaderProps } from "./types";

export function ModalHeader({ onClose }: ModalHeaderProps) {
  return (
    <div className="relative px-8 pt-6 pb-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-[var(--color-primary)] border-2 border-[var(--color-dark)] rounded-md flex items-center justify-center shadow-[-3px_3px_0px_0px_#383838]">
          <KeyIcon />
        </div>
        <h2 className="text-2xl font-bold text-[var(--color-dark)] tracking-tight">
          Connect Your AI
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
  );
}

