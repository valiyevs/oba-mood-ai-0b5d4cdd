import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type Locale = "az" | "ru" | "en";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (contentKey: string, fallback?: string) => string;
  tOptional: (contentKey: string) => string | null;
  tField: (table: string, contentId: string, field: string, fallback?: string) => string;
  locales: { code: Locale; label: string; flag: string }[];
}

const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: "az", label: "Azərbaycan", flag: "🇦🇿" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "en", label: "English", flag: "🇬🇧" },
];

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    return (localStorage.getItem("app_locale") as Locale) || "az";
  });

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("app_locale", l);
    document.documentElement.lang = l;
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  // Fetch ALL CMS content (including inactive — so we can detect deactivation)
  const { data: cmsContent = [] } = useQuery({
    queryKey: ["cms_content_i18n"],
    queryFn: async () => {
      const { data } = await supabase.from("cms_content").select("id,content_key,content_value,is_active");
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  // Fetch translations for current locale
  const { data: translations = [] } = useQuery({
    queryKey: ["cms_translations_all", locale],
    queryFn: async () => {
      if (locale === "az") return [];
      const { data } = await supabase.from("cms_translations").select("content_id,content_table,field_name,translated_value").eq("locale", locale);
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  // t() - translate by content_key (for cms_content table)
  // If key exists but is_active=false → returns empty string (deactivated)
  // If key doesn't exist → returns fallback
  const t = useCallback((contentKey: string, fallback?: string): string => {
    const content = cmsContent.find((c: any) => c.content_key === contentKey);
    if (!content) return fallback || contentKey;
    if (!content.is_active) return ''; // DEACTIVATED → empty

    if (locale === "az") return content.content_value;

    const trans = translations.find(
      (tr: any) => tr.content_id === content.id && tr.content_table === "cms_content" && tr.field_name === "content_value"
    );
    return trans?.translated_value || content.content_value;
  }, [cmsContent, translations, locale]);

  // tOptional() - returns null if key doesn't exist or is deactivated
  const tOptional = useCallback((contentKey: string): string | null => {
    const content = cmsContent.find((c: any) => c.content_key === contentKey);
    if (!content || !content.is_active) return null;

    if (locale === "az") return content.content_value;

    const trans = translations.find(
      (tr: any) => tr.content_id === content.id && tr.content_table === "cms_content" && tr.field_name === "content_value"
    );
    return trans?.translated_value || content.content_value;
  }, [cmsContent, translations, locale]);

  // tField() - translate by table/id/field (for any CMS table)
  const tField = useCallback((table: string, contentId: string, field: string, fallback?: string): string => {
    if (locale === "az") return fallback || "";

    const trans = translations.find(
      (tr: any) => tr.content_id === contentId && tr.content_table === table && tr.field_name === field
    );
    return trans?.translated_value || fallback || "";
  }, [translations, locale]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, tOptional, tField, locales: LOCALES }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
