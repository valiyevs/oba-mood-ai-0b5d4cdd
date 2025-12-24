import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, TrendingUp, TrendingDown, Minus, AlertTriangle, Brain, RefreshCw, Target, Users, ShoppingCart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface Prediction {
  stressChangePercent: number;
  complaintRiskPercent: number;
  salesImpactPercent: number;
  predictionText: string;
  confidenceScore: number;
  factors?: {
    stressTrend?: string;
    salesTrend?: string;
    complaintTrend?: string;
    keyRisks?: string[];
    recommendations?: string[];
  };
}

interface Metrics {
  totalResponses: number;
  avgMoodScore: number;
  stressChange: number;
  salesTrend: number;
  avgComplaints: number;
}

const branches = [
  "Bakı - Nərimanov",
  "Bakı - Yasamal",
  "Sumqayıt",
  "Gəncə",
  "Lənkəran"
];

const TrendIcon = ({ trend }: { trend?: string }) => {
  if (trend === "artan") return <TrendingUp className="h-4 w-4 text-red-500" />;
  if (trend === "azalan") return <TrendingDown className="h-4 w-4 text-green-500" />;
  return <Minus className="h-4 w-4 text-muted-foreground" />;
};

export const PredictiveAnalytics = () => {
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [source, setSource] = useState<string>("");
  const { toast } = useToast();

  const runPrediction = async () => {
    if (!selectedBranch) {
      toast({
        title: "Filial seçin",
        description: "Proqnoz üçün filial seçməlisiniz",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("predict-risk", {
        body: { branch: selectedBranch }
      });

      if (error) throw error;

      setPrediction(data.prediction);
      setMetrics(data.metrics);
      setSource(data.source);

      toast({
        title: "Proqnoz hazırdır",
        description: data.source === "ai" ? "AI analizi tamamlandı" : "Əsas hesablama ilə proqnoz hazırlandı"
      });
    } catch (err) {
      console.error("Prediction error:", err);
      toast({
        title: "Xəta",
        description: "Proqnoz hesablana bilmədi",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk: number) => {
    if (risk >= 80) return "text-red-500";
    if (risk >= 60) return "text-orange-500";
    if (risk >= 40) return "text-yellow-500";
    return "text-green-500";
  };

  const getRiskBadge = (risk: number) => {
    if (risk >= 80) return { variant: "destructive" as const, text: "Kritik" };
    if (risk >= 60) return { variant: "default" as const, text: "Yüksək" };
    if (risk >= 40) return { variant: "secondary" as const, text: "Orta" };
    return { variant: "outline" as const, text: "Aşağı" };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-primary/20">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Proqnozlaşdırıcı Analitika</CardTitle>
              <CardDescription>
                Stress və satış məlumatlarının korrelyasiyası əsasında risk proqnozu
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger className="w-full sm:w-[250px]">
                <SelectValue placeholder="Filial seçin" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={runPrediction} disabled={loading || !selectedBranch}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Hesablanır...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Proqnoz al
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence mode="wait">
        {prediction && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Main Prediction Card */}
            <Card className="border-2 border-primary/30">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className={getRiskColor(prediction.complaintRiskPercent)} />
                    Risk Proqnozu
                  </CardTitle>
                  <Badge {...getRiskBadge(prediction.complaintRiskPercent)}>
                    {getRiskBadge(prediction.complaintRiskPercent).text} Risk
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium mb-4">{prediction.predictionText}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {/* Complaint Risk */}
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Şikayət Riski</span>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className={`text-3xl font-bold ${getRiskColor(prediction.complaintRiskPercent)}`}>
                      {prediction.complaintRiskPercent.toFixed(0)}%
                    </div>
                    <Progress 
                      value={prediction.complaintRiskPercent} 
                      className="mt-2 h-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Növbəti 3 gün</p>
                  </div>

                  {/* Stress Change */}
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Stress Dəyişimi</span>
                      <TrendIcon trend={prediction.factors?.stressTrend} />
                    </div>
                    <div className={`text-3xl font-bold ${prediction.stressChangePercent > 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {prediction.stressChangePercent > 0 ? '+' : ''}{prediction.stressChangePercent.toFixed(1)}%
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Son 7 gün</p>
                  </div>

                  {/* Sales Impact */}
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Satış Təsiri</span>
                      <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className={`text-3xl font-bold ${prediction.salesImpactPercent > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {prediction.salesImpactPercent > 0 ? '+' : ''}{prediction.salesImpactPercent.toFixed(1)}%
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Gözlənilən</p>
                  </div>
                </div>

                {/* Confidence Score */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Target className="h-4 w-4" />
                  Etibarlılıq: {prediction.confidenceScore?.toFixed(0) || 50}%
                  {source === "fallback" && (
                    <Badge variant="outline" className="ml-2">Əsas hesablama</Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Factors & Recommendations */}
            {prediction.factors && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Trends */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Trendlər</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Stress</span>
                      <div className="flex items-center gap-2">
                        <TrendIcon trend={prediction.factors.stressTrend} />
                        <span className="capitalize">{prediction.factors.stressTrend || "Sabit"}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Satış</span>
                      <div className="flex items-center gap-2">
                        <TrendIcon trend={prediction.factors.salesTrend} />
                        <span className="capitalize">{prediction.factors.salesTrend || "Sabit"}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Şikayətlər</span>
                      <div className="flex items-center gap-2">
                        <TrendIcon trend={prediction.factors.complaintTrend} />
                        <span className="capitalize">{prediction.factors.complaintTrend || "Sabit"}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Risks & Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Risklər və Tövsiyyələr</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {prediction.factors.keyRisks && prediction.factors.keyRisks.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-red-600 mb-2">Əsas Risklər:</p>
                        <ul className="space-y-1">
                          {prediction.factors.keyRisks.map((risk, i) => (
                            <li key={i} className="text-sm flex items-start gap-2">
                              <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                              {risk}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {prediction.factors.recommendations && prediction.factors.recommendations.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-green-600 mb-2">Tövsiyyələr:</p>
                        <ul className="space-y-1">
                          {prediction.factors.recommendations.map((rec, i) => (
                            <li key={i} className="text-sm flex items-start gap-2">
                              <Target className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Raw Metrics */}
            {metrics && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Əsas Metrikalar</CardTitle>
                  <CardDescription>Son 7 günün xam məlumatları</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold">{metrics.totalResponses}</div>
                      <div className="text-xs text-muted-foreground">Sorğu sayı</div>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold">{metrics.avgMoodScore.toFixed(0)}</div>
                      <div className="text-xs text-muted-foreground">Əhval balı</div>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className={`text-2xl font-bold ${metrics.stressChange > 0 ? 'text-red-500' : 'text-green-500'}`}>
                        {metrics.stressChange > 0 ? '+' : ''}{metrics.stressChange.toFixed(1)}%
                      </div>
                      <div className="text-xs text-muted-foreground">Stress dəyişimi</div>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className={`text-2xl font-bold ${metrics.salesTrend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {metrics.salesTrend > 0 ? '+' : ''}{metrics.salesTrend.toFixed(1)}%
                      </div>
                      <div className="text-xs text-muted-foreground">Satış trendi</div>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold">{metrics.avgComplaints.toFixed(1)}</div>
                      <div className="text-xs text-muted-foreground">Ort. şikayət/gün</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
