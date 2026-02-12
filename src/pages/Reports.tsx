import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format, subDays, subMonths } from "date-fns";
import { az, enUS } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  Users,
  Building2,
  AlertTriangle,
  BarChart3,
  PieChart,
  Activity,
  FileSpreadsheet,
  Printer,
  Mail,
  Sparkles,
  CheckCircle2,
  Clock,
  Filter,
  FileDown
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { exportToExcel, exportToPDF, formatReportData } from "@/lib/exportUtils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLanguage } from "@/hooks/useLanguage";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const Reports = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const dateLocale = language === "az" ? az : enUS;
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedBranch, setSelectedBranch] = useState("all");

  const getDateRange = () => {
    const to = new Date();
    let from: Date;
    switch (selectedPeriod) {
      case "week":
        from = subDays(to, 7);
        break;
      case "month":
        from = subMonths(to, 1);
        break;
      case "quarter":
        from = subMonths(to, 3);
        break;
      case "year":
        from = subMonths(to, 12);
        break;
      default:
        from = subMonths(to, 1);
    }
    return { from, to };
  };

  const dateRange = getDateRange();

  const { data: responses = [] } = useQuery({
    queryKey: ["reports-responses", selectedPeriod],
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

  const { data: burnoutAlerts = [] } = useQuery({
    queryKey: ["reports-burnout", selectedPeriod],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("burnout_alerts")
        .select("*")
        .gte("detected_at", format(dateRange.from, "yyyy-MM-dd"))
        .lte("detected_at", format(dateRange.to, "yyyy-MM-dd"));
      if (error) throw error;
      return data || [];
    },
  });

  const { data: managerActions = [] } = useQuery({
    queryKey: ["reports-actions", selectedPeriod],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("manager_actions")
        .select("*")
        .gte("created_at", format(dateRange.from, "yyyy-MM-dd"))
        .lte("created_at", format(dateRange.to, "yyyy-MM-dd"));
      if (error) throw error;
      return data || [];
    },
  });

  const filteredResponses = selectedBranch === "all" 
    ? responses 
    : responses.filter(r => r.branch === selectedBranch);

  const totalResponses = filteredResponses.length;
  const uniqueEmployees = [...new Set(filteredResponses.map(r => r.employee_code))].length;
  
  const moodCounts = {
    'Yaxşı': filteredResponses.filter(r => r.mood === 'Yaxşı').length,
    'Normal': filteredResponses.filter(r => r.mood === 'Normal').length,
    'Pis': filteredResponses.filter(r => r.mood === 'Pis').length,
  };

  const satisfactionRate = totalResponses > 0 
    ? Math.round((moodCounts['Yaxşı'] / totalResponses) * 100) 
    : 0;

  const criticalAlerts = burnoutAlerts.filter(a => a.risk_score >= 80).length;
  const resolvedAlerts = burnoutAlerts.filter(a => a.is_resolved).length;
  const completedActions = managerActions.filter(a => a.status === 'completed').length;

  const branchStats = [...new Set(responses.map(r => r.branch))].map(branch => {
    const branchResponses = responses.filter(r => r.branch === branch);
    const branchTotal = branchResponses.length;
    const branchGood = branchResponses.filter(r => r.mood === 'Yaxşı').length;
    const branchBad = branchResponses.filter(r => r.mood === 'Pis').length;
    const branchAlerts = burnoutAlerts.filter(a => a.branch === branch).length;
    
    return {
      branch,
      totalResponses: branchTotal,
      satisfactionRate: branchTotal > 0 ? Math.round((branchGood / branchTotal) * 100) : 0,
      dissatisfactionRate: branchTotal > 0 ? Math.round((branchBad / branchTotal) * 100) : 0,
      alerts: branchAlerts
    };
  }).sort((a, b) => b.totalResponses - a.totalResponses);

  const departmentStats = [...new Set(responses.map(r => r.department))].map(department => {
    const deptResponses = responses.filter(r => r.department === department);
    const deptTotal = deptResponses.length;
    const deptGood = deptResponses.filter(r => r.mood === 'Yaxşı').length;
    const deptBad = deptResponses.filter(r => r.mood === 'Pis').length;
    
    return {
      department,
      totalResponses: deptTotal,
      satisfactionRate: deptTotal > 0 ? Math.round((deptGood / deptTotal) * 100) : 0,
      dissatisfactionRate: deptTotal > 0 ? Math.round((deptBad / deptTotal) * 100) : 0,
    };
  }).sort((a, b) => b.totalResponses - a.totalResponses);

  const reasonCounts: Record<string, number> = {};
  filteredResponses.forEach(r => {
    if (r.reason_category) {
      reasonCounts[r.reason_category] = (reasonCounts[r.reason_category] || 0) + 1;
    }
  });
  const topReasons = Object.entries(reasonCounts)
    .map(([reason, count]) => ({ reason, count, percentage: totalResponses > 0 ? Math.round((count / totalResponses) * 100) : 0 }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const handleExportCSV = () => {
    const csvData = filteredResponses.map(r => ({
      Date: r.response_date,
      Mood: r.mood,
      Branch: r.branch,
      Department: r.department,
      Category: r.reason_category || '',
      Reason: r.reason || ''
    }));

    const headers = Object.keys(csvData[0] || {}).join(',');
    const rows = csvData.map(row => Object.values(row).join(','));
    const csv = [headers, ...rows].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `report_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();

    toast({
      title: t("reports.csvDownloaded"),
      description: t("reports.csvDesc"),
    });
  };

  const handlePrint = () => {
    window.print();
    toast({
      title: t("reports.printReady"),
      description: t("reports.printDesc"),
    });
  };

  const handleExportExcel = () => {
    const data = formatReportData(filteredResponses, burnoutAlerts, managerActions);
    exportToExcel(data.responses, `report_${format(new Date(), 'yyyy-MM-dd')}`);
    toast({
      title: t("reports.excelDownloaded"),
      description: t("reports.excelDesc"),
    });
  };

  const handleExportPDF = () => {
    exportToPDF(
      "OBA Satisfaction Report",
      `${format(dateRange.from, "d MMM", { locale: dateLocale })} - ${format(dateRange.to, "d MMM yyyy", { locale: dateLocale })}`,
      [
        {
          title: t("reports.moodDistribution"),
          content: `
            <table>
              <tr><th>Mood</th><th>Count</th><th>%</th></tr>
              <tr><td>${t("reports.good")}</td><td>${moodCounts['Yaxşı']}</td><td>${totalResponses > 0 ? Math.round((moodCounts['Yaxşı'] / totalResponses) * 100) : 0}%</td></tr>
              <tr><td>${t("reports.normal")}</td><td>${moodCounts['Normal']}</td><td>${totalResponses > 0 ? Math.round((moodCounts['Normal'] / totalResponses) * 100) : 0}%</td></tr>
              <tr><td>${t("reports.bad")}</td><td>${moodCounts['Pis']}</td><td>${totalResponses > 0 ? Math.round((moodCounts['Pis'] / totalResponses) * 100) : 0}%</td></tr>
            </table>
          `
        },
        {
          title: t("reports.topReasons"),
          content: topReasons.length > 0 
            ? `<table><tr><th>Reason</th><th>Count</th><th>%</th></tr>${topReasons.map(r => `<tr><td>${r.reason}</td><td>${r.count}</td><td>${r.percentage}%</td></tr>`).join("")}</table>`
            : `<p>${t("reports.noReasonsData")}</p>`
        },
        {
          title: t("reports.branchStats"),
          content: branchStats.length > 0
            ? `<table><tr><th>${t("reports.branch")}</th><th>${t("reports.responses")}</th><th>${t("reports.satisfaction")}</th><th>${t("reports.alerts")}</th></tr>${branchStats.map(b => `<tr><td>${b.branch}</td><td>${b.totalResponses}</td><td>${b.satisfactionRate}%</td><td>${b.alerts}</td></tr>`).join("")}</table>`
            : `<p>${t("common.noData")}</p>`
        }
      ],
      [
        { label: t("reports.totalResponses"), value: totalResponses },
        { label: t("reports.satisfaction"), value: `${satisfactionRate}%` },
        { label: t("reports.criticalAlerts"), value: criticalAlerts },
        { label: t("reports.completedTasks"), value: completedActions }
      ]
    );
    toast({
      title: t("reports.pdfReady"),
      description: t("reports.pdfDesc"),
    });
  };

  const periodLabels: Record<string, string> = {
    week: t("common.weekly"),
    month: t("common.monthly"),
    quarter: t("common.quarterly"),
    year: t("common.yearly")
  };

  const reportCards = [
    {
      title: t("reports.totalResponses"),
      value: totalResponses.toString(),
      subtitle: `${uniqueEmployees} ${t("reports.uniqueEmployees")}`,
      icon: FileText,
      gradient: "from-blue-500 to-cyan-500",
      bgGlow: "bg-blue-500/10"
    },
    {
      title: t("reports.satisfactionRate"),
      value: `${satisfactionRate}%`,
      subtitle: `${moodCounts['Yaxşı']} ${t("reports.positiveResponses")}`,
      icon: TrendingUp,
      gradient: "from-emerald-500 to-teal-500",
      bgGlow: "bg-emerald-500/10"
    },
    {
      title: t("reports.criticalAlerts"),
      value: criticalAlerts.toString(),
      subtitle: `${resolvedAlerts} ${t("reports.resolved")}`,
      icon: AlertTriangle,
      gradient: "from-rose-500 to-red-600",
      bgGlow: "bg-rose-500/10",
      isAlert: criticalAlerts > 0
    },
    {
      title: t("reports.completedTasks"),
      value: completedActions.toString(),
      subtitle: `${managerActions.length} ${t("reports.total")}`,
      icon: CheckCircle2,
      gradient: "from-violet-500 to-purple-600",
      bgGlow: "bg-violet-500/10"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          className="absolute top-20 -left-32 w-96 h-96 bg-gradient-to-r from-primary/10 to-violet-500/10 rounded-full blur-3xl"
          animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-20 -right-32 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 rounded-full blur-3xl"
          animate={{ x: [0, -50, 0], y: [0, -30, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate("/hr-panel")}
                className="rounded-xl hover:bg-primary/10"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                  {t("reports.title")}
                </h1>
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              </div>
              <p className="text-sm text-muted-foreground">
                {format(dateRange.from, "d MMM", { locale: dateLocale })} - {format(dateRange.to, "d MMM yyyy", { locale: dateLocale })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[130px] rounded-xl border-primary/20">
                <Clock className="h-4 w-4 mr-2 text-primary" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="week">{t("common.weekly")}</SelectItem>
                <SelectItem value="month">{t("common.monthly")}</SelectItem>
                <SelectItem value="quarter">{t("common.quarterly")}</SelectItem>
                <SelectItem value="year">{t("common.yearly")}</SelectItem>
              </SelectContent>
            </Select>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button variant="outline" size="sm" onClick={handleExportCSV} className="rounded-xl border-primary/20 hover:bg-primary/10 gap-2">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">CSV</span>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button variant="outline" size="sm" onClick={handleExportExcel} className="rounded-xl border-primary/20 hover:bg-primary/10 gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                <span className="hidden sm:inline">Excel</span>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button variant="default" size="sm" onClick={handleExportPDF} className="rounded-xl gap-2 bg-gradient-to-r from-primary to-primary/80">
                <FileDown className="h-4 w-4" />
                <span className="hidden sm:inline">PDF</span>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button variant="outline" size="sm" onClick={handlePrint} className="rounded-xl border-primary/20 hover:bg-primary/10 gap-2">
                <Printer className="h-4 w-4" />
                <span className="hidden sm:inline">{t("common.print")}</span>
              </Button>
            </motion.div>
          </div>
        </div>
      </header>

      <main className="container py-6 space-y-6 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Summary Cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {reportCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
              >
                <Card className={`relative overflow-hidden border-0 shadow-lg ${card.bgGlow} backdrop-blur-sm ${card.isAlert ? 'ring-2 ring-rose-500/30' : ''}`}>
                  <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${card.gradient}`} />
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{card.title}</p>
                        <p className={`text-3xl font-bold ${card.isAlert ? 'text-rose-500' : ''}`}>
                          {card.value}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>
                      </div>
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${card.gradient} shadow-lg`}>
                        <card.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Tabs */}
          <motion.div variants={itemVariants}>
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="bg-muted/50 backdrop-blur-sm p-1 rounded-xl">
                <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-md">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  {t("reports.overview")}
                </TabsTrigger>
                <TabsTrigger value="branches" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-md">
                  <Building2 className="h-4 w-4 mr-2" />
                  {t("reports.branches")}
                </TabsTrigger>
                <TabsTrigger value="departments" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-md">
                  <Users className="h-4 w-4 mr-2" />
                  {t("reports.departments")}
                </TabsTrigger>
                <TabsTrigger value="reasons" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-md">
                  <PieChart className="h-4 w-4 mr-2" />
                  {t("reports.reasons")}
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm overflow-hidden">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500" />
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-primary" />
                        {t("reports.moodDistribution")}
                      </CardTitle>
                      <CardDescription>{periodLabels[selectedPeriod]} {t("reports.periodReport")}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        { label: t("reports.good"), count: moodCounts['Yaxşı'], color: "bg-emerald-500", percentage: totalResponses > 0 ? (moodCounts['Yaxşı'] / totalResponses) * 100 : 0 },
                        { label: t("reports.normal"), count: moodCounts['Normal'], color: "bg-amber-500", percentage: totalResponses > 0 ? (moodCounts['Normal'] / totalResponses) * 100 : 0 },
                        { label: t("reports.bad"), count: moodCounts['Pis'], color: "bg-rose-500", percentage: totalResponses > 0 ? (moodCounts['Pis'] / totalResponses) * 100 : 0 },
                      ].map((mood, index) => (
                        <motion.div key={mood.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + index * 0.1 }} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{mood.label}</span>
                            <span className="text-muted-foreground">{mood.count} ({Math.round(mood.percentage)}%)</span>
                          </div>
                          <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <motion.div className={`h-full rounded-full ${mood.color}`} initial={{ width: 0 }} animate={{ width: `${mood.percentage}%` }} transition={{ duration: 1, delay: 0.5 + index * 0.2 }} />
                          </div>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm overflow-hidden">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 to-purple-600" />
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                        {t("reports.taskSummary")}
                      </CardTitle>
                      <CardDescription>{t("reports.managerActivities")}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        { label: t("reports.completed"), count: completedActions, color: "bg-emerald-500" },
                        { label: t("reports.inProgress"), count: managerActions.filter(a => a.status === 'in_progress').length, color: "bg-amber-500" },
                        { label: t("reports.pending"), count: managerActions.filter(a => a.status === 'pending').length, color: "bg-blue-500" },
                        { label: t("reports.cancelled"), count: managerActions.filter(a => a.status === 'cancelled').length, color: "bg-gray-500" },
                      ].map((status, index) => (
                        <motion.div key={status.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + index * 0.1 }} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${status.color}`} />
                            <span className="text-sm font-medium">{status.label}</span>
                          </div>
                          <Badge variant="secondary" className="rounded-lg">{status.count}</Badge>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Branches Tab */}
              <TabsContent value="branches" className="space-y-4">
                <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      {t("reports.branchStats")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead>{t("reports.branch")}</TableHead>
                          <TableHead className="text-center">{t("reports.responses")}</TableHead>
                          <TableHead className="text-center">{t("reports.satisfaction")}</TableHead>
                          <TableHead className="text-center">{t("reports.dissatisfaction")}</TableHead>
                          <TableHead className="text-center">{t("reports.alerts")}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {branchStats.map((stat, index) => (
                          <motion.tr key={stat.branch} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="hover:bg-muted/50">
                            <TableCell className="font-medium">{stat.branch}</TableCell>
                            <TableCell className="text-center">{stat.totalResponses}</TableCell>
                            <TableCell className="text-center"><Badge className="bg-emerald-500/20 text-emerald-600 border-0">{stat.satisfactionRate}%</Badge></TableCell>
                            <TableCell className="text-center"><Badge className="bg-rose-500/20 text-rose-600 border-0">{stat.dissatisfactionRate}%</Badge></TableCell>
                            <TableCell className="text-center">{stat.alerts > 0 ? <Badge className="bg-amber-500/20 text-amber-600 border-0">{stat.alerts}</Badge> : <span className="text-muted-foreground">-</span>}</TableCell>
                          </motion.tr>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Departments Tab */}
              <TabsContent value="departments" className="space-y-4">
                <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 to-purple-600" />
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      {t("reports.departmentStats")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead>{t("reports.department")}</TableHead>
                          <TableHead className="text-center">{t("reports.responses")}</TableHead>
                          <TableHead className="text-center">{t("reports.satisfaction")}</TableHead>
                          <TableHead className="text-center">{t("reports.dissatisfaction")}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {departmentStats.map((stat, index) => (
                          <motion.tr key={stat.department} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="hover:bg-muted/50">
                            <TableCell className="font-medium">{stat.department}</TableCell>
                            <TableCell className="text-center">{stat.totalResponses}</TableCell>
                            <TableCell className="text-center"><Badge className="bg-emerald-500/20 text-emerald-600 border-0">{stat.satisfactionRate}%</Badge></TableCell>
                            <TableCell className="text-center"><Badge className="bg-rose-500/20 text-rose-600 border-0">{stat.dissatisfactionRate}%</Badge></TableCell>
                          </motion.tr>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Reasons Tab */}
              <TabsContent value="reasons" className="space-y-4">
                <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5 text-primary" />
                      {t("reports.topReasons")}
                    </CardTitle>
                    <CardDescription>{t("reports.feedbackCategories")}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {topReasons.length > 0 ? (
                      topReasons.map((reason, index) => (
                        <motion.div key={reason.reason} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + index * 0.1 }} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{reason.reason}</span>
                            <span className="text-muted-foreground">{reason.count} ({reason.percentage}%)</span>
                          </div>
                          <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <motion.div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500" initial={{ width: 0 }} animate={{ width: `${reason.percentage}%` }} transition={{ duration: 1, delay: 0.5 + index * 0.2 }} />
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        {t("reports.noReasonsData")}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Reports;
