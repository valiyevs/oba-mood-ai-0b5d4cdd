import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AppLogo } from "@/components/AppLogo";
import { ManagerBranchAssignment } from "@/components/ManagerBranchAssignment";
import { MobileNavMenu } from "@/components/MobileNavMenu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSelector } from "@/components/LanguageSelector";

const ManagerAssignments = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-4 min-w-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/hr-panel")}
                className="rounded-xl hover:bg-primary/10 shrink-0 hidden sm:flex"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <AppLogo size="sm" showText={true} />
              <div className="hidden sm:block min-w-0">
                <h1 className="text-xl font-bold text-foreground truncate">Menecer Təyinatları</h1>
                <p className="text-sm text-muted-foreground truncate">Bölgə menecerlərinin idarə edilməsi</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2">
                <LanguageSelector />
                <ThemeToggle />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    await supabase.auth.signOut();
                    navigate("/auth");
                  }}
                  className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:inline">Çıxış</span>
                </Button>
              </div>
              <MobileNavMenu showDatePicker={false} />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <ManagerBranchAssignment />
      </div>
    </div>
  );
};

export default ManagerAssignments;
