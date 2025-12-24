import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, TrendingUp, TrendingDown, Minus, AlertTriangle, Brain, RefreshCw, Target, Users, ShoppingCart, Activity, BarChart3, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Legend, ScatterChart, Scatter, ZAxis } from "recharts";

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

interface BranchComparison {
  branch: string;
  avgSales: number;
  avgComplaints: number;
  avgMood: number;
  stressLevel: number;
  correlation: number;
}

interface DailyTrend {
  date: string;
  sales: number;
  complaints: number;
  stressIndex: number;
}

// All branches from database
const branches = [
  "Bakı Mərkəz",
  "Bakı 28 May",
  "Bakı - Nərimanov",
  "Bakı - Yasamal",
  "Gəncə",
  "Lənkəran",
  "Mingəçevir",
  "Quba",
  "Sumqayıt",
  "Şəki",
  "Şirvan",
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
  const [branchComparisons, setBranchComparisons] = useState<BranchComparison[]>([]);
  const [dailyTrends, setDailyTrends] = useState<DailyTrend[]>([]);
  const [loadingComparison, setLoadingComparison] = useState(true);
  const { toast } = useToast();

  // Load branch comparisons on mount
  useEffect(() => {
    loadBranchComparisons();
  }, []);

  const loadBranchComparisons = async () => {
    setLoadingComparison(true);
    try {
      // Get external metrics for all branches
      const { data: metricsData, error: metricsError } = await supabase
        .from('external_metrics')
        .select('*')
        .gte('metric_date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('metric_date', { ascending: false });

      if (metricsError) throw metricsError;

      // Get mood responses
      const { data: responsesData, error: responsesError } = await supabase
        .from('employee_responses')
        .select('*')
        .gte('response_date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

      if (responsesError) throw responsesError;

      // Calculate branch comparisons
      const branchMap = new Map<string, { sales: number[], complaints: number[], moods: number[] }>();
      
      metricsData?.forEach(m => {
        if (!branchMap.has(m.branch)) {
          branchMap.set(m.branch, { sales: [], complaints: [], moods: [] });
        }
        const branch = branchMap.get(m.branch)!;
        branch.sales.push(Number(m.daily_sales) || 0);
        branch.complaints.push(m.customer_complaints || 0);
      });

      responsesData?.forEach(r => {
        if (!branchMap.has(r.branch)) {
          branchMap.set(r.branch, { sales: [], complaints: [], moods: [] });
        }
        const moodScore = r.mood === 'Yaxşı' ? 100 : r.mood === 'Normal' ? 50 : 0;
        branchMap.get(r.branch)!.moods.push(moodScore);
      });

      const comparisons: BranchComparison[] = [];
      branchMap.forEach((data, branch) => {
        if (data.sales.length > 0) {
          const avgSales = data.sales.reduce((a, b) => a + b, 0) / data.sales.length;
          const avgComplaints = data.complaints.reduce((a, b) => a + b, 0) / data.complaints.length;
          const avgMood = data.moods.length > 0 ? data.moods.reduce((a, b) => a + b, 0) / data.moods.length : 50;
          const stressLevel = 100 - avgMood;
          
          // Simple correlation calculation (stress vs complaints)
          const correlation = Math.min(100, Math.max(0, (stressLevel * 0.5 + avgComplaints * 3)));

          comparisons.push({
            branch,
            avgSales,
            avgComplaints,
            avgMood,
            stressLevel,
            correlation
          });
        }
      });

      setBranchComparisons(comparisons.sort((a, b) => b.correlation - a.correlation));
    } catch (err) {
      console.error("Error loading comparisons:", err);
    } finally {
      setLoadingComparison(false);
    }
  };

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
      // Fetch daily trends for selected branch
      const { data: metricsData } = await supabase
        .from('external_metrics')
        .select('*')
        .eq('branch', selectedBranch)
        .gte('metric_date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('metric_date', { ascending: true });

      const { data: responsesData } = await supabase
        .from('employee_responses')
        .select('*')
        .eq('branch', selectedBranch)
        .gte('response_date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

      // Build daily trends
      const trendMap = new Map<string, { sales: number, complaints: number, stressScores: number[] }>();
      
      metricsData?.forEach(m => {
        const date = m.metric_date;
        if (!trendMap.has(date)) {
          trendMap.set(date, { sales: 0, complaints: 0, stressScores: [] });
        }
        const day = trendMap.get(date)!;
        day.sales += Number(m.daily_sales) || 0;
        day.complaints += m.customer_complaints || 0;
      });

      responsesData?.forEach(r => {
        const date = r.response_date;
        if (!trendMap.has(date)) {
          trendMap.set(date, { sales: 0, complaints: 0, stressScores: [] });
        }
        const stressScore = r.mood === 'Pis' ? 100 : r.mood === 'Normal' ? 50 : 0;
        trendMap.get(date)!.stressScores.push(stressScore);
      });

      const trends: DailyTrend[] = [];
      trendMap.forEach((data, date) => {
        const avgStress = data.stressScores.length > 0 
          ? data.stressScores.reduce((a, b) => a + b, 0) / data.stressScores.length 
          : 30;
        trends.push({
          date: new Date(date).toLocaleDateString('az-AZ', { day: 'numeric', month: 'short' }),
          sales: Math.round(data.sales / 1000), // in thousands
          complaints: data.complaints,
          stressIndex: Math.round(avgStress)
        });
      });

      setDailyTrends(trends.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));

      // Call prediction API
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

  const getCorrelationColor = (corr: number) => {
    if (corr >= 70) return "bg-red-500";
    if (corr >= 50) return "bg-orange-500";
    if (corr >= 30) return "bg-yellow-500";
    return "bg-green-500";
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

      {/* Branch Comparison Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Filiallar arası müqayisə</CardTitle>
          </div>
          <CardDescription>
            Stress-Satış korrelyasiyası (yüksək = daha çox risk)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingComparison ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-3">
              {branchComparisons.slice(0, 8).map((branch, index) => (
                <motion.div
                  key={branch.branch}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-32 sm:w-40 text-sm font-medium truncate">{branch.branch}</div>
                  <div className="flex-1">
                    <div className="h-6 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${branch.correlation}%` }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        className={`h-full ${getCorrelationColor(branch.correlation)} flex items-center justify-end pr-2`}
                      >
                        <span className="text-xs text-white font-medium">
                          {branch.correlation.toFixed(0)}%
                        </span>
                      </motion.div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground w-20 text-right hidden sm:block">
                    ₼{(branch.avgSales / 1000).toFixed(0)}k/gün
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stress Impact Chart */}
      {branchComparisons.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-orange-500" />
              <CardTitle className="text-lg">Stressin Satışa Təsiri</CardTitle>
            </div>
            <CardDescription>
              Hər filialda stress səviyyəsi vs gündəlik şikayət
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                  <XAxis 
                    type="number" 
                    dataKey="stressLevel" 
                    name="Stress" 
                    domain={[0, 100]}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    label={{ value: 'Stress Səviyyəsi (%)', position: 'bottom', offset: 40, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="avgComplaints" 
                    name="Şikayətlər"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    label={{ value: 'Ort. Şikayət/gün', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <ZAxis 
                    type="number" 
                    dataKey="avgSales" 
                    range={[100, 500]} 
                    name="Satış"
                  />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px"
                    }}
                    formatter={(value: number, name: string) => {
                      if (name === "Satış") return [`₼${(value / 1000).toFixed(0)}k`, name];
                      if (name === "Stress") return [`${value.toFixed(0)}%`, name];
                      return [value.toFixed(1), name];
                    }}
                    labelFormatter={(label: string, payload: any) => {
                      if (payload && payload.length > 0) {
                        return payload[0].payload.branch;
                      }
                      return label;
                    }}
                  />
                  <Scatter 
                    name="Filiallar" 
                    data={branchComparisons} 
                    fill="hsl(var(--primary))"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Dairə ölçüsü = satış həcmi. Sağ üst = yüksək stress, çox şikayət (kritik)
            </p>
          </CardContent>
        </Card>
      )}

      <AnimatePresence mode="wait">
        {prediction && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Daily Trend Chart */}
            {dailyTrends.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{selectedBranch} - Gündəlik Trend</CardTitle>
                  </div>
                  <CardDescription>Son 7 gün ərzində satış, şikayət və stress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={dailyTrends}>
                        <defs>
                          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                        <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                        <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "hsl(var(--card))", 
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "12px"
                          }}
                        />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey="sales" 
                          name="Satış (min ₼)" 
                          stroke="#22c55e" 
                          fillOpacity={1}
                          fill="url(#colorSales)" 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="stressIndex" 
                          name="Stress İndeksi" 
                          stroke="#ef4444" 
                          fillOpacity={1}
                          fill="url(#colorStress)" 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="complaints" 
                          name="Şikayətlər" 
                          stroke="#f97316" 
                          strokeWidth={2}
                          dot={{ fill: "#f97316" }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

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
