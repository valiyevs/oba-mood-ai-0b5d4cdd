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
        title: "Select branch",
        description: "Please select a branch for prediction",
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
          date: new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
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
        title: "Prediction ready",
        description: data.source === "ai" ? "AI analysis complete" : "Prediction calculated based on trends"
      });
    } catch (err) {
      console.error("Prediction error:", err);
      toast({
        title: "Error",
        description: "Could not calculate prediction",
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
    if (risk >= 80) return { variant: "destructive" as const, text: "Critical" };
    if (risk >= 60) return { variant: "default" as const, text: "High" };
    if (risk >= 40) return { variant: "secondary" as const, text: "Medium" };
    return { variant: "outline" as const, text: "Low" };
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
              <CardTitle className="text-xl">Predictive Analytics</CardTitle>
              <CardDescription>
                Risk forecast based on stress and sales data correlation
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger className="w-full sm:w-[250px]">
                <SelectValue placeholder="Select branch" />
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
                  Calculating...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Get Prediction
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
            <CardTitle className="text-lg">Branch Comparison</CardTitle>
          </div>
          <CardDescription>
            Stress-Sales Correlation (higher = more risk)
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
                    ₼{(branch.avgSales / 1000).toFixed(0)}k/day
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
              <CardTitle className="text-lg">Impact of Stress on Sales</CardTitle>
            </div>
            <CardDescription>
              Stress level vs daily complaints for each branch
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
                    label={{ value: 'Stress Level (%)', position: 'bottom', offset: 40, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="avgComplaints" 
                    name="Complaints"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    label={{ value: 'Avg. Complaints/day', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <ZAxis 
                    type="number" 
                    dataKey="avgSales" 
                    range={[100, 500]} 
                    name="Sales"
                  />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px"
                    }}
                    formatter={(value: number, name: string) => {
                      if (name === "Sales") return [`₼${(value / 1000).toFixed(0)}k`, name];
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
                    name="Branches" 
                    data={branchComparisons} 
                    fill="hsl(var(--primary))"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Circle size = Sales volume. Top right = High stress, many complaints (Critical)
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
                    <CardTitle className="text-lg">{selectedBranch} - Daily Trend</CardTitle>
                  </div>
                  <CardDescription>Sales, complaints and stress over last 7 days</CardDescription>
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
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" orientation="left" stroke="#22c55e" />
                        <YAxis yAxisId="right" orientation="right" stroke="#ef4444" />
                        <Tooltip />
                        <Legend />
                        <Area yAxisId="left" type="monotone" dataKey="sales" name="Sales (k)" stroke="#22c55e" fillOpacity={1} fill="url(#colorSales)" />
                        <Area yAxisId="right" type="monotone" dataKey="stressIndex" name="Stress Index" stroke="#ef4444" fillOpacity={1} fill="url(#colorStress)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Prediction Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Predicted Stress Change</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <span className={`text-2xl font-bold ${prediction.stressChangePercent > 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {prediction.stressChangePercent > 0 ? '+' : ''}{prediction.stressChangePercent}%
                    </span>
                    <TrendIcon trend={prediction.stressChangePercent > 0 ? "artan" : "azalan"} />
                  </div>
                  <Progress value={50 + prediction.stressChangePercent} className="mt-2" />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Complaint Risk</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <span className={`text-2xl font-bold ${getRiskColor(prediction.complaintRiskPercent)}`}>
                      {prediction.complaintRiskPercent}%
                    </span>
                    <AlertTriangle className={`h-4 w-4 ${getRiskColor(prediction.complaintRiskPercent)}`} />
                  </div>
                  <Progress value={prediction.complaintRiskPercent} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Sales Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-orange-500">
                      -{prediction.salesImpactPercent}%
                    </span>
                    <TrendingDown className="h-4 w-4 text-orange-500" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Potential loss due to stress</p>
                </CardContent>
              </Card>
            </div>

            {/* AI Insight */}
            <Card className="border-primary/50 bg-primary/5">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">AI Insight</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium mb-4">{prediction.predictionText}</p>
                
                {prediction.factors && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        Key Risks
                      </h4>
                      <ul className="space-y-1">
                        {prediction.factors.keyRisks?.map((risk, i) => (
                          <li key={i} className="text-sm text-muted-foreground">• {risk}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Target className="h-4 w-4 text-green-500" />
                        Recommendations
                      </h4>
                      <ul className="space-y-1">
                        {prediction.factors.recommendations?.map((rec, i) => (
                          <li key={i} className="text-sm text-muted-foreground">• {rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
