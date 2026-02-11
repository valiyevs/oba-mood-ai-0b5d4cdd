import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Users, MessageSquare, AlertTriangle, MapPin, Smile, Meh, Frown } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Response {
  branch: string;
  mood: string;
  reason_category?: string | null;
  reason?: string | null;
  response_date?: string;
  employee_code?: string;
}

interface BranchComparisonChartProps {
  responses: Response[];
  title?: string;
  description?: string;
}

const regionNames: Record<string, string> = {
  'baku': 'Baku', 'ganja': 'Ganja', 'sumgait': 'Sumgait',
  'mingachevir': 'Mingachevir', 'shirvan': 'Shirvan',
  'lankaran': 'Lankaran', 'shaki': 'Shaki', 'quba': 'Guba'
};

const MOOD_COLORS = {
  good: { gradient: ["#22c55e", "#16a34a"], label: "Good" },
  normal: { gradient: ["#eab308", "#ca8a04"], label: "Normal" },
  bad: { gradient: ["#ef4444", "#dc2626"], label: "Bad" },
};

export const BranchComparisonChart = ({ 
  responses, 
  title = "Regional Comparison", 
  description = "Mood distribution by region (click for details)" 
}: BranchComparisonChartProps) => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeBar, setActiveBar] = useState<number | null>(null);

  // Group by branch
  const branchData: Record<string, { good: number; normal: number; bad: number; responses: Response[] }> = {};
  
  responses.forEach(r => {
    if (!branchData[r.branch]) {
      branchData[r.branch] = { good: 0, normal: 0, bad: 0, responses: [] };
    }
    branchData[r.branch].responses.push(r);
    if (r.mood === "Yaxşı" || r.mood === "Good") branchData[r.branch].good++;
    else if (r.mood === "Normal") branchData[r.branch].normal++;
    else if (r.mood === "Pis" || r.mood === "Bad") branchData[r.branch].bad++;
  });

  const chartData = Object.entries(branchData)
    .map(([branch, counts]) => ({
      branch,
      branchName: regionNames[branch] || branch.charAt(0).toUpperCase() + branch.slice(1),
      Good: counts.good,
      Normal: counts.normal,
      Bad: counts.bad,
      total: counts.good + counts.normal + counts.bad,
      responses: counts.responses,
      satisfaction: counts.good + counts.normal + counts.bad > 0 
        ? Math.round(((counts.good * 100 + counts.normal * 50) / (counts.good + counts.normal + counts.bad)))
        : 0,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 8);

  const handleBarClick = (data: any) => {
    if (data && data.activePayload && data.activePayload[0]) {
      const clickedRegion = data.activePayload[0].payload.branch;
      setSelectedRegion(clickedRegion);
      setDialogOpen(true);
    }
  };

  const selectedData = selectedRegion ? branchData[selectedRegion] : null;
  const selectedRegionName = selectedRegion ? (regionNames[selectedRegion] || selectedRegion) : '';

  // Calculate detailed stats for selected region
  const getRegionStats = () => {
    if (!selectedData) return null;
    
    const total = selectedData.good + selectedData.normal + selectedData.bad;
    const satisfaction = total > 0 ? ((selectedData.good * 10 + selectedData.normal * 5) / total).toFixed(1) : 0;
    
    // Group reasons
    const reasonCounts: Record<string, number> = {};
    selectedData.responses.forEach(r => {
      if (r.reason_category) {
        reasonCounts[r.reason_category] = (reasonCounts[r.reason_category] || 0) + 1;
      }
    });
    const topReasons = Object.entries(reasonCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Recent responses
    const recentBadResponses = selectedData.responses
      .filter(r => (r.mood === 'Pis' || r.mood === 'Bad') && r.reason)
      .slice(0, 3);

    return { total, satisfaction, topReasons, recentBadResponses };
  };

  const stats = getRegionStats();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload;
      return (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card/95 backdrop-blur-sm border border-border rounded-xl p-4 shadow-xl"
        >
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
            <MapPin className="w-4 h-4 text-primary" />
            <p className="font-bold text-foreground">{label}</p>
          </div>
          
          <div className="space-y-2">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-2 text-sm">
                  <span 
                    className="w-2.5 h-2.5 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  />
                  {entry.name}
                </span>
                <span className="font-semibold text-sm">{entry.value}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-3 pt-2 border-t border-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Satisfaction</span>
              <span className={cn(
                "font-bold",
                data?.satisfaction >= 70 ? "text-emerald-500" : 
                data?.satisfaction >= 40 ? "text-amber-500" : "text-rose-500"
              )}>
                {data?.satisfaction}%
              </span>
            </div>
          </div>
          
          <p className="text-xs text-primary mt-2 text-center">Click for details</p>
        </motion.div>
      );
    }
    return null;
  };

  const CustomLegend = () => (
    <div className="flex justify-center gap-4 mt-2">
      {Object.entries(MOOD_COLORS).map(([key, value]) => {
        const Icon = key === 'good' ? Smile : key === 'normal' ? Meh : Frown;
        return (
          <div key={key} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ background: `linear-gradient(135deg, ${value.gradient[0]}, ${value.gradient[1]})` }}
            />
            <Icon className="w-4 h-4" style={{ color: value.gradient[0] }} />
            <span className="text-sm text-foreground">{value.label}</span>
          </div>
        );
      })}
    </div>
  );

  if (chartData.length === 0) {
    return (
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-foreground">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No data</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="relative overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-xl transition-all duration-500 group">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <CardHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 group-hover:from-blue-500/30 group-hover:to-blue-500/10 transition-all duration-300">
                <MapPin className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <CardTitle className="text-foreground">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative">
            {/* Quick stats */}
            <div className="flex flex-wrap gap-2 mb-4">
              {chartData.slice(0, 4).map((item, idx) => (
                <motion.div
                  key={item.branch}
                  whileHover={{ scale: 1.02 }}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer transition-all duration-300",
                    activeBar === idx ? "bg-primary/10 shadow-md" : "bg-muted/50 hover:bg-muted"
                  )}
                  onMouseEnter={() => setActiveBar(idx)}
                  onMouseLeave={() => setActiveBar(null)}
                  onClick={() => {
                    setSelectedRegion(item.branch);
                    setDialogOpen(true);
                  }}
                >
                  <span className="text-xs font-medium text-foreground">{item.branchName}</span>
                  <Badge variant="outline" className={cn(
                    "text-xs",
                    item.satisfaction >= 70 ? "border-emerald-500/50 text-emerald-600" :
                    item.satisfaction >= 40 ? "border-amber-500/50 text-amber-600" :
                    "border-rose-500/50 text-rose-600"
                  )}>
                    {item.satisfaction}%
                  </Badge>
                </motion.div>
              ))}
            </div>

            <div className="h-[260px] cursor-pointer">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={chartData} 
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  onClick={handleBarClick}
                  onMouseLeave={() => setActiveBar(null)}
                >
                  <defs>
                    <linearGradient id="goodGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity={0.9}/>
                      <stop offset="100%" stopColor="#16a34a" stopOpacity={0.9}/>
                    </linearGradient>
                    <linearGradient id="normalGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#eab308" stopOpacity={0.9}/>
                      <stop offset="100%" stopColor="#ca8a04" stopOpacity={0.9}/>
                    </linearGradient>
                    <linearGradient id="badGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity={0.9}/>
                      <stop offset="100%" stopColor="#dc2626" stopOpacity={0.9}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis 
                    dataKey="branchName" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12} 
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted) / 0.3)", radius: 4 }} />
                  <Bar 
                    dataKey="Good" 
                    stackId="a" 
                    fill="url(#goodGradient)" 
                    radius={[0, 0, 0, 0]}
                    className="cursor-pointer transition-opacity"
                    onMouseEnter={(_, index) => setActiveBar(index)}
                  />
                  <Bar 
                    dataKey="Normal" 
                    stackId="a" 
                    fill="url(#normalGradient)"
                    className="cursor-pointer transition-opacity"
                  />
                  <Bar 
                    dataKey="Bad" 
                    stackId="a" 
                    fill="url(#badGradient)" 
                    radius={[4, 4, 0, 0]}
                    className="cursor-pointer transition-opacity"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <CustomLegend />
          </CardContent>
        </Card>
      </motion.div>

      {/* Region Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <div className="p-2 rounded-lg bg-primary/10">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              {selectedRegionName} Region
            </DialogTitle>
            <DialogDescription>
              Detailed statistics and mood metrics
            </DialogDescription>
          </DialogHeader>

          {selectedData && stats && (
            <div className="space-y-6 mt-4">
              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-3">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-center p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20"
                >
                  <Smile className="w-6 h-6 mx-auto mb-2 text-emerald-500" />
                  <div className="text-2xl font-bold text-emerald-500">{selectedData.good}</div>
                  <div className="text-xs text-muted-foreground">Good</div>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20"
                >
                  <Meh className="w-6 h-6 mx-auto mb-2 text-amber-500" />
                  <div className="text-2xl font-bold text-amber-500">{selectedData.normal}</div>
                  <div className="text-xs text-muted-foreground">Normal</div>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center p-4 rounded-xl bg-gradient-to-br from-rose-500/10 to-rose-500/5 border border-rose-500/20"
                >
                  <Frown className="w-6 h-6 mx-auto mb-2 text-rose-500" />
                  <div className="text-2xl font-bold text-rose-500">{selectedData.bad}</div>
                  <div className="text-xs text-muted-foreground">Bad</div>
                </motion.div>
              </div>

              {/* Satisfaction Score */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-4 rounded-xl border bg-card"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Satisfaction Index</span>
                  <Badge variant={Number(stats.satisfaction) >= 7 ? "default" : Number(stats.satisfaction) >= 4 ? "secondary" : "destructive"}>
                    {stats.satisfaction}/10
                  </Badge>
                </div>
                <Progress value={Number(stats.satisfaction) * 10} className="h-2" />
                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                  {Number(stats.satisfaction) >= 5 ? (
                    <><TrendingUp className="w-3 h-3 text-emerald-500" /> Good performance</>
                  ) : (
                    <><TrendingDown className="w-3 h-3 text-rose-500" /> Needs attention</>
                  )}
                </div>
              </motion.div>

              {/* Top Reasons */}
              {stats.topReasons.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="p-4 rounded-xl border bg-card"
                >
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    Top Complaints
                  </h4>
                  <div className="space-y-2">
                    {stats.topReasons.map(([reason, count], idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{reason}</span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
