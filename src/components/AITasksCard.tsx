import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Sparkles, 
  RefreshCw, 
  AlertTriangle, 
  Clock, 
  User, 
  CheckCircle2,
  Circle,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface AITask {
  id: string;
  title: string;
  description: string;
  priority: "kritik" | "yüksək" | "orta";
  targetEmployee?: string;
  department?: string;
  dueDate?: string;
  category: string;
}

interface AITasksCardProps {
  tasks: AITask[];
  isLoading: boolean;
  onRefresh: () => void;
  onTaskComplete?: (taskId: string) => void;
}

export const AITasksCard = ({ tasks, isLoading, onRefresh, onTaskComplete }: AITasksCardProps) => {
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  const handleTaskToggle = (taskId: string) => {
    setCompletedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
        onTaskComplete?.(taskId);
      }
      return newSet;
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "kritik":
        return "bg-destructive/10 text-destructive border-destructive/30";
      case "yüksək":
        return "bg-orange-500/10 text-orange-600 border-orange-500/30";
      case "orta":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "kritik":
        return <AlertTriangle className="w-3 h-3" />;
      case "yüksək":
        return <Clock className="w-3 h-3" />;
      default:
        return <Circle className="w-3 h-3" />;
    }
  };

  const activeTasks = tasks.filter(t => !completedTasks.has(t.id));
  const completedCount = completedTasks.size;

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">AI Tapşırıqlar</CardTitle>
              <CardDescription>Kritik vəziyyətlər üçün təklif olunan addımlar</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {completedCount > 0 && (
              <Badge variant="secondary" className="gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {completedCount} tamamlandı
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Yenilə
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mb-3" />
            <p>AI tapşırıqlar yaradılır...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <CheckCircle2 className="h-12 w-12 mb-3 text-status-good" />
            <p className="font-medium">Kritik vəziyyət yoxdur</p>
            <p className="text-sm">Bütün göstəricilər normal səviyyədədir</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task, index) => {
              const isCompleted = completedTasks.has(task.id);
              return (
                <div
                  key={task.id}
                  className={cn(
                    "group flex items-start gap-3 p-4 rounded-lg border transition-all duration-200",
                    isCompleted 
                      ? "bg-muted/30 border-border/50 opacity-60" 
                      : "bg-card hover:bg-accent/30 border-border hover:border-primary/30"
                  )}
                >
                  <Checkbox
                    checked={isCompleted}
                    onCheckedChange={() => handleTaskToggle(task.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className={cn(
                        "font-medium text-sm",
                        isCompleted && "line-through text-muted-foreground"
                      )}>
                        {task.title}
                      </h4>
                      <Badge 
                        variant="outline" 
                        className={cn("shrink-0 gap-1", getPriorityColor(task.priority))}
                      >
                        {getPriorityIcon(task.priority)}
                        {task.priority}
                      </Badge>
                    </div>
                    <p className={cn(
                      "text-sm text-muted-foreground mb-2",
                      isCompleted && "line-through"
                    )}>
                      {task.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      {task.targetEmployee && (
                        <span className="flex items-center gap-1 bg-muted px-2 py-0.5 rounded">
                          <User className="w-3 h-3" />
                          {task.targetEmployee}
                        </span>
                      )}
                      {task.department && (
                        <span className="bg-muted px-2 py-0.5 rounded">
                          {task.department}
                        </span>
                      )}
                      <span className="bg-primary/10 text-primary px-2 py-0.5 rounded">
                        {task.category}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTasks.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {activeTasks.length} aktiv tapşırıq
              </span>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-destructive">
                  <AlertTriangle className="w-3 h-3" />
                  {tasks.filter(t => t.priority === "kritik" && !completedTasks.has(t.id)).length} kritik
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
