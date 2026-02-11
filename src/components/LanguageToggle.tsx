import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(language === "az" ? "en" : "az")}
      className="gap-1.5 rounded-xl text-xs font-semibold px-2.5"
      title={language === "az" ? "Switch to English" : "Azərbaycancaya keç"}
    >
      <Globe className="w-4 h-4" />
      {language === "az" ? "EN" : "AZ"}
    </Button>
  );
};
