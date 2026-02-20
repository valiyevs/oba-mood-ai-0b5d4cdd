import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Brain, TrendingUp, TrendingDown, Minus, AlertTriangle, MessageSquare, Calendar, Filter, Sparkles, Activity, Users, Building2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { MobileNavMenu } from "@/components/MobileNavMenu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSelector } from "@/components/LanguageSelector";

// Mock data for anonymized responses
const mockResponses = [
  {
    id: "R001",
    date: "2024-01-15",
    mood: 2,
    category: "İş Yükü",
    feedback: "Son həftələrdə iş yükü çox artıb. Əlavə dəstək lazımdır.",
    department: "Satış",
    branch: "Bakı Mərkəz",
    sentiment: "negative",
    burnoutRisk: "high",
    aiAnalysis: "Yüksək stress səviyyəsi aşkarlandı. İş yükü ilə bağlı narahatlıq var. Dərhal müdaxilə tövsiyə olunur."
  },
  {
    id: "R002",
    date: "2024-01-15",
    mood: 4,
    category: "Komanda",
    feedback: "Komanda ilə əməkdaşlıq çox yaxşıdır. Layihələr uğurla irəliləyir.",
    department: "IT",
    branch: "Bakı Mərkəz",
    sentiment: "positive",
    burnoutRisk: "low",
    aiAnalysis: "Müsbət iş mühiti. Komanda dinamikası sağlamdır. Heç bir risk aşkarlanmadı."
  },
  {
    id: "R003",
    date: "2024-01-14",
    mood: 3,
    category: "Menecment",
    feedback: "Rəhbərlikdən daha çox geri bildirim almaq istərdim.",
    department: "Maliyyə",
    branch: "Gəncə",
    sentiment: "neutral",
    burnoutRisk: "medium",
    aiAnalysis: "Kommunikasiya boşluğu var. Rəhbərliklə əlaqənin gücləndirilməsi tövsiyə olunur."
  },
  {
    id: "R004",
    date: "2024-01-14",
    mood: 1,
    category: "İş-Həyat Balansı",
    feedback: "Həddindən artıq iş saatları məni yorur. Ailə ilə vaxt keçirə bilmirəm.",
    department: "Əməliyyat",
    branch: "Sumqayıt",
    sentiment: "negative",
    burnoutRisk: "critical",
    aiAnalysis: "KRİTİK: Ciddi burnout əlamətləri. İş-həyat balansı pozulub. Təcili müdaxilə tələb olunur."
  },
  {
    id: "R005",
    date: "2024-01-13",
    mood: 5,
    category: "Karyera",
    feedback: "Yeni layihə çox maraqlıdır. Özümü inkişaf etdirirəm.",
    department: "Marketinq",
    branch: "Bakı Mərkəz",
    sentiment: "positive",
    burnoutRisk: "low",
    aiAnalysis: "Yüksək motivasiya və məmnuniyyət. Karyera inkişafı müsbət təsir edir."
  },
  {
    id: "R006",
    date: "2024-01-13",
    mood: 2,
    category: "Resurslar",
    feedback: "Lazımi avadanlıq və proqram təminatı çatışmır.",
    department: "IT",
    branch: "Gəncə",
    sentiment: "negative",
    burnoutRisk: "medium",
    aiAnalysis: "Resurs çatışmazlığı frustrasiyaya səbəb olur. Texniki dəstək artırılmalıdır."
  }
];

// Trend data over time
const trendData = [
  { date: "01 Yan", avgMood: 3.2, responses: 45, burnoutCases: 3 },
  { date: "02 Yan", avgMood: 3.4, responses: 52, burnoutCases: 2 },
  { date: "03 Yan", avgMood: 3.1, responses: 48, burnoutCases: 4 },
  { date: "04 Yan", avgMood: 3.5, responses: 61, burnoutCases: 2 },
  { date: "05 Yan", avgMood: 3.3, responses: 55, burnoutCases: 3 },
  { date: "06 Yan", avgMood: 3.6, responses: 58, burnoutCases: 1 },
  { date: "07 Yan", avgMood: 3.4, responses: 50, burnoutCases: 2 },
  { date: "08 Yan", avgMood: 3.7, responses: 63, burnoutCases: 1 },
  { date: "09 Yan", avgMood: 3.5, responses: 57, burnoutCases: 2 },
  { date: "10 Yan", avgMood: 3.8, responses: 65, burnoutCases: 1 },
];

