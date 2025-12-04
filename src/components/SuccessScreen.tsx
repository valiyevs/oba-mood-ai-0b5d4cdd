import { CheckCircle2, Shield } from "lucide-react";
import { Button } from "./ui/button";

interface SuccessScreenProps {
  onComplete: () => void;
}

export const SuccessScreen = ({ onComplete }: SuccessScreenProps) => {
  return (
    <div className="w-full max-w-md space-y-8 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="relative">
        <div className="absolute inset-0 blur-3xl opacity-20 bg-primary rounded-full animate-pulse" />
        <CheckCircle2 className="w-24 h-24 mx-auto text-status-good relative" />
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-foreground">
          Təşəkkürlər! 🎉
        </h2>
        <p className="text-lg text-muted-foreground">
          Sizin rəyiniz uğurla qeydə alındı.
        </p>
      </div>

      <div className="bg-accent/50 backdrop-blur-sm rounded-2xl p-6 space-y-3 border border-accent">
        <div className="flex items-center justify-center gap-2 text-accent-foreground">
          <Shield className="w-5 h-5" />
          <span className="font-semibold">Tam Məxfilik</span>
        </div>
        <p className="text-sm text-accent-foreground/80">
          Cavabınız tamamilə anonimdir və yalnız ümumi statistikada istifadə olunur.
        </p>
      </div>

      <Button
        onClick={onComplete}
        size="lg"
        className="w-full gradient-primary text-lg h-14"
      >
        Bağla
      </Button>

      <p className="text-sm text-muted-foreground">
        Görüşənədək! Sabah yenə qarşınızda olacağıq 👋
      </p>
    </div>
  );
};
