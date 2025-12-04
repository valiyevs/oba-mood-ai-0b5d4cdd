import { useState } from "react";
import { MoodSelector, type MoodType } from "@/components/MoodSelector";
import { ReasonSelector, type ReasonType } from "@/components/ReasonSelector";
import { SuccessScreen } from "@/components/SuccessScreen";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import obaLogo from "@/assets/oba-logo.jpg";

type StepType = "mood" | "reason" | "success";

const Index = () => {
  const [currentStep, setCurrentStep] = useState<StepType>("mood");
  const [selectedMood, setSelectedMood] = useState<MoodType>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleMoodSelect = (mood: MoodType) => {
    setSelectedMood(mood);
    
    if (mood === "bad") {
      // If bad mood, ask for reason
      setTimeout(() => setCurrentStep("reason"), 300);
    } else {
      // If good or normal, go directly to success
      setTimeout(() => handleSubmit(mood), 300);
    }
  };

  const handleReasonSelect = (reason: ReasonType, customText?: string) => {
    handleSubmit(selectedMood, reason, customText);
  };

  const handleSubmit = (mood: MoodType, reason?: ReasonType, customText?: string) => {
    // Here we would send data to backend
    console.log("Submitting:", { mood, reason, customText, timestamp: new Date() });
    
    // Show toast notification
    const moodText = mood === "good" ? "Yaxşı" : mood === "normal" ? "Normal" : "Pis";
    toast({
      title: "Cavabınız qeydə alındı! ✓",
      description: `Əhval: ${moodText}${reason ? ` • Səbəb: ${reason}` : ""}`,
    });
    
    // Show success screen
    setCurrentStep("success");
  };

  const handleComplete = () => {
    // Reset for next day
    setCurrentStep("mood");
    setSelectedMood(null);
  };

  const handleBack = () => {
    setCurrentStep("mood");
    setSelectedMood(null);
  };

  return (
    <div className="min-h-screen gradient-subtle relative">
      <AnimatedBackground />
      
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-lg border-b border-border shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src={obaLogo} 
                alt="OBA Logo" 
                className="w-12 h-12 rounded-xl shadow-glow object-cover"
              />
              <div>
                <h1 className="text-lg font-bold text-foreground">OBA Əhval Sistemi</h1>
                <p className="text-xs text-muted-foreground">Gündəlik check-in</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        {currentStep === "mood" && (
          <div className="w-full max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-3">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                Bu gün necəsən? 👋
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Hisslərini bizimlə paylaş. Cavabın tamamilə anonim və konfidensiyaldır.
              </p>
            </div>

            <MoodSelector
              onMoodSelect={handleMoodSelect}
              selectedMood={selectedMood}
            />

            <div className="text-center">
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-status-good animate-pulse" />
                Hər gün bir dəfə doldurulur
              </p>
            </div>
          </div>
        )}

        {currentStep === "reason" && (
          <ReasonSelector
            onReasonSelect={handleReasonSelect}
            onBack={handleBack}
          />
        )}

        {currentStep === "success" && (
          <SuccessScreen onComplete={handleComplete} />
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-muted-foreground border-t border-border bg-card/50 backdrop-blur-sm">
        <p>© 2025 Personal Məmnuniyyət Sistemi. Bütün hüquqlar qorunur.</p>
      </footer>
    </div>
  );
};

export default Index;
