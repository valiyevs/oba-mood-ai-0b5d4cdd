import { useState } from "react";
import { User, Briefcase, Clock, Users, Building, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

export type ReasonType = "manager" | "workload" | "schedule" | "team" | "conditions" | "other";

interface ReasonSelectorProps {
  onReasonSelect: (reason: ReasonType, customText?: string) => void;
  onBack: () => void;
}

const reasons = [
  {
    type: "manager" as const,
    icon: User,
    label: "Menecer",
    description: "İdarəetmə ilə bağlı",
  },
  {
    type: "workload" as const,
    icon: Briefcase,
    label: "İş yükü",
    description: "Çox iş, stress",
  },
  {
    type: "schedule" as const,
    icon: Clock,
    label: "Qrafik",
    description: "İş saatları problemi",
  },
  {
    type: "team" as const,
    icon: Users,
    label: "Komanda",
    description: "Həmkarlarla münasibət",
  },
  {
    type: "conditions" as const,
    icon: Building,
    label: "Şərtlər",
    description: "İş mühiti",
  },
  {
    type: "other" as const,
    icon: MoreHorizontal,
    label: "Digər",
    description: "Başqa səbəb",
  },
];

export const ReasonSelector = ({ onReasonSelect, onBack }: ReasonSelectorProps) => {
  const [selectedReason, setSelectedReason] = useState<ReasonType | null>(null);
  const [customText, setCustomText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReasonClick = (reason: ReasonType) => {
    setSelectedReason(reason);
    if (reason !== "other") {
      // Auto-submit for predefined reasons
      handleSubmit(reason);
    }
  };

  const handleSubmit = (reason: ReasonType = selectedReason!) => {
    if (!reason) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      onReasonSelect(reason, reason === "other" ? customText : undefined);
      setIsSubmitting(false);
    }, 300);
  };

  return (
    <div className="w-full max-w-3xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl font-bold text-foreground">Nə baş verib?</h2>
        <p className="text-muted-foreground">
          Səbəbi seçin (tamamilə anonim)
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {reasons.map((reason) => {
          const Icon = reason.icon;
          const isSelected = selectedReason === reason.type;

          return (
            <button
              key={reason.type}
              onClick={() => handleReasonClick(reason.type)}
              disabled={isSubmitting}
              className={cn(
                "relative p-6 rounded-xl border-2 transition-all duration-300",
                "flex flex-col items-center gap-3",
                "hover:scale-105 active:scale-95",
                "focus:outline-none focus:ring-4 focus:ring-primary/20",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                isSelected
                  ? "bg-primary border-primary text-primary-foreground shadow-glow"
                  : "bg-card border-border hover:border-primary/30 hover:shadow-medium shadow-soft"
              )}
            >
              <Icon
                className={cn(
                  "w-8 h-8 transition-transform duration-300",
                  isSelected ? "text-current scale-110" : "text-muted-foreground"
                )}
              />
              <div className="text-center">
                <h3 className={cn("text-base font-semibold mb-0.5", isSelected ? "text-current" : "text-foreground")}>
                  {reason.label}
                </h3>
                <p
                  className={cn(
                    "text-xs",
                    isSelected ? "text-current opacity-90" : "text-muted-foreground"
                  )}
                >
                  {reason.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {selectedReason === "other" && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Textarea
            placeholder="Zəhmət olmasa qısaca yazın... (ixtiyari)"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            className="min-h-[100px] resize-none"
          />
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex-1"
              disabled={isSubmitting}
            >
              Geri
            </Button>
            <Button
              onClick={() => handleSubmit()}
              disabled={isSubmitting}
              className="flex-1 gradient-primary"
            >
              {isSubmitting ? "Göndərilir..." : "Göndər"}
            </Button>
          </div>
        </div>
      )}

      {selectedReason && selectedReason !== "other" && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={onBack}
            disabled={isSubmitting}
          >
            Geri
          </Button>
        </div>
      )}
    </div>
  );
};
