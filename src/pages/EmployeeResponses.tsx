import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Brain, TrendingUp, TrendingDown, Minus, AlertTriangle, MessageSquare, Calendar, Filter } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

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
  { name: "Müsbət", value: 42, color: "hsl(var(--chart-2))" },
  { name: "Neytral", value: 35, color: "hsl(var(--chart-3))" },
  { name: "Mənfi", value: 23, color: "hsl(var(--chart-1))" },
];

const getMoodEmoji = (mood: number) => {
  const emojis = ["😢", "😟", "😐", "🙂", "😊"];
  return emojis[mood - 1] || "😐";
};

const getBurnoutBadge = (risk: string) => {
  switch (risk) {
    case "critical":
      return <Badge variant="destructive" className="animate-pulse">Kritik</Badge>;
    case "high":
      return <Badge variant="destructive">Yüksək</Badge>;
    case "medium":
      return <Badge variant="secondary" className="bg-amber-500/20 text-amber-600">Orta</Badge>;
    case "low":
      return <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-600">Aşağı</Badge>;
    default:
      return <Badge variant="outline">Naməlum</Badge>;
  }
};

const getSentimentIcon = (sentiment: string) => {
  switch (sentiment) {
    case "positive":
      return <TrendingUp className="h-4 w-4 text-emerald-500" />;
    case "negative":
      return <TrendingDown className="h-4 w-4 text-destructive" />;
    default:
      return <Minus className="h-4 w-4 text-muted-foreground" />;
  }
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/hr-panel")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">İşçi Cavabları</h1>
              <p className="text-sm text-muted-foreground">Anonim geri bildiriş və AI analizi</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              Son 30 gün
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ümumi Cavablar</p>
                  <p className="text-2xl font-bold">{mockResponses.length}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-primary/20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Orta Əhval</p>
                  <p className="text-2xl font-bold">3.5 / 5</p>
                </div>
                <span className="text-3xl">🙂</span>
              </div>
            </CardContent>
          </Card>
          <Card className="border-destructive/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Burnout Riski</p>
                  <p className="text-2xl font-bold text-destructive">{criticalCases.length}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-destructive/50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">AI Analizləri</p>
                  <p className="text-2xl font-bold">{mockResponses.length}</p>
                </div>
                <Brain className="h-8 w-8 text-primary/20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trends Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Zaman üzrə Trendlər
            </CardTitle>
            <CardDescription>Əhval və burnout hallarının dinamikası</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis domain={[1, 5]} className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="avgMood" 
                    stroke="hsl(var(--primary))" 
                    fillOpacity={1} 
                    fill="url(#colorMood)" 
                    name="Orta Əhval"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="burnoutCases" 
                    stroke="hsl(var(--destructive))" 
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--destructive))" }}
                    name="Burnout Halları"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Sentiment Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sentimentData.map((item) => (
            <Card key={item.name}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="text-sm text-muted-foreground">{item.value}%</span>
                </div>
                <Progress value={item.value} className="h-2" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters and Table */}
        <Tabs defaultValue="all" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <TabsList>
              <TabsTrigger value="all">Hamısı</TabsTrigger>
              <TabsTrigger value="critical" className="text-destructive">Kritik</TabsTrigger>
              <TabsTrigger value="analysis">AI Analizi</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2 flex-wrap">
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Şöbə" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Bütün Şöbələr</SelectItem>
                  <SelectItem value="Satış">Satış</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="Maliyyə">Maliyyə</SelectItem>
                  <SelectItem value="Əməliyyat">Əməliyyat</SelectItem>
                  <SelectItem value="Marketinq">Marketinq</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filial" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Bütün Filiallar</SelectItem>
                  <SelectItem value="Bakı Mərkəz">Bakı Mərkəz</SelectItem>
                  <SelectItem value="Gəncə">Gəncə</SelectItem>
                  <SelectItem value="Sumqayıt">Sumqayıt</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedRisk} onValueChange={setSelectedRisk}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Risk" />
                </SelectTrigger>
                <SelectContent>
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
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tarix</TableHead>
                    <TableHead>Əhval</TableHead>
                    <TableHead>Kateqoriya</TableHead>
                    <TableHead>Şöbə</TableHead>
                    <TableHead>Filial</TableHead>
                    <TableHead>Sentiment</TableHead>
                    <TableHead>Risk</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResponses.map((response) => (
                    <TableRow key={response.id}>
                      <TableCell className="text-muted-foreground">{response.date}</TableCell>
                      <TableCell>
                        <span className="text-xl">{getMoodEmoji(response.mood)}</span>
                      </TableCell>
                      <TableCell>{response.category}</TableCell>
                      <TableCell>{response.department}</TableCell>
                      <TableCell>{response.branch}</TableCell>
                      <TableCell>{getSentimentIcon(response.sentiment)}</TableCell>
                      <TableCell>{getBurnoutBadge(response.burnoutRisk)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="critical" className="space-y-4">
            <div className="grid gap-4">
              {criticalCases.map((response) => (
                <Card key={response.id} className="border-destructive/50">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getMoodEmoji(response.mood)}</span>
                        <div>
                          <CardTitle className="text-base">{response.category}</CardTitle>
                          <CardDescription>{response.department} • {response.branch} • {response.date}</CardDescription>
                        </div>
                      </div>
                      {getBurnoutBadge(response.burnoutRisk)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-sm italic">"{response.feedback}"</p>
                    </div>
                    <div className="flex items-start gap-2 bg-destructive/10 rounded-lg p-3">
                      <Brain className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                      <p className="text-sm text-destructive">{response.aiAnalysis}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            <div className="grid gap-4">
              {filteredResponses.map((response) => (
                <Card key={response.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getMoodEmoji(response.mood)}</span>
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
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-sm italic">"{response.feedback}"</p>
                    </div>
                    <div className="flex items-start gap-2 bg-primary/5 rounded-lg p-3 border border-primary/10">
                      <Brain className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-primary mb-1">AI Sentiment Analizi</p>
                        <p className="text-sm">{response.aiAnalysis}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default EmployeeResponses;
