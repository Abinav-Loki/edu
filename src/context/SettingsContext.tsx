import React, { createContext, useContext, useEffect, useState } from "react";

export interface UserSettings {
  theme: "light" | "dark";
  accentColor: "indigo" | "blue" | "teal";
  language: string;
  region: string;
  pushNotificationsEnabled: boolean;
  soundEffectsEnabled: boolean;
  twoFactorEnabled: boolean;
}

const defaultSettings: UserSettings = {
  theme: "light",
  accentColor: "indigo",
  language: "English",
  region: "India",
  pushNotificationsEnabled: true,
  soundEffectsEnabled: true,
  twoFactorEnabled: false,
};

interface SettingsContextType {
  settings: UserSettings;
  updateSettings: (updates: Partial<UserSettings>) => void;
  playSound: (type: "success" | "notification") => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem("campusos_settings");
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem("campusos_settings", JSON.stringify(settings));
    
    // Apply theme
    if (settings.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Apply accent color (injecting CSS variables)
    const root = document.documentElement;
    if (settings.accentColor === "indigo") {
      root.style.setProperty("--primary-from", "#6366F1");
      root.style.setProperty("--primary-via", "#4F46E5");
      root.style.setProperty("--primary-to", "#4338CA");
    } else if (settings.accentColor === "blue") {
      root.style.setProperty("--primary-from", "#38BDF8");
      root.style.setProperty("--primary-via", "#0EA5E9");
      root.style.setProperty("--primary-to", "#0284C7");
    } else if (settings.accentColor === "teal") {
      root.style.setProperty("--primary-from", "#2DD4BF");
      root.style.setProperty("--primary-via", "#14B8A6");
      root.style.setProperty("--primary-to", "#0F766E");
    }
  }, [settings]);

  const updateSettings = (updates: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const playSound = (type: "success" | "notification") => {
    if (!settings.soundEffectsEnabled) return;
    // In a real app we would play an Audio element here.
    console.log(`[Sound System] Playing ${type} sound.`);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, playSound }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
