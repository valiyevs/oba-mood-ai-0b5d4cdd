import { useState } from "react";
import { Smile, Meh, Frown } from "lucide-react";
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
    color: "status-good",
  },
  {
    type: "normal" as const,
    icon: Meh,
    label: "Normal",
    description: "Adi gün",
    color: "status-normal",
  },
  {
    type: "bad" as const,
    icon: Frown,
    label: "Pis",
    description: "Çətinlik var",
    color: "status-bad",
  },
];

export const MoodSelector = ({ onMoodSelect, selectedMood }: MoodSelectorProps) => {
  const [hoveredMood, setHoveredMood] = useState<MoodType>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
      {moods.map((mood) => {
        const Icon = mood.icon;
        const isSelected = selectedMood === mood.type;
        const isHovered = hoveredMood === mood.type;

        return (
          <button
            key={mood.type}
            onClick={() => onMoodSelect(mood.type)}
            onMouseEnter={() => setHoveredMood(mood.type)}
            onMouseLeave={() => setHoveredMood(null)}
            className={cn(
              "relative p-8 rounded-2xl border-2 transition-all duration-300",
              "flex flex-col items-center gap-4",
              "hover:scale-105 active:scale-95",
              "focus:outline-none focus:ring-4 focus:ring-primary/20",
              isSelected
                ? `bg-${mood.color} border-${mood.color} text-${mood.color}-foreground shadow-glow`
                : "bg-card border-border hover:border-primary/30 hover:shadow-medium",
              !isSelected && "shadow-soft"
            )}
            style={
              isSelected
                ? {
                    backgroundColor: `hsl(var(--${mood.color}))`,
                    borderColor: `hsl(var(--${mood.color}))`,
                    color: `hsl(var(--${mood.color}-foreground))`,
                  }
                : {}
            }
          >
            <div
              className={cn(
                "transition-transform duration-300",
                isSelected && "scale-110",
                isHovered && !isSelected && "scale-105"
              )}
            >
              <Icon
                className={cn("w-16 h-16", isSelected ? "text-current" : "text-muted-foreground")}
              />
            </div>
            <div className="text-center">
              <h3 className={cn("text-2xl font-bold mb-1", isSelected ? "text-current" : "text-foreground")}>
                {mood.label}
              </h3>
              <p
                className={cn(
                  "text-sm",
                  isSelected ? "text-current opacity-90" : "text-muted-foreground"
                )}
              >
                {mood.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};
