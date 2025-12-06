import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Users, AlertCircle, BarChart3, Activity, Home, UserCog, CalendarIcon, Eye, Brain, Loader2, RefreshCw, CheckCircle2, Lightbulb, Target } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { format, subDays } from "date-fns";
import { az } from "date-fns/locale";
import obaLogo from "@/assets/oba-logo.jpg";
import { MobileNavMenu } from "@/components/MobileNavMenu";
import { useToast } from "@/hooks/use-toast";

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ElementType;
  description?: string;
}

const StatCard = ({ title, value, change, icon: Icon, description }: StatCardProps) => {
  const isPositive = change >= 0;
  
  return (
    <Card className="gradient-card border-border/50 shadow-soft hover:shadow-medium transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground mb-1">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mb-2">{description}</p>
        )}
        <div className={cn(
          "flex items-center text-xs font-medium",
          isPositive ? "text-status-good" : "text-status-bad"
        )}>
          {isPositive ? (
            <TrendingUp className="mr-1 h-3 w-3" />
          ) : (
            <TrendingDown className="mr-1 h-3 w-3" />
          )}
          {Math.abs(change)}% son həftəyə nisbətən
        </div>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [aiAnalysis, setAiAnalysis] = useState<{
    score: number;
    summary: string;
    observations: string[];
    recommendations: string[];
    riskLevel: string;
  } | null>(null);
  const [hasAutoLoaded, setHasAutoLoaded] = useState(false);

  // Fetch burnout alerts from database
  const { data: burnoutAlerts = [] } = useQuery({
    queryKey: ['burnout-alerts', dateRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('burnout_alerts')
        .select('*')
        .eq('is_resolved', false)
        .order('risk_score', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  // Mock data - will be replaced with real API data
  const stats = {
    overallIndex: 78,
    totalResponses: 1247,
    riskCount: burnoutAlerts.length,
    responseRate: 89,
  };

  const topReasons = [
    { reason: "İş yükü", count: 156, percentage: 42 },
    { reason: "Qrafik", count: 98, percentage: 26 },
    { reason: "Menecer", count: 67, percentage: 18 },
    { reason: "Komanda", count: 34, percentage: 9 },
    { reason: "Şərtlər", count: 18, percentage: 5 },
  ];

  const moodDistribution = [
    { mood: "Yaxşı", count: 856, percentage: 69, color: "status-good" },
    { mood: "Normal", count: 267, percentage: 21, color: "status-normal" },
    { mood: "Pis", count: 124, percentage: 10, color: "status-bad" },
  ];

  // AI Analysis mutation
  const analysisMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('analyze-responses', {
        body: {
          moodDistribution,
          topReasons,
          riskCount: stats.riskCount,
          responseRate: stats.responseRate,
          overallIndex: stats.overallIndex,
        },
      });
      
      if (error) throw error;
      return data.analysis;
    },
    onSuccess: (analysis) => {
      setAiAnalysis(analysis);
    },
    onError: (error: any) => {
      toast({
        title: "AI analiz xətası",
        description: error.message || "Analiz aparıla bilmədi",
        variant: "destructive",
      });
    },
  });

  // Auto-load AI analysis on mount
  useEffect(() => {
    if (!hasAutoLoaded) {
      setHasAutoLoaded(true);
      analysisMutation.mutate();
    }
  }, []);

  return (
    <div className="min-h-screen gradient-subtle">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-lg border-b border-border shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <img 
                src={obaLogo} 
                alt="OBA Logo" 
                className="w-12 h-12 rounded-xl shadow-glow object-cover flex-shrink-0"
              />
              <div className="min-w-0">
                <h1 className="text-2xl font-bold text-foreground truncate">OBA İdarəetmə</h1>
                <p className="text-sm text-muted-foreground truncate">Personal Məmnuniyyət Sistemi</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Desktop navigation */}
              <div className="hidden sm:flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/")}
                  className="gap-2"
                >
                  <Home className="w-4 h-4" />
                  <span className="hidden md:inline">Ana Səhifə</span>
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => navigate("/hr-panel")}
                  className="gap-2"
                >
                  <UserCog className="w-4 h-4" />
                  <span className="hidden md:inline">HR Paneli</span>
                </Button>
              </div>
              {/* Mobile hamburger menu */}
              <MobileNavMenu />
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 min-w-[160px] sm:min-w-[200px] justify-start text-left font-normal"
                  >
                    <CalendarIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">
                      {format(dateRange.from, "dd MMM", { locale: az })} - {format(dateRange.to, "dd MMM yyyy", { locale: az })}
                    </span>
                    <span className="sm:hidden">
                      {format(dateRange.from, "dd/MM")} - {format(dateRange.to, "dd/MM")}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <div className="p-3 border-b border-border">
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDateRange({ from: subDays(new Date(), 7), to: new Date() })}
                        className="text-xs"
                      >
                        Son 7 gün
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDateRange({ from: subDays(new Date(), 30), to: new Date() })}
                        className="text-xs"
                      >
                        Son 30 gün
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDateRange({ from: subDays(new Date(), 90), to: new Date() })}
                        className="text-xs"
                      >
                        Son 90 gün
                      </Button>
                    </div>
                  </div>
                  <Calendar
                    mode="range"
                    selected={{ from: dateRange.from, to: dateRange.to }}
                    onSelect={(range) => {
                      if (range?.from && range?.to) {
                        setDateRange({ from: range.from, to: range.to });
                      } else if (range?.from) {
                        setDateRange({ from: range.from, to: range.from });
                      }
                    }}
                    numberOfMonths={2}
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Ümumi İndeks"
            value={`${stats.overallIndex}%`}
            change={5.2}
            icon={Activity}
            description="Məmnuniyyət səviyyəsi"
          />
          <StatCard
            title="Cavablar"
            value={stats.totalResponses.toLocaleString()}
            change={12.5}
            icon={Users}
            description="Aktiv iştirakçılar"
          />
          <StatCard
            title="Risk Hallları"
            value={stats.riskCount.toString()}
            change={-15.3}
            icon={AlertCircle}
            description="Burnout riski"
          />
          <StatCard
            title="Cavab Dərəcəsi"
            value={`${stats.responseRate}%`}
            change={3.1}
            icon={BarChart3}
            description="İştirak aktivliyi"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mood Distribution */}
          <Card className="gradient-card border-border/50 shadow-soft">
            <CardHeader>
              <CardTitle className="text-foreground">Əhval Bölgüsü</CardTitle>
              <CardDescription>Ümumi rəylər</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {moodDistribution.map((item) => (
                <div key={item.mood} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{item.mood}</span>
                    <span className="text-muted-foreground">
                      {item.count} ({item.percentage}%)
                    </span>
                  </div>
                  <Progress
                    value={item.percentage}
                    className="h-3"
                    style={{
                      ["--progress-background" as any]: `hsl(var(--${item.color}))`,
                    }}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Top Reasons */}
          <Card className="gradient-card border-border/50 shadow-soft">
            <CardHeader>
              <CardTitle className="text-foreground">Əsas Səbəblər</CardTitle>
              <CardDescription>Problemli sahələr</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topReasons.map((item, index) => (
                  <div key={item.reason} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                          {index + 1}
                        </span>
                        <span className="font-medium text-foreground">{item.reason}</span>
                      </div>
                      <span className="text-muted-foreground">
                        {item.count} şikayət
                      </span>
                    </div>
                    <Progress
                      value={item.percentage}
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Analysis Section */}
        <Card className="mt-6 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-primary/10 shadow-soft overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-foreground text-xl">Süni İntellekt Analizi</CardTitle>
                  <CardDescription>AI tərəfindən aparılmış məlumat analizi</CardDescription>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => analysisMutation.mutate()}
                disabled={analysisMutation.isPending}
                className="gap-2"
              >
                {analysisMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                {analysisMutation.isPending ? "Analiz edilir..." : "Yenilə"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {analysisMutation.isPending ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                  <Brain className="h-16 w-16 text-primary relative animate-pulse" />
                </div>
                <p className="mt-6 text-lg font-medium text-foreground">Analiz aparılır...</p>
                <p className="text-sm text-muted-foreground mt-2">AI məlumatları araşdırır</p>
              </div>
            ) : aiAnalysis ? (
              <div className="space-y-6">
                {/* Score Display */}
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="relative w-32 h-32 mx-auto md:mx-0">
                      <svg className="w-full h-full -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          fill="none"
                          stroke="hsl(var(--muted))"
                          strokeWidth="12"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          fill="none"
                          stroke={aiAnalysis.score >= 70 ? "hsl(var(--status-good))" : aiAnalysis.score >= 50 ? "hsl(var(--status-normal))" : "hsl(var(--status-bad))"}
                          strokeWidth="12"
                          strokeDasharray={`${(aiAnalysis.score / 100) * 352} 352`}
                          strokeLinecap="round"
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-foreground">{aiAnalysis.score}</span>
                        <span className="text-xs text-muted-foreground">ümumi bal</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    {/* Risk Level Badge */}
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-sm font-medium",
                        aiAnalysis.riskLevel === "aşağı" && "bg-status-good/20 text-status-good",
                        aiAnalysis.riskLevel === "orta" && "bg-status-normal/20 text-status-normal",
                        aiAnalysis.riskLevel === "yüksək" && "bg-orange-500/20 text-orange-600",
                        aiAnalysis.riskLevel === "kritik" && "bg-destructive/20 text-destructive"
                      )}>
                        Risk səviyyəsi: {aiAnalysis.riskLevel}
                      </span>
                    </div>
                    
                    {/* Summary */}
                    <p className="text-lg text-foreground leading-relaxed">{aiAnalysis.summary}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Observations */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-foreground font-semibold">
                      <Target className="h-5 w-5 text-primary" />
                      <span>Müşahidələr</span>
                    </div>
                    <ul className="space-y-2">
                      {aiAnalysis.observations.map((obs, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>{obs}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommendations */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-foreground font-semibold">
                      <Lightbulb className="h-5 w-5 text-yellow-500" />
                      <span>Tövsiyyələr</span>
                    </div>
                    <ul className="space-y-2">
                      {aiAnalysis.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-yellow-500/20 text-yellow-600 text-xs font-bold flex-shrink-0">
                            {i + 1}
                          </span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Brain className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg">AI analizi yüklənir...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Risk Alert */}
        {burnoutAlerts.length > 0 && (
          <Card className="mt-6 border-destructive/50 bg-destructive/5 shadow-soft">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <CardTitle className="text-destructive">Diqqət Tələb Edən Hallar</CardTitle>
              </div>
              <CardDescription>
                {burnoutAlerts.length} işçidə burnout riski aşkar edilib
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                {burnoutAlerts.slice(0, 5).map((alert) => (
                  <div 
                    key={alert.id} 
                    className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{alert.employee_code}</span>
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-full font-medium",
                          alert.risk_score >= 80 ? "bg-destructive/20 text-destructive" :
                          alert.risk_score >= 60 ? "bg-orange-500/20 text-orange-600" :
                          "bg-yellow-500/20 text-yellow-600"
                        )}>
                          {alert.risk_score >= 80 ? "Kritik" : alert.risk_score >= 60 ? "Yüksək" : "Orta"}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {alert.department} • {alert.branch} • {alert.reason_category}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-destructive">{alert.risk_score}</div>
                      <div className="text-xs text-muted-foreground">Risk Balı</div>
                    </div>
                  </div>
                ))}
              </div>
              {burnoutAlerts.length > 5 && (
                <p className="text-sm text-muted-foreground mb-4">
                  +{burnoutAlerts.length - 5} digər hal var
                </p>
              )}
              <Button
                variant="destructive"
                size="sm"
                onClick={() => navigate("/hr-panel")}
                className="gap-2"
              >
                <Eye className="w-4 h-4" />
                Hamısına Bax
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
