"use client";

import { SettingsIcon } from "@/app/components/ui/icons";

interface SettingsButtonProps {
  onClick: () => void;
}

export default function SettingsButton({ onClick }: SettingsButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 w-12 h-12 flex items-center justify-center bg-white border-2 border-[var(--color-dark)] rounded-full text-[var(--color-dark)] shadow-[-4px_4px_0px_0px_#383838] hover:shadow-[-5px_5px_0px_0px_#383838] hover:translate-x-[1px] hover:translate-y-[-1px] active:shadow-none active:translate-x-[-4px] active:translate-y-[4px] transition-all cursor-pointer animate-fade-in"
      aria-label="Open settings"
    >
      <SettingsIcon className="w-5 h-5" />
    </button>
  );
}

