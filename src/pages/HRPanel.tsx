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
  CalendarIcon
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

  // HR statistics (some mock values + real risk counts)
  const { data: burnoutCases = [] } = useQuery<BurnoutCase[]>({
    queryKey: ["hr-burnout-alerts"],
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

  const stats = {
    totalEmployees: 1247,
    responseRate: 87.3,
    avgSatisfaction: 7.2,
    burnoutCases: burnoutCases.length,
    criticalCases: burnoutCases.length, // bütün pis əhval cavabları kritik/yüksək sayılır
    trend: "+2.1"
  };

  // Department statistics
  const departmentStats = [
    { name: "Satış", employees: 456, satisfaction: 6.8, burnout: 8 },
    { name: "Texniki", employees: 234, satisfaction: 7.5, burnout: 4 },
    { name: "Logistika", employees: 312, satisfaction: 7.1, burnout: 7 },
    { name: "İnsan Resursları", employees: 89, satisfaction: 8.2, burnout: 2 },
    { name: "Digər", employees: 156, satisfaction: 7.4, burnout: 2 }
  ];

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
