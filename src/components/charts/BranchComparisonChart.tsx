import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface Response {
  branch: string;
  mood: string;
}

interface BranchComparisonChartProps {
  responses: Response[];
  title?: string;
  description?: string;
}

export const BranchComparisonChart = ({ 
  responses, 
  title = "Bölgə Müqayisəsi", 
  description = "Bölgələr üzrə əhval bölgüsü" 
}: BranchComparisonChartProps) => {
  // Group by branch
  const branchData: Record<string, { good: number; normal: number; bad: number }> = {};
  
  responses.forEach(r => {
    if (!branchData[r.branch]) {
      branchData[r.branch] = { good: 0, normal: 0, bad: 0 };
    }
    if (r.mood === "Yaxşı") branchData[r.branch].good++;
    else if (r.mood === "Normal") branchData[r.branch].normal++;
    else if (r.mood === "Pis") branchData[r.branch].bad++;
  });

  const regionNames: Record<string, string> = {
    'baku': 'Bakı', 'ganja': 'Gəncə', 'sumgait': 'Sumqayıt',
    'mingachevir': 'Mingəçevir', 'shirvan': 'Şirvan',
    'lankaran': 'Lənkəran', 'shaki': 'Şəki', 'quba': 'Quba'
  };

  const chartData = Object.entries(branchData)
    .map(([branch, counts]) => ({
      branch: regionNames[branch] || branch.charAt(0).toUpperCase() + branch.slice(1),
      Yaxşı: counts.good,
      Normal: counts.normal,
      Pis: counts.bad,
    }))
    .sort((a, b) => (b.Yaxşı + b.Normal + b.Pis) - (a.Yaxşı + a.Normal + a.Pis))
    .slice(0, 8);

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
    <Card className="gradient-card border-border/50 shadow-soft">
      <CardHeader>
        <CardTitle className="text-foreground">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="branch" 
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
              />
              <Bar 
                dataKey="Normal" 
                stackId="a" 
                fill="hsl(45, 93%, 47%)" 
              />
              <Bar 
                dataKey="Pis" 
                stackId="a" 
                fill="hsl(0, 84%, 60%)" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
