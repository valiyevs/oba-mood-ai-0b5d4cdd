import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Smartphone, Share, Plus, ArrowRight, Check, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const Install = () => {
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) setIsInstalled(true);
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);
    const handleBeforeInstallPrompt = (e: Event) => { e.preventDefault(); setDeferredPrompt(e as BeforeInstallPromptEvent); };
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setIsInstalled(true);
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Card className="border-primary/20">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/25">
              <Smartphone className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl">{t("installPage.title")}</CardTitle>
            <CardDescription>{t("installPage.subtitle")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isInstalled ? (
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center"><Check className="w-8 h-8 text-green-500" /></div>
                <p className="text-lg font-medium text-green-600">{t("installPage.alreadyInstalled")}</p>
                <Button onClick={() => navigate("/")} className="w-full gap-2"><Home className="w-4 h-4" />{t("installPage.goToHome")}</Button>
              </motion.div>
            ) : isIOS ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground text-center mb-4">{t("installPage.iosInstructions")}</p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0"><Share className="w-4 h-4 text-primary" /></div>
                    <div><p className="font-medium">{t("installPage.step1ShareBtn")}</p><p className="text-sm text-muted-foreground">{t("installPage.step1ShareDesc")}</p></div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0"><Plus className="w-4 h-4 text-primary" /></div>
                    <div><p className="font-medium">{t("installPage.step2AddHome")}</p><p className="text-sm text-muted-foreground">{t("installPage.step2AddHomeDesc")}</p></div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0"><ArrowRight className="w-4 h-4 text-primary" /></div>
                    <div><p className="font-medium">{t("installPage.step3Confirm")}</p><p className="text-sm text-muted-foreground">{t("installPage.step3ConfirmDesc")}</p></div>
                  </div>
                </div>
              </div>
            ) : deferredPrompt ? (
              <div className="space-y-4">
                <Button onClick={handleInstall} className="w-full gap-2" size="lg"><Download className="w-5 h-5" />{t("installPage.installBtn")}</Button>
                <p className="text-xs text-center text-muted-foreground">{t("installPage.installNote")}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground text-center mb-4">{t("installPage.androidInstructions")}</p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0"><span className="text-primary font-bold">⋮</span></div>
                    <div><p className="font-medium">{t("installPage.step1Menu")}</p><p className="text-sm text-muted-foreground">{t("installPage.step1MenuDesc")}</p></div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0"><Download className="w-4 h-4 text-primary" /></div>
                    <div><p className="font-medium">{t("installPage.step2Install")}</p><p className="text-sm text-muted-foreground">{t("installPage.step2InstallDesc")}</p></div>
                  </div>
                </div>
              </div>
            )}
            <div className="pt-4 border-t border-border">
              <Button variant="ghost" onClick={() => navigate("/")} className="w-full">{t("installPage.continueOnWeb")}</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Install;
