import { MapPin } from "lucide-react";

export type BranchType = string | null;

const branches = [
  { id: "baku", name: "Bakı", icon: "🏙️" },
  { id: "ganja", name: "Gəncə", icon: "🌆" },
  { id: "sumgait", name: "Sumqayıt", icon: "🏭" },
  { id: "mingachevir", name: "Mingəçevir", icon: "⚡" },
  { id: "shirvan", name: "Şirvan", icon: "🌾" },
  { id: "lankaran", name: "Lənkəran", icon: "🌊" },
  { id: "shaki", name: "Şəki", icon: "🏔️" },
  { id: "quba", name: "Quba", icon: "🍎" },
];

interface BranchSelectorProps {
  onBranchSelect: (branch: BranchType) => void;
  selectedBranch: BranchType;
}

export const BranchSelector = ({ onBranchSelect, selectedBranch }: BranchSelectorProps) => {
  return (
    <div className="w-full max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <MapPin className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          Hansı bölgədənsən? 📍
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Sorğunu göndərmək üçün öncə bölgəni seç
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {branches.map((branch) => (
          <button
            key={branch.id}
            onClick={() => onBranchSelect(branch.id)}
            className={`
              group relative p-6 rounded-2xl border-2 transition-all duration-300
              hover:scale-105 hover:shadow-lg
              ${selectedBranch === branch.id 
                ? "border-primary bg-primary/10 shadow-glow" 
                : "border-border bg-card hover:border-primary/50"
              }
            `}
          >
            <div className="flex flex-col items-center gap-3">
              <span className="text-4xl">{branch.icon}</span>
              <span className={`
                font-semibold text-lg transition-colors
                ${selectedBranch === branch.id ? "text-primary" : "text-foreground"}
              `}>
                {branch.name}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
