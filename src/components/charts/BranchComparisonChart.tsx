import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Users, MessageSquare, AlertTriangle } from "lucide-react";

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
  'baku': 'Bakı', 'ganja': 'Gəncə', 'sumgait': 'Sumqayıt',
  'mingachevir': 'Mingəçevir', 'shirvan': 'Şirvan',
  'lankaran': 'Lənkəran', 'shaki': 'Şəki', 'quba': 'Quba'
};

export const BranchComparisonChart = ({ 
  responses, 
  title = "Bölgə Müqayisəsi", 
  description = "Bölgələr üzrə əhval bölgüsü (klikləyin)" 
}: BranchComparisonChartProps) => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Group by branch
  const branchData: Record<string, { good: number; normal: number; bad: number; responses: Response[] }> = {};
  
  responses.forEach(r => {
    if (!branchData[r.branch]) {
      branchData[r.branch] = { good: 0, normal: 0, bad: 0, responses: [] };
    }
    branchData[r.branch].responses.push(r);
    if (r.mood === "Yaxşı") branchData[r.branch].good++;
    else if (r.mood === "Normal") branchData[r.branch].normal++;
    else if (r.mood === "Pis") branchData[r.branch].bad++;
  });

  const chartData = Object.entries(branchData)
    .map(([branch, counts]) => ({
      branch,
      branchName: regionNames[branch] || branch.charAt(0).toUpperCase() + branch.slice(1),
      Yaxşı: counts.good,
      Normal: counts.normal,
      Pis: counts.bad,
      total: counts.good + counts.normal + counts.bad,
      responses: counts.responses,
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
      .filter(r => r.mood === 'Pis' && r.reason)
      .slice(0, 3);

    return { total, satisfaction, topReasons, recentBadResponses };
  };

  const stats = getRegionStats();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value} nəfər
            </p>
          ))}
          <p className="text-xs text-primary mt-2 border-t pt-2">Detallara baxmaq üçün klikləyin</p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <Card className="gradient-card border-border/50 shadow-soft">
        <CardHeader>
          <CardTitle className="text-foreground">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] flex items-center justify-center text-muted-foreground">
            Məlumat yoxdur
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="gradient-card border-border/50 shadow-soft">
        <CardHeader>
          <CardTitle className="text-foreground">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] cursor-pointer">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={chartData} 
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                onClick={handleBarClick}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="branchName" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  formatter={(value) => <span className="text-foreground text-sm">{value}</span>}
                />
                <Bar 
                  dataKey="Yaxşı" 
                  stackId="a" 
                  fill="hsl(142, 76%, 36%)" 
                  radius={[0, 0, 0, 0]}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                />
                <Bar 
                  dataKey="Normal" 
                  stackId="a" 
                  fill="hsl(45, 93%, 47%)"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                />
                <Bar 
                  dataKey="Pis" 
                  stackId="a" 
                  fill="hsl(0, 84%, 60%)" 
                  radius={[4, 4, 0, 0]}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Region Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Users className="w-5 h-5 text-primary" />
              {selectedRegionName} Bölgəsi
            </DialogTitle>
            <DialogDescription>
              Detallı statistika və əhval göstəriciləri
            </DialogDescription>
          </DialogHeader>

          {selectedData && stats && (
            <div className="space-y-6 mt-4">
              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 rounded-lg bg-status-good/10 border border-status-good/20">
                  <div className="text-2xl font-bold text-status-good">{selectedData.good}</div>
                  <div className="text-xs text-muted-foreground">Yaxşı</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-status-normal/10 border border-status-normal/20">
                  <div className="text-2xl font-bold text-status-normal">{selectedData.normal}</div>
                  <div className="text-xs text-muted-foreground">Normal</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-status-bad/10 border border-status-bad/20">
                  <div className="text-2xl font-bold text-status-bad">{selectedData.bad}</div>
                  <div className="text-xs text-muted-foreground">Pis</div>
                </div>
              </div>

              {/* Satisfaction Score */}
              <div className="p-4 rounded-lg border bg-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Məmnuniyyət İndeksi</span>
                  <Badge variant={Number(stats.satisfaction) >= 7 ? "default" : Number(stats.satisfaction) >= 4 ? "secondary" : "destructive"}>
                    {stats.satisfaction}/10
                  </Badge>
                </div>
                <Progress value={Number(stats.satisfaction) * 10} className="h-2" />
                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                  {Number(stats.satisfaction) >= 5 ? (
                    <><TrendingUp className="w-3 h-3 text-status-good" /> Yaxşı göstərici</>
                  ) : (
                    <><TrendingDown className="w-3 h-3 text-status-bad" /> Diqqət tələb edir</>
                  )}
                </div>
              </div>

              {/* Top Reasons */}
              {stats.topReasons.length > 0 && (
                <div className="p-4 rounded-lg border bg-card">
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Əsas Şikayət Səbəbləri
                  </h4>
                  <div className="space-y-2">
                    {stats.topReasons.map(([reason, count], idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{reason}</span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Bad Responses */}
              {stats.recentBadResponses.length > 0 && (
                <div className="p-4 rounded-lg border border-destructive/30 bg-destructive/5">
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2 text-destructive">
                    <AlertTriangle className="w-4 h-4" />
                    Son Pis Əhval Qeydləri
                  </h4>
                  <div className="space-y-2">
                    {stats.recentBadResponses.map((r, idx) => (
                      <div key={idx} className="text-sm p-2 rounded bg-background border">
                        <p className="text-muted-foreground line-clamp-2">"{r.reason}"</p>
                        {r.reason_category && (
                          <Badge variant="outline" className="mt-1 text-xs">{r.reason_category}</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Total Responses */}
              <div className="text-center text-sm text-muted-foreground pt-2 border-t">
                Ümumi cavab sayı: <strong>{stats.total}</strong>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
