import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Brain } from "lucide-react";
import { PredictiveAnalytics } from "@/components/PredictiveAnalytics";
import { MobileNavMenu } from "@/components/MobileNavMenu";
import { useLanguage } from "@/hooks/useLanguage";

const Analytics = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="hover:bg-primary/10 hidden sm:flex">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/20">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">{t("predictive.analyticsPage.title")}</h1>
                <p className="text-sm text-muted-foreground hidden sm:block">{t("predictive.analyticsPage.subtitle")}</p>
              </div>
            </div>
          </div>
          <MobileNavMenu />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <PredictiveAnalytics />
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-8 p-6 rounded-lg bg-muted/30 border border-border/50">
          <h3 className="font-semibold mb-2">{t("predictive.analyticsPage.howItWorks")}</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• <strong>{t("predictive.analyticsPage.dataCollection")}</strong> {t("predictive.analyticsPage.dataCollectionDesc")}</li>
            <li>• <strong>{t("predictive.analyticsPage.correlationAnalysis")}</strong> {t("predictive.analyticsPage.correlationAnalysisDesc")}</li>
            <li>• <strong>{t("predictive.analyticsPage.aiForecast")}</strong> {t("predictive.analyticsPage.aiForecastDesc")}</li>
            <li>• <strong>{t("predictive.analyticsPage.recommendationsLabel")}</strong> {t("predictive.analyticsPage.recommendationsDesc")}</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
