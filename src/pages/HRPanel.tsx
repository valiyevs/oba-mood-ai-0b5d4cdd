import { useState, useEffect } from "react";
import { 
  Users, 
  Building2, 
  MapPin, 
  AlertTriangle, 
  TrendingDown,
  TrendingUp,
  Filter,
  Download,
  Home,
  MessageSquare,
  ClipboardCheck,
  CalendarIcon,
  LogOut
} from "lucide-react";
import { format, subDays } from "date-fns";
import { az } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import obaLogo from "@/assets/oba-logo.jpg";
import { supabase } from "@/integrations/supabase/client";
import { MobileNavMenu } from "@/components/MobileNavMenu";
import { AIAnalysisCard } from "@/components/AIAnalysisCard";
import { MoodPieChart } from "@/components/charts/MoodPieChart";
import { TrendLineChart } from "@/components/charts/TrendLineChart";
import { ReasonsBarChart } from "@/components/charts/ReasonsBarChart";
import { BranchComparisonChart } from "@/components/charts/BranchComparisonChart";

interface FilterState {
  country: string;
  branch: string;
}

interface BurnoutCase {
  id: string;
  employee_code: string;
  department: string;
  branch: string;
  risk_score: number;
  reason_category: string;
  detected_at: string;
  is_resolved: boolean;
}

