"use client";

import { useState, useEffect } from "react";
import { OPENROUTER_MODELS, CUSTOM_MODEL_VALUE } from "@/app/lib/constants";

interface ModelSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function ModelSelect({ value, onChange }: ModelSelectProps) {
  // Check if current value matches a predefined model
  const isPredefinedModel = OPENROUTER_MODELS.some((m) => m.id === value);
  const initialSelectValue = isPredefinedModel ? value : value ? CUSTOM_MODEL_VALUE : "";
  
  const [selectValue, setSelectValue] = useState(initialSelectValue);
  const [customModel, setCustomModel] = useState(isPredefinedModel ? "" : value);
  const [showCustomInput, setShowCustomInput] = useState(selectValue === CUSTOM_MODEL_VALUE);

  // Sync with external value changes
  useEffect(() => {
    const isPredefined = OPENROUTER_MODELS.some((m) => m.id === value);
    if (isPredefined) {
      setSelectValue(value);
      setShowCustomInput(false);
    } else if (value) {
      setSelectValue(CUSTOM_MODEL_VALUE);
      setCustomModel(value);
      setShowCustomInput(true);
    }
  }, [value]);

  const handleSelectChange = (newValue: string) => {
    setSelectValue(newValue);
    
    if (newValue === CUSTOM_MODEL_VALUE) {
      setShowCustomInput(true);
      onChange(customModel);
    } else {
      setShowCustomInput(false);
      onChange(newValue);
    }
  };

  const handleCustomChange = (newCustom: string) => {
    setCustomModel(newCustom);
    onChange(newCustom);
  };

  return (
    <div className="space-y-3">
      <div>
        <label
          htmlFor="model"
          className="block text-sm font-bold text-[var(--color-dark)] mb-2 uppercase tracking-wide"
        >
          Model{" "}
          <span className="font-normal text-[var(--color-gray-500)] normal-case">
            (optional)
          </span>
        </label>
        <div className="relative">
          <select
            id="model"
            value={selectValue}
            onChange={(e) => handleSelectChange(e.target.value)}
            className="w-full px-4 py-3.5 text-base bg-white border-2 border-[var(--color-dark)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-1 shadow-[-3px_3px_0px_0px_#383838] transition-shadow appearance-none cursor-pointer"
          >
            <option value="">Select a model...</option>
            {OPENROUTER_MODELS.map((model) => (
              <option key={model.id} value={model.id}>
                {model.label}
              </option>
            ))}
            <option value={CUSTOM_MODEL_VALUE}>Custom model...</option>
          </select>
          <ChevronDownIcon />
        </div>
      </div>

      {showCustomInput && (
        <div className="animate-fade-in">
          <label
            htmlFor="customModel"
            className="block text-sm font-bold text-[var(--color-dark)] mb-2 uppercase tracking-wide"
          >
            Custom Model ID
          </label>
          <input
            id="customModel"
            type="text"
            value={customModel}
            onChange={(e) => handleCustomChange(e.target.value)}
            placeholder="provider/model-name"
            className="w-full px-4 py-3.5 text-base bg-white border-2 border-[var(--color-dark)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-1 placeholder:text-[var(--color-gray-400)] shadow-[-3px_3px_0px_0px_#383838] transition-shadow"
            autoComplete="off"
          />
          <p className="mt-1.5 text-xs text-[var(--color-gray-500)]">
            Enter the full model ID (e.g., openai/gpt-4-turbo)
          </p>
        </div>
      )}
    </div>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-dark)] pointer-events-none"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.5}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
}