// Sentiment distribution
const sentimentData = [
  { name: "Müsbət", value: 42, color: "emerald", icon: TrendingUp },
  { name: "Neytral", value: 35, color: "amber", icon: Minus },
  { name: "Mənfi", value: 23, color: "rose", icon: TrendingDown },
];

const getMoodEmoji = (mood: number) => {
  const emojis = ["😢", "😟", "😐", "🙂", "😊"];
  return emojis[mood - 1] || "😐";
};

const getBurnoutBadge = (risk: string) => {
  switch (risk) {
    case "critical":
      return (
        <Badge className="bg-gradient-to-r from-rose-500 to-red-600 text-white border-0 animate-pulse shadow-lg shadow-rose-500/30">
          Kritik
        </Badge>
      );
    case "high":
      return (
        <Badge className="bg-gradient-to-r from-orange-500 to-rose-500 text-white border-0 shadow-md">
          Yüksək
        </Badge>
      );
    case "medium":
      return (
        <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 shadow-md">
          Orta
        </Badge>
      );
    case "low":
      return (
        <Badge className="bg-gradient-to-r from-emerald-400 to-teal-500 text-white border-0 shadow-md">
          Aşağı
        </Badge>
      );
    default:
      return <Badge variant="outline">Naməlum</Badge>;
  }
};

