import { AlertCircle, TrendingUp, CheckCircle2, Lightbulb, RefreshCw, Loader2, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";

interface AIAnalysis {
  score: number;
  summary: string;
  observations: string[];
  recommendations: string[];
  riskLevel: string;
  criticalAlerts?: string[];
}

interface AIAnalysisCardProps {
  analysis: AIAnalysis | null;
  isLoading: boolean;
  onRefresh: () => void;
}

export const AIAnalysisCard = ({ analysis, isLoading, onRefresh }: AIAnalysisCardProps) => {
  const { t } = useLanguage();
  const getRiskLevelConfig = (level: string) => {
    const normalizedLevel = level?.toLowerCase();
    switch (normalizedLevel) {
      case 'critical':
      case 'kritik':
        return {
          label: t("aiAnalysis.critical"),
          bgColor: 'bg-destructive/10',
          textColor: 'text-destructive',
          borderColor: 'border-destructive',
          progressColor: 'bg-destructive',
          icon: AlertCircle,
        };
      case 'high':
      case 'yüksək':
        return {
          label: t("aiAnalysis.high"),
          bgColor: 'bg-orange-500/10',
          textColor: 'text-orange-600',
          borderColor: 'border-orange-500',
          progressColor: 'bg-orange-500',
          icon: AlertTriangle,
        };
      case 'medium':
      case 'orta':
        return {
          label: t("aiAnalysis.medium"),
          bgColor: 'bg-yellow-500/10',
          textColor: 'text-yellow-600',
          borderColor: 'border-yellow-500',
          progressColor: 'bg-yellow-500',
          icon: AlertTriangle,
        };
      default:
        return {
          label: t("aiAnalysis.low"),
          bgColor: 'bg-primary/10',
          textColor: 'text-primary',
          borderColor: 'border-primary',
          progressColor: 'bg-primary',
          icon: CheckCircle2,
        };
    }
  };

  const riskConfig = analysis ? getRiskLevelConfig(analysis.riskLevel) : null;
  const RiskIcon = riskConfig?.icon || AlertCircle;

  // Calculate inverse score for risk display (higher score = higher risk)
  const riskScore = analysis ? Math.max(0, 100 - analysis.score) : 0;

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300",
      analysis?.riskLevel?.toLowerCase() === 'critical' || analysis?.riskLevel?.toLowerCase() === 'kritik'
        ? "border-destructive/50 bg-gradient-to-br from-destructive/5 via-background to-destructive/10" 
        : "border-border/50 bg-card"
    )}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2.5 rounded-xl",
              riskConfig?.bgColor || "bg-muted"
            )}>
              <RiskIcon className={cn("h-6 w-6", riskConfig?.textColor || "text-muted-foreground")} />
            </div>
            <div>
              <CardTitle className="text-foreground text-xl">{t("aiAnalysis.title")}</CardTitle>
              <CardDescription>{t("aiAnalysis.description")}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {analysis && riskConfig && (
              <div className={cn(
                "px-3 py-1.5 rounded-full border text-sm font-medium flex items-center gap-1.5",
                riskConfig.bgColor,
                riskConfig.textColor,
                riskConfig.borderColor
              )}>
                <RiskIcon className="h-4 w-4" />
                {riskConfig.label}
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onRefresh}
              disabled={isLoading}
              className="h-9 w-9"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
              <AlertCircle className="h-16 w-16 text-primary relative animate-pulse" />
            </div>
            <p className="mt-6 text-lg font-medium text-foreground">{t("aiAnalysis.analyzing")}</p>
            <p className="text-sm text-muted-foreground mt-2">{t("aiAnalysis.processingData")}</p>
          </div>
        ) : analysis ? (
          <>
            {/* Risk Score with Progress Bar */}
            <div className="bg-muted/30 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-muted-foreground">{t("aiAnalysis.riskScore")}</span>
                <span className={cn(
                  "text-3xl font-bold",
                  riskConfig?.textColor || "text-foreground"
                )}>
                  {riskScore}/100
                </span>
              </div>
              <div className="relative h-3 rounded-full bg-muted overflow-hidden">
                <div 
                  className={cn(
                    "absolute inset-y-0 left-0 rounded-full transition-all duration-500",
                    riskConfig?.progressColor || "bg-primary"
                  )}
                  style={{ width: `${riskScore}%` }}
                />
              </div>
            </div>

            {/* Critical Alerts Section */}
            {analysis.criticalAlerts && analysis.criticalAlerts.length > 0 && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <h3 className="font-semibold text-destructive">{t("aiAnalysis.criticalAlerts")}</h3>
                </div>
                <ul className="space-y-2">
                  {analysis.criticalAlerts.map((alert, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-destructive">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-destructive flex-shrink-0" />
                      <span>{alert}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Observations */}
            {analysis.observations && analysis.observations.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">{t("aiAnalysis.observations")}</h3>
                </div>
                <ul className="space-y-2">
                  {analysis.observations.map((observation, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      <span>{observation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {analysis.recommendations && analysis.recommendations.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="h-5 w-5 text-status-good" />
                  <h3 className="font-semibold text-foreground">{t("aiAnalysis.recommendations")}</h3>
                </div>
                <ul className="space-y-2">
                  {analysis.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-status-good flex-shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{t("aiAnalysis.noAnalysis")}</p>
            <Button variant="outline" size="sm" onClick={onRefresh} className="mt-4">
              {t("aiAnalysis.analyze")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
