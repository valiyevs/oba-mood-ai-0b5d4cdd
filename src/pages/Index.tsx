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

// Branch name mapping
const branchNames: Record<string, string> = {
  'baku': 'Bakı',
  'ganja': 'Gəncə',
  'sumgait': 'Sumqayıt',
  'mingachevir': 'Mingəçevir',
  'shirvan': 'Şirvan',
  'lankaran': 'Lənkəran',
  'shaki': 'Şəki',
  'quba': 'Quba',
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
      const branchName = branchNames[selectedBranch] || selectedBranch;
      
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
          department: branchName, // Filialda şöbə yoxdur, bölgə adı istifadə olunur
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
            department: branchName, // Filialda şöbə yoxdur, bölgə adı istifadə olunur
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
        branchName,
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <AnimatedBackground />
      </div>
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/70 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-lg" />
                <img 
                  src={obaLogo} 
                  alt="OBA Logo" 
                  className="relative w-14 h-14 rounded-2xl shadow-lg object-cover ring-2 ring-border/50"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">OBA Əhval Sistemi</h1>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Gündəlik check-in
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="gap-2 rounded-xl border-border/50 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
            >
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">İdarəetmə Paneli</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12 flex flex-col items-center justify-center min-h-[calc(100vh-140px)]">
        {currentStep === "branch" && (
          <BranchSelector
            onBranchSelect={handleBranchSelect}
            selectedBranch={selectedBranch}
          />
        )}

        {currentStep === "mood" && (
          <div className="w-full max-w-4xl space-y-10">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-sm mb-2">
                <span className="text-5xl">👋</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
                Bu gün necəsən?
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Hisslərini bizimlə paylaş. Cavabın tamamilə <span className="text-primary font-medium">anonim</span> və konfidensiyaldır.
              </p>
            </div>

            <MoodSelector
              onMoodSelect={handleMoodSelect}
              selectedMood={selectedMood}
            />

            <div className="text-center">
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-2 bg-card/50 backdrop-blur-sm rounded-full px-4 py-2 inline-flex">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
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
      <footer className="py-6 text-center text-sm text-muted-foreground border-t border-border/50 bg-card/30 backdrop-blur-sm">
        <p>© 2025 Personal Məmnuniyyət Sistemi. Bütün hüquqlar qorunur.</p>
      </footer>
    </div>
  );
};

export default Index;