const getSentimentIcon = (sentiment: string) => {
  switch (sentiment) {
    case "positive":
      return <TrendingUp className="h-4 w-4 text-emerald-500" />;
    case "negative":
      return <TrendingDown className="h-4 w-4 text-rose-500" />;
    default:
      return <Minus className="h-4 w-4 text-amber-500" />;
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const EmployeeResponses = () => {
  const navigate = useNavigate();
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [selectedRisk, setSelectedRisk] = useState<string>("all");

  const filteredResponses = mockResponses.filter((response) => {
    if (selectedDepartment !== "all" && response.department !== selectedDepartment) return false;
    if (selectedBranch !== "all" && response.branch !== selectedBranch) return false;
    if (selectedRisk !== "all" && response.burnoutRisk !== selectedRisk) return false;
    return true;
  });

  const criticalCases = mockResponses.filter(r => r.burnoutRisk === "critical" || r.burnoutRisk === "high");

  const statsCards = [
    {
      title: "Ümumi Cavablar",
      value: mockResponses.length.toString(),
      icon: MessageSquare,
      gradient: "from-blue-500 to-cyan-500",
      bgGlow: "bg-blue-500/10"
    },
    {
      title: "Orta Əhval",
      value: "3.5 / 5",
      emoji: "🙂",
      icon: Activity,
      gradient: "from-emerald-500 to-teal-500",
      bgGlow: "bg-emerald-500/10"
    },
    {
      title: "Tükənmişlik Riski",
      value: criticalCases.length.toString(),
      icon: AlertTriangle,
      gradient: "from-rose-500 to-red-600",
      bgGlow: "bg-rose-500/10",
      isAlert: true
    },
    {
      title: "AI Analizləri",
      value: mockResponses.length.toString(),
      icon: Brain,
      gradient: "from-violet-500 to-purple-600",
      bgGlow: "bg-violet-500/10"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          className="absolute top-20 -left-32 w-96 h-96 bg-gradient-to-r from-primary/10 to-violet-500/10 rounded-full blur-3xl"
          animate={{ 
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-20 -right-32 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 rounded-full blur-3xl"
          animate={{ 
            x: [0, -50, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-rose-500/5 to-amber-500/5 rounded-full blur-3xl"
          animate={{ 
            rotate: [0, 180, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="hidden sm:block">
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
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                  İşçi Cavabları
                </h1>
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              </div>
              <p className="text-sm text-muted-foreground hidden sm:block">Anonim geri bildiriş və AI analizi</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSelector />
            <ThemeToggle />
            <MobileNavMenu />
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="hidden sm:block">
              <Button variant="outline" size="sm" className="rounded-xl border-primary/20 hover:bg-primary/10 hover:border-primary/40">
                <Calendar className="mr-2 h-4 w-4 text-primary" />
                Son 30 gün
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
          {/* Quick Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {statsCards.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
              >
                <Card className={`relative overflow-hidden border-0 shadow-lg ${stat.bgGlow} backdrop-blur-sm ${stat.isAlert ? 'ring-2 ring-rose-500/30' : ''}`}>
                  {/* Gradient border effect */}
                  <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${stat.gradient}`} />
                  
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                        <div className="flex items-center gap-2">
                          <p className={`text-3xl font-bold ${stat.isAlert ? 'text-rose-500' : ''}`}>
                            {stat.value}
                          </p>
                          {stat.emoji && <span className="text-2xl">{stat.emoji}</span>}
                        </div>
                      </div>
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Trends Chart */}
          <motion.div variants={itemVariants}>
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-violet-500 to-cyan-500" />
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-violet-500 shadow-lg">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>Zaman üzrə Trendlər</CardTitle>
                    <CardDescription>Əhval və tükənmişlik hallarının dinamikası</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorBurnout" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                      <XAxis dataKey="date" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis domain={[1, 5]} className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))", 
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "12px",
                          boxShadow: "0 10px 40px -10px rgba(0,0,0,0.3)"
                        }} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="avgMood" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorMood)" 
                        name="Orta Əhval"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="burnoutCases" 
                        stroke="#f43f5e" 
                        strokeWidth={2}
                        dot={{ fill: "#f43f5e", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, fill: "#f43f5e", stroke: "#fff", strokeWidth: 2 }}
                        name="Tükənmişlik Halları"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sentiment Distribution */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sentimentData.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm overflow-hidden">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${
                          item.color === 'emerald' ? 'bg-emerald-500/20' :
                          item.color === 'amber' ? 'bg-amber-500/20' : 'bg-rose-500/20'
                        }`}>
                          <item.icon className={`h-4 w-4 ${
                            item.color === 'emerald' ? 'text-emerald-500' :
                            item.color === 'amber' ? 'text-amber-500' : 'text-rose-500'
                          }`} />
                        </div>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <span className={`text-lg font-bold ${
                        item.color === 'emerald' ? 'text-emerald-500' :
                        item.color === 'amber' ? 'text-amber-500' : 'text-rose-500'
                      }`}>{item.value}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${
                          item.color === 'emerald' ? 'bg-gradient-to-r from-emerald-400 to-teal-500' :
                          item.color === 'amber' ? 'bg-gradient-to-r from-amber-400 to-orange-500' :
                          'bg-gradient-to-r from-rose-400 to-red-500'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${item.value}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.2, ease: "easeOut" }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Filters and Table */}
          <motion.div variants={itemVariants}>
            <Tabs defaultValue="all" className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <TabsList className="bg-muted/50 backdrop-blur-sm p-1 rounded-xl">
                  <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-md">
                    <Users className="h-4 w-4 mr-2" />
                    Hamısı
                  </TabsTrigger>
                  <TabsTrigger value="critical" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-md text-rose-500 data-[state=active]:text-rose-600">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Kritik
                  </TabsTrigger>
                  <TabsTrigger value="analysis" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-md">
                    <Brain className="h-4 w-4 mr-2" />
                    AI Analizi
                  </TabsTrigger>
                </TabsList>
                
                <div className="flex gap-2 flex-wrap">
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger className="w-[150px] rounded-xl border-primary/20 bg-background/50 backdrop-blur-sm">
                      <Building2 className="h-4 w-4 mr-2 text-primary" />
                      <SelectValue placeholder="Şöbə" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="all">Bütün Şöbələr</SelectItem>
                      <SelectItem value="Satış">Satış</SelectItem>
                      <SelectItem value="IT">IT</SelectItem>
                      <SelectItem value="Maliyyə">Maliyyə</SelectItem>
                      <SelectItem value="Əməliyyat">Əməliyyat</SelectItem>
                      <SelectItem value="Marketinq">Marketinq</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                    <SelectTrigger className="w-[150px] rounded-xl border-primary/20 bg-background/50 backdrop-blur-sm">
                      <Filter className="h-4 w-4 mr-2 text-primary" />
                      <SelectValue placeholder="Filial" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="all">Bütün Filiallar</SelectItem>
                      <SelectItem value="Bakı Mərkəz">Bakı Mərkəz</SelectItem>
                      <SelectItem value="Gəncə">Gəncə</SelectItem>
                      <SelectItem value="Sumqayıt">Sumqayıt</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedRisk} onValueChange={setSelectedRisk}>
                    <SelectTrigger className="w-[150px] rounded-xl border-primary/20 bg-background/50 backdrop-blur-sm">
                      <AlertTriangle className="h-4 w-4 mr-2 text-primary" />
                      <SelectValue placeholder="Risk" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="all">Bütün Risklər</SelectItem>
                      <SelectItem value="critical">Kritik</SelectItem>
                      <SelectItem value="high">Yüksək</SelectItem>
                      <SelectItem value="medium">Orta</SelectItem>
                      <SelectItem value="low">Aşağı</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <TabsContent value="all" className="space-y-4">
                <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-b border-border/50">
                        <TableHead className="font-semibold">Tarix</TableHead>
                        <TableHead className="font-semibold">Əhval</TableHead>
                        <TableHead className="font-semibold">Kateqoriya</TableHead>
                        <TableHead className="font-semibold">Şöbə</TableHead>
                        <TableHead className="font-semibold">Filial</TableHead>
                        <TableHead className="font-semibold">Sentiment</TableHead>
                        <TableHead className="font-semibold">Risk</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredResponses.map((response, index) => (
                        <motion.tr
                          key={response.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="group hover:bg-muted/50 transition-colors border-b border-border/30"
                        >
                          <TableCell className="text-muted-foreground">{response.date}</TableCell>
                          <TableCell>
                            <span className="text-2xl group-hover:scale-110 transition-transform inline-block">
                              {getMoodEmoji(response.mood)}
                            </span>
                          </TableCell>
                          <TableCell className="font-medium">{response.category}</TableCell>
                          <TableCell>{response.department}</TableCell>
                          <TableCell>{response.branch}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {getSentimentIcon(response.sentiment)}
                            </div>
                          </TableCell>
                          <TableCell>{getBurnoutBadge(response.burnoutRisk)}</TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </TabsContent>

              <TabsContent value="critical" className="space-y-4">
                <div className="grid gap-4">
                  {criticalCases.map((response, index) => (
                    <motion.div
                      key={response.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm overflow-hidden ring-2 ring-rose-500/30">
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-500 to-red-600" />
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <motion.span 
                                className="text-3xl"
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                {getMoodEmoji(response.mood)}
                              </motion.span>
                              <div>
                                <CardTitle className="text-base">{response.category}</CardTitle>
                                <CardDescription>{response.department} • {response.branch} • {response.date}</CardDescription>
                              </div>
                            </div>
                            {getBurnoutBadge(response.burnoutRisk)}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
                            <p className="text-sm italic">"{response.feedback}"</p>
                          </div>
                          <div className="flex items-start gap-3 bg-gradient-to-r from-rose-500/10 to-red-500/10 rounded-xl p-4 border border-rose-500/20">
                            <div className="p-2 rounded-lg bg-rose-500/20">
                              <Brain className="h-4 w-4 text-rose-500" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-rose-500 mb-1">AI Təhlili</p>
                              <p className="text-sm text-rose-600 dark:text-rose-400">{response.aiAnalysis}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="analysis" className="space-y-4">
                <div className="grid gap-4">
                  {filteredResponses.map((response, index) => (
                    <motion.div
                      key={response.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm overflow-hidden group hover:shadow-xl transition-all">
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 to-purple-600" />
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl group-hover:scale-110 transition-transform">
                                {getMoodEmoji(response.mood)}
                              </span>
                              <div>
                                <CardTitle className="text-base">{response.category}</CardTitle>
                                <CardDescription>{response.department} • {response.branch}</CardDescription>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {getSentimentIcon(response.sentiment)}
                              {getBurnoutBadge(response.burnoutRisk)}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
                            <p className="text-sm italic">"{response.feedback}"</p>
                          </div>
                          <div className="flex items-start gap-3 bg-gradient-to-r from-primary/10 to-violet-500/10 rounded-xl p-4 border border-primary/20">
                            <div className="p-2 rounded-lg bg-primary/20">
                              <Sparkles className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-primary mb-1">AI Sentiment Analizi</p>
                              <p className="text-sm">{response.aiAnalysis}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default EmployeeResponses;
