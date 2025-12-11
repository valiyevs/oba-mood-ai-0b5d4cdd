import { Smile, Meh, Frown } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type MoodType = "good" | "normal" | "bad" | null;

interface MoodSelectorProps {
  onMoodSelect: (mood: MoodType) => void;
  selectedMood: MoodType;
}

const moods = [
  {
    type: "good" as const,
    icon: Smile,
    label: "Yaxşı",
    description: "Hər şey qaydasında",
    emoji: "😊",
    gradient: "from-emerald-400 to-green-500",
    bgGradient: "from-emerald-500/20 to-green-500/20",
    shadowColor: "shadow-emerald-500/30",
    hoverBg: "hover:bg-emerald-500/10",
  },
  {
    type: "normal" as const,
    icon: Meh,
    label: "Normal",
    description: "Adi gün keçir",
    emoji: "😐",
    gradient: "from-amber-400 to-yellow-500",
    bgGradient: "from-amber-500/20 to-yellow-500/20",
    shadowColor: "shadow-amber-500/30",
    hoverBg: "hover:bg-amber-500/10",
  },
  {
    type: "bad" as const,
    icon: Frown,
    label: "Pis",
    description: "Çətinliklər var",
    emoji: "😔",
    gradient: "from-rose-400 to-red-500",
    bgGradient: "from-rose-500/20 to-red-500/20",
    shadowColor: "shadow-rose-500/30",
    hoverBg: "hover:bg-rose-500/10",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
} as const;

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 200,
      damping: 20,
    },
  },
};

export const MoodSelector = ({ onMoodSelect, selectedMood }: MoodSelectorProps) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 w-full max-w-4xl"
    >
      {moods.map((mood) => {
        const Icon = mood.icon;
        const isSelected = selectedMood === mood.type;

        return (
          <motion.button
            key={mood.type}
            variants={cardVariants}
            onClick={() => onMoodSelect(mood.type)}
            whileHover={{ scale: 1.03, y: -8 }}
            whileTap={{ scale: 0.97 }}
            className={cn(
              "relative group p-8 md:p-10 rounded-3xl border-2 transition-all duration-500",
              "flex flex-col items-center gap-5",
              "focus:outline-none focus:ring-4 focus:ring-primary/20",
              "overflow-hidden",
              isSelected
                ? `border-transparent shadow-2xl ${mood.shadowColor}`
                : `border-border/50 bg-card/80 backdrop-blur-sm ${mood.hoverBg} hover:shadow-xl hover:border-transparent`
            )}
          >
            {/* Background Gradient */}
            <div className={cn(
              "absolute inset-0 bg-gradient-to-br transition-opacity duration-500",
              mood.bgGradient,
              isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-50"
            )} />
            
            {/* Animated Circles Background */}
            <div className="absolute inset-0 overflow-hidden">
              <div className={cn(
                "absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl transition-opacity duration-500",
                `bg-gradient-to-br ${mood.gradient}`,
                isSelected ? "opacity-30" : "opacity-0 group-hover:opacity-20"
              )} />
              <div className={cn(
                "absolute -bottom-20 -left-20 w-40 h-40 rounded-full blur-3xl transition-opacity duration-500",
                `bg-gradient-to-br ${mood.gradient}`,
                isSelected ? "opacity-20" : "opacity-0 group-hover:opacity-10"
              )} />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center gap-5">
              {/* Emoji with Glow */}
              <motion.div
                animate={isSelected ? { 
                  scale: [1, 1.1, 1],
                  rotate: [0, -5, 5, 0]
                } : {}}
                transition={{ duration: 0.5, repeat: isSelected ? Infinity : 0, repeatDelay: 2 }}
                className="relative"
              >
                <span className="text-7xl md:text-8xl drop-shadow-lg">{mood.emoji}</span>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className={cn(
                      "absolute inset-0 rounded-full",
                      `bg-gradient-to-br ${mood.gradient}`
                    )}
                  />
                )}
              </motion.div>

              {/* Label */}
              <div className="text-center space-y-2">
                <motion.h3
                  className={cn(
                    "text-2xl md:text-3xl font-bold transition-all duration-300",
                    isSelected 
                      ? `bg-gradient-to-r ${mood.gradient} bg-clip-text text-transparent` 
                      : "text-foreground group-hover:text-foreground"
                  )}
                >
                  {mood.label}
                </motion.h3>
                <p className={cn(
                  "text-sm md:text-base transition-colors duration-300",
                  isSelected ? "text-foreground/80" : "text-muted-foreground"
                )}>
                  {mood.description}
                </p>
              </div>
            </div>

            {/* Selection Ring */}
            {isSelected && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={cn(
                  "absolute inset-0 rounded-3xl border-4",
                  mood.type === "good" && "border-emerald-500",
                  mood.type === "normal" && "border-amber-500",
                  mood.type === "bad" && "border-rose-500"
                )}
              />
            )}
          </motion.button>
        );
      })}
    </motion.div>
  );
};
