import { useState } from "react";
import { User, Briefcase, Clock, Users, Building, MoreHorizontal, ArrowLeft, Send } from "lucide-react";
import { motion } from "framer-motion";
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
    gradient: "from-violet-500 to-purple-500",
  },
  {
    type: "workload" as const,
    icon: Briefcase,
    label: "İş yükü",
    description: "Çox iş, stress",
    gradient: "from-orange-500 to-red-500",
  },
  {
    type: "schedule" as const,
    icon: Clock,
    label: "Qrafik",
    description: "İş saatları problemi",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    type: "team" as const,
    icon: Users,
    label: "Komanda",
    description: "Həmkarlarla münasibət",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    type: "conditions" as const,
    icon: Building,
    label: "Şərtlər",
    description: "İş mühiti",
    gradient: "from-slate-500 to-gray-500",
  },
  {
    type: "other" as const,
    icon: MoreHorizontal,
    label: "Digər",
    description: "Başqa səbəb",
    gradient: "from-pink-500 to-rose-500",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 24,
    },
  },
};

export const ReasonSelector = ({ onReasonSelect, onBack }: ReasonSelectorProps) => {
  const [selectedReason, setSelectedReason] = useState<ReasonType | null>(null);
  const [customText, setCustomText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReasonClick = (reason: ReasonType) => {
    setSelectedReason(reason);
    if (reason !== "other") {
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl space-y-8"
    >
      {/* Header */}
      <div className="text-center space-y-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.1 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500/20 to-red-500/20 backdrop-blur-sm"
        >
          <span className="text-4xl">💭</span>
        </motion.div>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          Nə baş verib?
        </h2>
        <p className="text-lg text-muted-foreground">
          Səbəbi seçin • <span className="text-primary">Tamamilə anonim</span>
        </p>
      </div>

      {/* Reason Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-3 gap-4"
      >
        {reasons.map((reason) => {
          const Icon = reason.icon;
          const isSelected = selectedReason === reason.type;

          return (
            <motion.button
              key={reason.type}
              variants={itemVariants}
              onClick={() => handleReasonClick(reason.type)}
              disabled={isSubmitting}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "relative group p-6 md:p-7 rounded-2xl border-2 transition-all duration-300",
                "flex flex-col items-center gap-4",
                "focus:outline-none focus:ring-4 focus:ring-primary/20",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "overflow-hidden",
                isSelected
                  ? "border-transparent shadow-xl"
                  : "border-border/50 bg-card/80 backdrop-blur-sm hover:border-transparent hover:shadow-lg"
              )}
            >
              {/* Gradient Background */}
              <div className={cn(
                "absolute inset-0 bg-gradient-to-br transition-opacity duration-500",
                reason.gradient,
                isSelected ? "opacity-20" : "opacity-0 group-hover:opacity-10"
              )} />

              {/* Icon Container */}
              <motion.div
                animate={isSelected ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.3 }}
                className={cn(
                  "relative w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300",
                  isSelected 
                    ? `bg-gradient-to-br ${reason.gradient} shadow-lg` 
                    : "bg-muted/50 group-hover:bg-muted"
                )}
              >
                <Icon className={cn(
                  "w-7 h-7 transition-colors duration-300",
                  isSelected ? "text-white" : "text-muted-foreground group-hover:text-foreground"
                )} />
              </motion.div>

              {/* Text */}
              <div className="relative text-center">
                <h3 className={cn(
                  "text-lg font-bold mb-1 transition-colors duration-300",
                  isSelected ? "text-foreground" : "text-foreground"
                )}>
                  {reason.label}
                </h3>
                <p className={cn(
                  "text-xs transition-colors duration-300",
                  isSelected ? "text-foreground/70" : "text-muted-foreground"
                )}>
                  {reason.description}
                </p>
              </div>

              {/* Selection Indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                >
                  <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Custom Text Input for "Other" */}
      {selectedReason === "other" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4"
        >
          <Textarea
            placeholder="Zəhmət olmasa qısaca yazın... (ixtiyari)"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            className="min-h-[120px] resize-none text-base rounded-xl border-2 border-border/50 focus:border-primary/50 bg-card/80 backdrop-blur-sm"
          />
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex-1 h-12 rounded-xl gap-2"
              disabled={isSubmitting}
            >
              <ArrowLeft className="w-4 h-4" />
              Geri
            </Button>
            <Button
              onClick={() => handleSubmit()}
              disabled={isSubmitting}
              className="flex-1 h-12 rounded-xl gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Göndərilir...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Göndər
                </>
              )}
            </Button>
          </div>
        </motion.div>
      )}

      {/* Back Button */}
      {selectedReason && selectedReason !== "other" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Button
            variant="ghost"
            onClick={onBack}
            disabled={isSubmitting}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Geri qayıt
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};
