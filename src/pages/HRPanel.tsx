import { useState } from "react";
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
  Sparkles,
  Loader2,
  Brain,
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
interface FilterState {
  country: string;
  branch: string;
  department: string;
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
    branch: "all",
    department: "all"
  });
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 30),
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

  // Mock data - şöbələr
  const departments = [
    { value: "all", label: "Bütün şöbələr" },
    { value: "sales", label: "Satış" },
    { value: "tech", label: "Texniki" },
    { value: "logistics", label: "Logistika" },
    { value: "hr", label: "İnsan Resursları" }
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

  // Calculate department statistics from real data
  const departmentData: Record<string, { responses: number; moodSum: number; badCount: number }> = {};
  responses.forEach(r => {
    if (!departmentData[r.department]) {
      departmentData[r.department] = { responses: 0, moodSum: 0, badCount: 0 };
    }
    departmentData[r.department].responses++;
    departmentData[r.department].moodSum += r.mood === 'Yaxşı' ? 10 : r.mood === 'Normal' ? 5 : 0;
    if (r.mood === 'Pis') departmentData[r.department].badCount++;
  });

  const departmentStats = Object.entries(departmentData).map(([name, data]) => ({
    name,
    employees: data.responses,
    satisfaction: data.responses > 0 ? parseFloat((data.moodSum / data.responses).toFixed(1)) : 0,
    burnout: data.badCount
  })).sort((a, b) => b.employees - a.employees);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const getRiskLevel = (score: number) => {
    if (score >= 80) return "critical";
    if (score >= 60) return "high";
    return "medium";
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "critical":
        return "text-destructive";
      case "high":
        return "text-orange-500";
      case "medium":
        return "text-yellow-500";
      default:
        return "text-muted-foreground";
    }
  };
 
  const getRiskLabel = (level: string) => {
    switch (level) {
      case "critical":
        return "Kritik";
      case "high":
        return "Yüksək";
      case "medium":
        return "Orta";
      default:
        return "Aşağı";
    }
  };

  // AI Analysis state
  const [aiAnalysis, setAiAnalysis] = useState<{
    score: number;
    summary: string;
    observations: string[];
    recommendations: string[];
    riskLevel: string;
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

      const response = await supabase.functions.invoke('analyze-responses', {
        body: {
          moodDistribution,
          topReasons,
          riskCount: stats.burnoutCases,
          responseRate: parseFloat(stats.responseRate),
          overallIndex: stats.avgSatisfaction * 10,
        }
      });

      if (response.error) throw response.error;
      setAiAnalysis(response.data);
    } catch (error) {
      console.error('AI analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  Filial
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
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  <Users className="w-4 h-4 inline mr-1" />
                  Şöbə
                </label>
                <select
                  value={filters.department}
                  onChange={(e) => handleFilterChange("department", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {departments.map(dept => (
                    <option key={dept.value} value={dept.value}>
                      {dept.label}
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

        {/* AI Analysis Section */}
        <Card className="mb-6 border-primary/30 bg-gradient-to-r from-primary/5 to-transparent">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  AI Analiz
                </CardTitle>
                <CardDescription>
                  Süni intellekt əsasında əməkdaş məmnuniyyəti analizi
                </CardDescription>
              </div>
              <Button 
                onClick={runAIAnalysis} 
                disabled={isAnalyzing}
                className="gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analiz edilir...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Analiz Et
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          {aiAnalysis && (
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Score */}
                <div className="text-center p-4 rounded-lg bg-card border border-border">
                  <div className="text-4xl font-bold text-primary mb-1">{aiAnalysis.score}</div>
                  <div className="text-sm text-muted-foreground">Məmnuniyyət Balı</div>
                  <div className={cn(
                    "inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold border",
                    getRiskLevelColor(aiAnalysis.riskLevel || "orta")
                  )}>
                    Risk: {aiAnalysis.riskLevel ? (aiAnalysis.riskLevel.charAt(0).toUpperCase() + aiAnalysis.riskLevel.slice(1)) : "Orta"}
                  </div>
                </div>

                {/* Summary */}
                <div className="md:col-span-2 p-4 rounded-lg bg-card border border-border">
                  <h4 className="font-semibold text-foreground mb-2">Xülasə</h4>
                  <p className="text-sm text-muted-foreground">{aiAnalysis.summary}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Observations */}
                <div className="p-4 rounded-lg bg-card border border-border">
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    Müşahidələr
                  </h4>
                  <ul className="space-y-2">
                    {(aiAnalysis.observations || []).map((obs, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        {obs}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <div className="p-4 rounded-lg bg-card border border-border">
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Tövsiyələr
                  </h4>
                  <ul className="space-y-2">
                    {(aiAnalysis.recommendations || []).map((rec, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-1">{index + 1}.</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Burnout Risk Cases */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                Burnout Risk Halları
              </CardTitle>
              <CardDescription>
                Yüksək risk altında olan əməkdaşlar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {burnoutCases.map((case_) => {
                  const level = getRiskLevel(case_.risk_score);
                  return (
                    <div 
                      key={case_.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-foreground">{case_.employee_code}</span>
                          <span className={cn("text-xs font-semibold", getRiskColor(level))}>
                            {getRiskLabel(level)}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {case_.department} • {case_.branch} • {case_.reason_category}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Son qeyd: {new Date(case_.detected_at).toLocaleString("az-Latn")}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-destructive">{case_.risk_score}</div>
                        <div className="text-xs text-muted-foreground">Risk Bal</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Department Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Şöbə üzrə Statistika
              </CardTitle>
              <CardDescription>
                Məmnuniyyət və risk göstəriciləri
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {departmentStats.map((dept, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-medium text-foreground">{dept.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {dept.employees} əməkdaş
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-foreground">
                          {dept.satisfaction}/10
                        </div>
                        {dept.burnout > 0 && (
                          <div className="text-xs text-destructive">
                            {dept.burnout} risk
                          </div>
                        )}
                      </div>
                    </div>
                    <Progress 
                      value={dept.satisfaction * 10} 
                      className="h-2"
                      indicatorClassName={dept.satisfaction < 6 ? "bg-destructive" : "bg-primary"}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HRPanel;
