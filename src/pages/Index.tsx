import { useState } from "react";
import { MoodSelector, type MoodType } from "@/components/MoodSelector";
import { ReasonSelector, type ReasonType } from "@/components/ReasonSelector";
import { BranchSelector, type BranchType } from "@/components/BranchSelector";
import { SuccessScreen } from "@/components/SuccessScreen";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import obaLogo from "@/assets/oba-logo.jpg";

type StepType = "branch" | "mood" | "reason" | "success";

// Department mapping based on branch
const getDepartmentFromBranch = (branch: BranchType): string => {
  const departments = ["Satış", "Texniki", "Logistika", "İnsan Resursları"];
  // Random department for demo purposes - in real app this would come from user profile
  return departments[Math.floor(Math.random() * departments.length)];
};

// Generate employee code (in real app, this would come from user session/profile)
const generateEmployeeCode = (): string => {
  return `EMP${String(Math.floor(Math.random() * 9000) + 1000)}`;
};

const Index = () => {
  const [currentStep, setCurrentStep] = useState<StepType>("branch");
  const [selectedBranch, setSelectedBranch] = useState<BranchType>(null);
  const [selectedMood, setSelectedMood] = useState<MoodType>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleBranchSelect = (branch: BranchType) => {
    setSelectedBranch(branch);
    setTimeout(() => setCurrentStep("mood"), 300);
  };

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

  const handleSubmit = async (mood: MoodType, reason?: ReasonType, customText?: string) => {
    if (isSubmitting || !selectedBranch || !mood) return;
    
    setIsSubmitting(true);
    
    try {
      const employeeCode = generateEmployeeCode();
      const department = getDepartmentFromBranch(selectedBranch);
      
      // Map mood to Azerbaijani
      const moodMap: Record<string, string> = {
        good: "Yaxşı",
        normal: "Normal",
        bad: "Pis"
      };
      
      // Map reason category to Azerbaijani
      const reasonMap: Record<string, string> = {
        workload: "İş yükü",
        schedule: "Qrafik",
        manager: "Menecer",
        team: "Komanda",
        other: "Digər"
      };

      // 1. Save employee response to database
      const { error: responseError } = await supabase
        .from("employee_responses")
        .insert({
          employee_code: employeeCode,
          branch: selectedBranch,
          department: department,
          mood: moodMap[mood] || mood,
          reason: customText || null,
          reason_category: reason ? (reasonMap[reason] || reason) : null,
        });

      if (responseError) {
        console.error("Error saving response:", responseError);
        throw responseError;
      }

      // 2. If bad mood, create a burnout alert
      if (mood === "bad" && reason) {
        const riskScore = 70 + Math.floor(Math.random() * 25); // 70-95 risk score for bad mood
        
        const { error: alertError } = await supabase
          .from("burnout_alerts")
          .insert({
            employee_code: employeeCode,
            branch: selectedBranch,
            department: department,
            reason_category: reasonMap[reason] || reason,
            risk_score: riskScore,
            is_resolved: false,
          });

        if (alertError) {
          console.error("Error creating burnout alert:", alertError);
          // Don't throw - the main response was saved successfully
        }
      }

      console.log("Submitted successfully:", { 
        mood, 
        reason, 
        customText, 
        branch: selectedBranch, 
        department,
        employeeCode,
        timestamp: new Date() 
      });
      
      // Show success screen
      setCurrentStep("success");
    } catch (error) {
      console.error("Failed to submit:", error);
      // Still show success for UX (silent failure as per memory)
      setCurrentStep("success");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplete = () => {
    // Reset for next day
    setCurrentStep("branch");
    setSelectedBranch(null);
    setSelectedMood(null);
  };

  const handleBack = () => {
    if (currentStep === "reason") {
      setCurrentStep("mood");
      setSelectedMood(null);
    } else if (currentStep === "mood") {
      setCurrentStep("branch");
      setSelectedBranch(null);
    }
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
        {currentStep === "branch" && (
          <BranchSelector
            onBranchSelect={handleBranchSelect}
            selectedBranch={selectedBranch}
          />
        )}

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
