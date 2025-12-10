import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface DepartmentData {
  name: string;
  employees: number;
  satisfaction: number;
  burnout: number;
}

interface DepartmentRadarChartProps {
  data: DepartmentData[];
  title?: string;
  description?: string;
}

export const DepartmentRadarChart = ({ 
  data, 
  title = "Şöbə Performansı", 
  description = "Şöbələr üzrə məmnuniyyət müqayisəsi" 
}: DepartmentRadarChartProps) => {
  const chartData = data.slice(0, 6).map(dept => ({
    department: dept.name.length > 10 ? dept.name.slice(0, 10) + "..." : dept.name,
    fullName: dept.name,
    satisfaction: dept.satisfaction * 10,
    risk: dept.burnout * 10,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-foreground">{data.fullName}</p>
          <p className="text-sm text-primary">
            Məmnuniyyət: {(data.satisfaction / 10).toFixed(1)}/10
          </p>
          <p className="text-sm text-destructive">
            Risk sayı: {data.risk / 10}
          </p>
        </div>
      );
    }
    return null;
  };

  if (data.length === 0) {
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
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis 
                dataKey="department" 
                tick={{ fill: "hsl(var(--foreground))", fontSize: 11 }}
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]} 
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Radar
                name="Məmnuniyyət"
                dataKey="satisfaction"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.3}
                animationDuration={800}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
