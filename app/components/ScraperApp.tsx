"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getUserConfig, clearUserConfig, setUserConfig } from "@/app/lib/storage";
import { scrapeUrl, cleanMarkdown } from "@/app/lib/api";
import type { AIProvider } from "@/app/lib/constants";
import DesignSystemLoader from "./DesignSystemLoader";
import EmptyState from "./EmptyState";
import StyleGuideViewer from "./StyleGuideViewer";
import ApiKeyModal from "./api-key-modal";
import SettingsModal from "./settings-modal";
import SettingsButton from "./SettingsButton";

export default function ScraperApp() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialUrl = searchParams.get("url") || "";

  const [url, setUrl] = useState(initialUrl);
  const [config, setConfig] = useState(() => getUserConfig());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [styleGuide, setStyleGuide] = useState("");
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);

  const processUrl = useCallback(async (targetUrl: string, currentConfig = config) => {
    setLoading(true);
    setError("");

    try {
      const data = await scrapeUrl({
        url: targetUrl,
        apiKey: currentConfig.apiKey,
        provider: currentConfig.provider,
        model: currentConfig.model,
      });
      setStyleGuide(cleanMarkdown(data.styleGuide));
    } catch (err) {
      const error = err as Error & { status?: number };

      if (error.status === 401) {
        clearUserConfig();
        setConfig(getUserConfig());
        setError("Invalid API key. Please enter a valid key for the selected provider.");
        setShowApiKeyModal(true);
        setPendingUrl(targetUrl);
        return;
      }

      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [config]);

  const handleProcessRequest = useCallback(
    (targetUrl: string) => {
      if (!config.apiKey) {
        setPendingUrl(targetUrl);
        setShowApiKeyModal(true);
        return;
      }

      processUrl(targetUrl, config);
    },
    [processUrl, config]
  );

  useEffect(() => {
    if (initialUrl) {
      handleProcessRequest(initialUrl);
    }
  }, [initialUrl, handleProcessRequest]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      setError("Please enter a URL");
      return;
    }

    router.push(`/app?url=${encodeURIComponent(trimmedUrl)}`, { scroll: false });
    handleProcessRequest(trimmedUrl);
  };

  const handleApiKeySubmit = (next: { provider: AIProvider; apiKey: string; model?: string }) => {
    const saved = setUserConfig(next);
    setConfig(saved);
    setShowApiKeyModal(false);
    if (pendingUrl) {
      processUrl(pendingUrl, saved);
      setPendingUrl(null);
    }
  };

  const handleModalClose = () => {
    setShowApiKeyModal(false);
    setPendingUrl(null);
  };

  const handleSettingsReset = () => {
    clearUserConfig();
    setConfig(getUserConfig());
    setStyleGuide("");
  };

  return (
    <>
      <main className="flex-1 px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <UrlForm
            url={url}
            loading={loading}
            onUrlChange={(value) => {
              setUrl(value);
              setError("");
            }}
            onSubmit={handleSubmit}
          />

          {error && <ErrorMessage message={error} />}
          {loading && <DesignSystemLoader />}
          {styleGuide && !loading && <StyleGuideViewer content={styleGuide} />}
          {!styleGuide && !loading && <EmptyState />}
        </div>
      </main>

      <ApiKeyModal
        isOpen={showApiKeyModal}
        onClose={handleModalClose}
        onSubmit={handleApiKeySubmit}
        initialProvider={config.provider}
        initialApiKey={config.apiKey}
        initialModel={config.model}
      />

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        config={config}
        onReset={handleSettingsReset}
      />

      {config.apiKey && (
        <SettingsButton onClick={() => setShowSettingsModal(true)} />
      )}
    </>
  );
}

interface UrlFormProps {
  url: string;
  loading: boolean;
  onUrlChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

function UrlForm({ url, loading, onUrlChange, onSubmit }: UrlFormProps) {
  return (
    <form onSubmit={onSubmit} className="w-full mb-6">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="https://example.com"
          className="flex-1 px-4 py-2.5 text-sm bg-white border-2 border-[var(--color-dark)] rounded-lg focus:outline-none placeholder:text-[var(--color-gray-500)] shadow-[var(--shadow-sm)]"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-5 py-2.5 bg-[var(--color-primary)] text-white font-medium text-sm border-2 border-[var(--color-dark)] rounded-lg shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:translate-x-[1px] hover:translate-y-[-1px] active:shadow-none active:translate-x-0 active:translate-y-0 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
        >
          {loading ? "Analyzing..." : "Get Design System"}
        </button>
      </div>
    </form>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="mb-6 p-4 border-2 rounded-lg text-sm animate-fade-in bg-[#ffd8d3] border-[var(--color-accent-red)] text-[#78191b]">
      <p>{message}</p>
    </div>
  );
}
