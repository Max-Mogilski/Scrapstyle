"use client";

import { useState } from "react";
import { setUserConfig } from "@/app/lib/storage";
import { ModalHeader } from "./ModalHeader";
import { ModalContent } from "./ModalContent";
import type { ApiKeyModalProps, ApiKeyConfig } from "./types";
import type { AIProvider } from "@/app/lib/constants";

export default function ApiKeyModal({
  isOpen,
  onClose,
  onSubmit,
  initialProvider = "gemini",
  initialApiKey = "",
  initialModel,
}: ApiKeyModalProps) {
  const [provider, setProvider] = useState<AIProvider>(initialProvider);
  const [apiKey, setApiKey] = useState(initialApiKey);
  const [model, setModel] = useState(initialModel ?? "");
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

    const config: ApiKeyConfig = {
      provider,
      apiKey: trimmedKey,
      model: trimmedModel || undefined,
    };

    setUserConfig(config);
    onSubmit(config);
    resetForm();
  };

  const resetForm = () => {
    setApiKey("");
    setModel("");
    setError("");
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const clearError = () => setError("");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-lg bg-white border-3 border-[var(--color-dark)] rounded-lg shadow-[-8px_8px_0px_0px_#383838] overflow-hidden animate-fade-in-up">
        {/* Accent stripe */}
        <div className="h-2 bg-[var(--color-primary)]" />

        <ModalHeader onClose={onClose} />
        <ModalContent
          apiKey={apiKey}
          provider={provider}
          model={model}
          error={error}
          onApiKeyChange={(value) => {
            setApiKey(value);
            clearError();
          }}
          onProviderChange={(value) => {
            setProvider(value);
            clearError();
          }}
          onModelChange={(value) => {
            setModel(value);
            clearError();
          }}
          onSubmit={handleSubmit}
          onClose={onClose}
        />
      </div>
    </div>
  );
}

