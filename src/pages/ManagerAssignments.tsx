import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import obaLogo from "@/assets/oba-logo.jpg";
import { ManagerBranchAssignment } from "@/components/ManagerBranchAssignment";
import { MobileNavMenu } from "@/components/MobileNavMenu";
import { useLanguage } from "@/hooks/useLanguage";

const ManagerAssignments = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-4 min-w-0">
              <img src={obaLogo} alt="OBA" className="h-12 w-auto object-contain flex-shrink-0" />
              <div className="min-w-0">
                <h1 className="text-2xl font-bold text-foreground truncate">{t("assignments.title")}</h1>
                <p className="text-sm text-muted-foreground truncate">{t("assignments.subtitle")}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => navigate("/hr-panel")} className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  {t("common.hrPanel")}
                </Button>
                <Button variant="ghost" size="sm" onClick={async () => { await supabase.auth.signOut(); navigate("/auth"); }} className="gap-2 text-destructive hover:text-destructive">
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:inline">{t("common.logout")}</span>
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
