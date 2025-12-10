import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format, parseISO, eachDayOfInterval, subDays } from "date-fns";
import { az } from "date-fns/locale";

interface Response {
  response_date: string;
  mood: string;
}

interface TrendLineChartProps {
  responses: Response[];
  dateRange: { from: Date; to: Date };
  title?: string;
  description?: string;
}

export const TrendLineChart = ({ 
  responses, 
  dateRange,
  title = "Əhval Trendi", 
  description = "Günlər üzrə məmnuniyyət göstəricisi" 
}: TrendLineChartProps) => {
  // Generate all days in range
  const days = eachDayOfInterval({ start: dateRange.from, end: dateRange.to });
  
  // Group responses by date
  const responsesByDate: Record<string, { good: number; normal: number; bad: number; total: number }> = {};
  
  days.forEach(day => {
    const dateStr = format(day, "yyyy-MM-dd");
    responsesByDate[dateStr] = { good: 0, normal: 0, bad: 0, total: 0 };
  });

  responses.forEach(r => {
    const dateStr = r.response_date;
    if (responsesByDate[dateStr]) {
      responsesByDate[dateStr].total++;
      if (r.mood === "Yaxşı") responsesByDate[dateStr].good++;
      else if (r.mood === "Normal") responsesByDate[dateStr].normal++;
      else if (r.mood === "Pis") responsesByDate[dateStr].bad++;
    }
  });

  const chartData = Object.entries(responsesByDate).map(([date, counts]) => ({
    date,
    displayDate: format(parseISO(date), "dd MMM", { locale: az }),
    satisfaction: counts.total > 0 
      ? Math.round(((counts.good * 100 + counts.normal * 50) / counts.total))
      : null,
    responses: counts.total,
    good: counts.good,
    bad: counts.bad,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-foreground">{data.displayDate}</p>
          <p className="text-sm text-primary">
            Məmnuniyyət: {data.satisfaction !== null ? `${data.satisfaction}%` : "Məlumat yoxdur"}
          </p>
          <p className="text-sm text-muted-foreground">
            Cavab sayı: {data.responses}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="gradient-card border-border/50 shadow-soft">
      <CardHeader>
        <CardTitle className="text-foreground">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSatisfaction" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="displayDate" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={11}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="satisfaction"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorSatisfaction)"
                connectNulls
                animationDuration={800}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