const HRPanel = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FilterState>({
    country: "all",
    branch: "all"
  });
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 90), // Extended to 90 days to include more data
    to: new Date(),
  });

  // Mock data - ölkələr
  const countries = [
    { value: "all", label: "Bütün ölkələr" },
    { value: "az", label: "Azərbaycan" },
    { value: "tr", label: "Türkiyə" },
    { value: "ge", label: "Gürcüstan" }
  ];

  // Mock data - filiallar
  const branches = [
    { value: "all", label: "Bütün filiallar" },
    { value: "baku-center", label: "Bakı Mərkəz" },
    { value: "baku-28may", label: "Bakı 28 May" },
    { value: "ganja", label: "Gəncə" },
    { value: "sumgayit", label: "Sumqayıt" }
  ];


  // HR statistics - fetch burnout cases
  const { data: burnoutCases = [] } = useQuery<BurnoutCase[]>({
    queryKey: ["hr-burnout-alerts", dateRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("burnout_alerts")
        .select("*")
        .eq("is_resolved", false)
        .order("risk_score", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Fetch employee responses
  const { data: responses = [] } = useQuery({
    queryKey: ["hr-responses", dateRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("employee_responses")
        .select("*")
        .gte("response_date", format(dateRange.from, "yyyy-MM-dd"))
        .lte("response_date", format(dateRange.to, "yyyy-MM-dd"));

      if (error) throw error;
      return data || [];
    },
  });

  // Calculate real stats from responses
  const totalResponses = responses.length;
  const uniqueEmployees = [...new Set(responses.map(r => r.employee_code))].length;
  
  const moodCounts = {
    'Yaxşı': responses.filter(r => r.mood === 'Yaxşı').length,
    'Normal': responses.filter(r => r.mood === 'Normal').length,
    'Pis': responses.filter(r => r.mood === 'Pis').length,
  };

  // Mood distribution for charts
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

  // Calculate average satisfaction (10 scale: Yaxşı=10, Normal=5, Pis=0)
  const avgSatisfaction = totalResponses > 0 
    ? ((moodCounts['Yaxşı'] * 10 + moodCounts['Normal'] * 5 + moodCounts['Pis'] * 0) / totalResponses).toFixed(1)
    : "0";

  const stats = {
    totalEmployees: uniqueEmployees,
    responseRate: totalResponses > 0 ? ((totalResponses / Math.max(uniqueEmployees, 1)) * 100).toFixed(1) : "0",
    avgSatisfaction: parseFloat(avgSatisfaction),
    burnoutCases: burnoutCases.length,
    criticalCases: burnoutCases.filter(c => c.risk_score >= 80).length,
    trend: "+2.1"
  };

  // Calculate top reasons from responses
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

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };



  // AI Analysis state
  const [aiAnalysis, setAiAnalysis] = useState<{
    score: number;
    summary: string;
    observations: string[];
    recommendations: string[];
    riskLevel: string;
    criticalAlerts?: string[];
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const runAIAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      // Prepare data for analysis
      const moodDistribution = {
        'Yaxşı': totalResponses > 0 ? Math.round((moodCounts['Yaxşı'] / totalResponses) * 100) : 0,
        'Normal': totalResponses > 0 ? Math.round((moodCounts['Normal'] / totalResponses) * 100) : 0,
        'Pis': totalResponses > 0 ? Math.round((moodCounts['Pis'] / totalResponses) * 100) : 0,
      };

      // Get top reasons from responses
      const reasonCounts: Record<string, number> = {};
      responses.forEach(r => {
        if (r.reason_category) {
          reasonCounts[r.reason_category] = (reasonCounts[r.reason_category] || 0) + 1;
        }
      });
      const topReasons = Object.entries(reasonCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([reason, count]) => ({
          reason,
          percentage: totalResponses > 0 ? Math.round((count / totalResponses) * 100) : 0
        }));

      // Extract critical complaints (free text reasons from bad moods)
      const criticalComplaints = responses
        .filter(r => r.mood === 'Pis' && r.reason)
        .map(r => ({
          reason: r.reason,
          category: r.reason_category,
          branch: r.branch,
          department: r.department,
        }));

      const response = await supabase.functions.invoke('analyze-responses', {
        body: {
          moodDistribution,
          topReasons,
          riskCount: stats.burnoutCases,
          responseRate: parseFloat(stats.responseRate),
          overallIndex: stats.avgSatisfaction * 10,
          criticalComplaints, // Send critical complaints for AI to analyze
        }
      });

      if (response.error) throw response.error;
      setAiAnalysis(response.data?.analysis || response.data);
    } catch (error) {
      console.error('AI analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Auto-run AI analysis when data is loaded
  useEffect(() => {
    if (responses.length > 0 && !aiAnalysis && !isAnalyzing) {
      runAIAnalysis();
    }
  }, [responses]);

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'kritik':
        return 'text-destructive bg-destructive/10 border-destructive';
      case 'yüksək':
        return 'text-orange-600 bg-orange-50 border-orange-300';
      case 'orta':
        return 'text-yellow-600 bg-yellow-50 border-yellow-300';
      default:
        return 'text-primary bg-primary/10 border-primary';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-4 min-w-0">
              <img src={obaLogo} alt="OBA" className="h-12 w-auto object-contain flex-shrink-0" />
              <div className="min-w-0">
                <h1 className="text-2xl font-bold text-foreground truncate">İnsan Resursları Paneli</h1>
                <p className="text-sm text-muted-foreground truncate">Əməkdaş məmnuniyyəti və risk idarəetməsi</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Desktop navigation */}
              <div className="hidden sm:flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/manager-assignments")}
                  className="gap-2"
                >
                  <Users className="w-4 h-4" />
                  <span className="hidden md:inline">Təyinatlar</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/manager-actions")}
                  className="gap-2"
                >
                  <ClipboardCheck className="w-4 h-4" />
                  <span className="hidden md:inline">Tapşırıqlar</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/employee-responses")}
                  className="gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="hidden md:inline">Cavablar</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/dashboard")}
                  className="gap-2"
                >
                  <Home className="w-4 h-4" />
                  <span className="hidden md:inline">İdarəetmə Paneli</span>
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="w-4 h-4" />
                  <span className="hidden md:inline">Hesabat Yüklə</span>
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
              {/* Desktop date picker */}
              <Popover>
                <PopoverTrigger asChild className="hidden sm:flex">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 min-w-[180px] justify-start text-left font-normal"
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
              {/* Mobile hamburger menu */}
              <MobileNavMenu 
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                showDatePicker={true}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtrlər
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Ölkə
                </label>
                <select
                  value={filters.country}
                  onChange={(e) => handleFilterChange("country", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {countries.map(country => (
                    <option key={country.value} value={country.value}>
                      {country.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  <Building2 className="w-4 h-4 inline mr-1" />
                  Bölgə / Filial
                </label>
                <select
                  value={filters.branch}
                  onChange={(e) => handleFilterChange("branch", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {branches.map(branch => (
                    <option key={branch.value} value={branch.value}>
                      {branch.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Ümumi Əməkdaş</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEmployees}</div>
              <p className="text-xs text-muted-foreground mt-1">Aktiv işçilər</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Cavab Nisbəti</CardTitle>
              <TrendingUp className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.responseRate}%</div>
              <p className="text-xs text-primary mt-1">+{stats.trend}% bu həftə</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Orta Məmnuniyyət</CardTitle>
              <TrendingUp className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgSatisfaction}/10</div>
              <p className="text-xs text-muted-foreground mt-1">Son 30 gün</p>
            </CardContent>
          </Card>

          <Card className="border-destructive/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Risk Halları</CardTitle>
              <AlertTriangle className="w-4 h-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{stats.burnoutCases}</div>
              <p className="text-xs text-destructive mt-1">{stats.criticalCases} kritik hal</p>
            </CardContent>
          </Card>
        </div>

        {/* Critical Burnout Alert */}
        {stats.criticalCases > 0 && (
          <Alert className="mb-6 border-destructive bg-destructive/10">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive">
              <strong>Diqqət!</strong> {stats.criticalCases} kritik burnout halı müəyyən edilib. 
              Dərhal müdaxilə tələb olunur.
            </AlertDescription>
          </Alert>
        )}

        {/* Charts Row - FIRST */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <MoodPieChart 
            data={moodDistribution} 
            title="Əhval Bölgüsü" 
            description="İşçilərin əhval paylanması" 
          />
          <TrendLineChart 
            responses={responses} 
            dateRange={dateRange}
            title="Əhval Trendi" 
            description="Günlər üzrə məmnuniyyət göstəricisi" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ReasonsBarChart 
            data={topReasons} 
            title="Şikayət Səbəbləri" 
            description="Ən çox qeyd olunan problemlər" 
          />
          <BranchComparisonChart 
            responses={responses}
            title="Bölgə Müqayisəsi" 
            description="Bölgələr üzrə əhval bölgüsü" 
          />
        </div>

        {/* AI Analysis Section - AFTER CHARTS */}
        <div className="mb-6">
          <AIAnalysisCard
            analysis={aiAnalysis}
            isLoading={isAnalyzing}
            onRefresh={runAIAnalysis}
          />
        </div>


        {/* Region Statistics - Full Width */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Bölgələr üzrə Ümumi Statistika
            </CardTitle>
            <CardDescription>
              Real sorğu cavablarına əsasən bölgə göstəriciləri
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {(() => {
                // Calculate region statistics from real responses
                const regionData: Record<string, { responses: number; moodSum: number; badCount: number; goodCount: number }> = {};
                responses.forEach(r => {
                  if (!regionData[r.branch]) {
                    regionData[r.branch] = { responses: 0, moodSum: 0, badCount: 0, goodCount: 0 };
                  }
                  regionData[r.branch].responses++;
                  regionData[r.branch].moodSum += r.mood === 'Yaxşı' ? 10 : r.mood === 'Normal' ? 5 : 0;
                  if (r.mood === 'Pis') regionData[r.branch].badCount++;
                  if (r.mood === 'Yaxşı') regionData[r.branch].goodCount++;
                });

                const regionStats = Object.entries(regionData).map(([name, data]) => ({
                  name,
                  responses: data.responses,
                  satisfaction: data.responses > 0 ? parseFloat((data.moodSum / data.responses).toFixed(1)) : 0,
                  badCount: data.badCount,
                  goodCount: data.goodCount,
                  goodPercent: data.responses > 0 ? Math.round((data.goodCount / data.responses) * 100) : 0
                })).sort((a, b) => b.responses - a.responses);

                const regionNames: Record<string, string> = {
                  'baku': 'Bakı', 'ganja': 'Gəncə', 'sumgait': 'Sumqayıt',
                  'mingachevir': 'Mingəçevir', 'shirvan': 'Şirvan',
                  'lankaran': 'Lənkəran', 'shaki': 'Şəki', 'quba': 'Quba'
                };

                return regionStats.length === 0 ? (
                  <p className="col-span-full text-center text-muted-foreground py-8">Məlumat yoxdur</p>
                ) : (
                  regionStats.map((region, index) => (
                    <div key={index} className="p-4 rounded-lg border border-border bg-card hover:bg-accent/30 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-foreground">
                          {regionNames[region.name] || region.name}
                        </h4>
                        <span className={cn(
                          "text-xs font-medium px-2 py-1 rounded-full",
                          region.satisfaction >= 7 ? "bg-status-good/20 text-status-good" :
                          region.satisfaction >= 4 ? "bg-status-normal/20 text-status-normal" :
                          "bg-status-bad/20 text-status-bad"
                        )}>
                          {region.satisfaction}/10
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Cavab sayı:</span>
                          <span className="font-medium">{region.responses}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Yaxşı əhval:</span>
                          <span className="text-status-good font-medium">{region.goodPercent}%</span>
                        </div>
                        {region.badCount > 0 && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Pis əhval:</span>
                            <span className="text-status-bad font-medium">{region.badCount} nəfər</span>
                          </div>
                        )}
                      </div>
                      <Progress 
                        value={region.satisfaction * 10} 
                        className="h-1.5 mt-3"
                      />
                    </div>
                  ))
                );
              })()}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HRPanel;
