import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Users, AlertCircle, BarChart3, Activity, Home, UserCog, CalendarIcon, LogOut } from "lucide-react";
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
import { AIAnalysisCard } from "@/components/AIAnalysisCard";
import { AITasksCard, AITask } from "@/components/AITasksCard";
import { MoodPieChart } from "@/components/charts/MoodPieChart";
import { ReasonsBarChart } from "@/components/charts/ReasonsBarChart";
import { TrendLineChart } from "@/components/charts/TrendLineChart";
import { BranchComparisonChart } from "@/components/charts/BranchComparisonChart";

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
    criticalAlerts?: string[];
    tasks?: AITask[];
  } | null>(null);
  const [hasAutoLoaded, setHasAutoLoaded] = useState(false);

  // Fetch manager's assigned branch
  const { data: managerBranch } = useQuery({
    queryKey: ['manager-branch'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('manager_branches')
        .select('branch')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data?.branch || null;
    },
  });

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

  // Fetch employee responses from database
  const { data: responses = [] } = useQuery({
    queryKey: ['employee-responses', dateRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employee_responses')
        .select('*')
        .gte('response_date', format(dateRange.from, 'yyyy-MM-dd'))
        .lte('response_date', format(dateRange.to, 'yyyy-MM-dd'));
      
      if (error) throw error;
      return data || [];
    },
  });

  // Calculate real statistics from responses
  const totalResponses = responses.length;
  const moodCounts = {
    'Yaxşı': responses.filter(r => r.mood === 'Yaxşı').length,
    'Normal': responses.filter(r => r.mood === 'Normal').length,
    'Pis': responses.filter(r => r.mood === 'Pis').length,
  };

  const moodDistribution = [
    { 
      mood: "Yaxşı", 
      count: moodCounts['Yaxşı'], 
      percentage: totalResponses > 0 ? Math.round((moodCounts['Yaxşı'] / totalResponses) * 100) : 0, 
      color: "status-good" 
    },
    { 
      mood: "Normal", 
      count: moodCounts['Normal'], 
      percentage: totalResponses > 0 ? Math.round((moodCounts['Normal'] / totalResponses) * 100) : 0, 
      color: "status-normal" 
    },
    { 
      mood: "Pis", 
      count: moodCounts['Pis'], 
      percentage: totalResponses > 0 ? Math.round((moodCounts['Pis'] / totalResponses) * 100) : 0, 
      color: "status-bad" 
    },
  ];

  // Calculate top reasons from responses with reason_category
  const reasonCounts: Record<string, number> = {};
  responses.forEach(r => {
    if (r.reason_category) {
      reasonCounts[r.reason_category] = (reasonCounts[r.reason_category] || 0) + 1;
    }
  });
  
  const totalReasons = Object.values(reasonCounts).reduce((a, b) => a + b, 0);
  const topReasons = Object.entries(reasonCounts)
    .map(([reason, count]) => ({
      reason,
      count,
      percentage: totalReasons > 0 ? Math.round((count / totalReasons) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Calculate overall satisfaction index
  const overallIndex = totalResponses > 0 
    ? Math.round(((moodCounts['Yaxşı'] * 100 + moodCounts['Normal'] * 50 + moodCounts['Pis'] * 0) / totalResponses))
    : 0;

  // Stats object with real data
  const stats = {
    overallIndex,
    totalResponses,
    riskCount: burnoutAlerts.length,
    responseRate: 89, // This would need a total employee count to calculate properly
  };

  // Extract critical complaints (free text reasons from bad moods)
  const criticalComplaints = responses
    .filter(r => r.mood === 'Pis' && r.reason)
    .map(r => ({
      reason: r.reason,
      category: r.reason_category,
      branch: r.branch,
      department: r.department,
    }));

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
          criticalComplaints, // Send critical complaints for AI to analyze
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
                <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">
                  OBA İdarəetmə Paneli
                  {managerBranch && (
                    <span className="ml-2 text-primary">• {branchNames[managerBranch] || managerBranch}</span>
                  )}
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  {managerBranch ? `${branchNames[managerBranch] || managerBranch} Bölgəsi Məmnuniyyət Sistemi` : 'Personal Məmnuniyyət Sistemi'}
                </p>
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    await supabase.auth.signOut();
                    navigate("/auth");
                  }}
                  className="gap-2 text-destructive hover:text-destructive"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:inline">Çıxış</span>
                </Button>
              </div>
              {/* Mobile hamburger menu */}
              <MobileNavMenu 
                dateRange={dateRange} 
                onDateRangeChange={setDateRange} 
                showDatePicker={true}
              />
              {/* Desktop date picker */}
              <Popover>
                <PopoverTrigger asChild className="hidden sm:flex">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 min-w-[200px] justify-start text-left font-normal"
                  >
                    <CalendarIcon className="h-4 w-4" />
                    {format(dateRange.from, "dd MMM", { locale: az })} - {format(dateRange.to, "dd MMM yyyy", { locale: az })}
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

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <MoodPieChart data={moodDistribution} />
          <ReasonsBarChart data={topReasons} />
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <TrendLineChart responses={responses} dateRange={dateRange} />
          <BranchComparisonChart responses={responses} />
        </div>

        {/* AI Analysis Section */}
        <div className="mt-6">
          <AIAnalysisCard
            analysis={aiAnalysis}
            isLoading={analysisMutation.isPending}
            onRefresh={() => analysisMutation.mutate()}
          />
        </div>

        {/* AI Tasks Section */}
        <div className="mt-6">
          <AITasksCard
            newTasks={aiAnalysis?.tasks || []}
            isGenerating={analysisMutation.isPending}
            onRefresh={() => analysisMutation.mutate()}
            branch={managerBranch}
          />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
