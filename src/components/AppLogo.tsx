import moodaiLogo from "@/assets/moodai-logo.png";
import { cn } from "@/lib/utils";

interface AppLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { img: "w-8 h-8", text: "text-base", sub: "text-xs" },
  md: { img: "w-10 h-10", text: "text-lg", sub: "text-xs" },
  lg: { img: "w-14 h-14", text: "text-xl", sub: "text-sm" },
};

export const AppLogo = ({ size = "md", showText = true, className }: AppLogoProps) => {
  const s = sizeMap[size];
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/40 to-primary/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative flex items-center justify-center rounded-xl p-1">
          <img
            src={moodaiLogo}
            alt="MoodAI"
            className={cn("object-contain", s.img)}
            style={{ background: "transparent" }}
          />
        </div>
      </div>
      {showText && (
        <div>
          <h1 className={cn("font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent leading-tight", s.text)}>
            MoodAI
          </h1>
        </div>
      )}
    </div>
  );
};
