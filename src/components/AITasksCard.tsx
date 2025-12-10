import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
  Loader2,
  Save
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export interface AITask {
  id: string;
  title: string;
  description: string;
  priority: "kritik" | "yüksək" | "orta";
  targetEmployee?: string;
  department?: string;
  category: string;
  status?: string;
  branch?: string;
}

interface DBTask {
  id: string;
  title: string;
  description: string;
  priority: string;
  target_employee: string | null;
  department: string | null;
  category: string;
  status: string;
  branch: string;
  created_at: string;
  completed_at: string | null;
}

interface AITasksCardProps {
  newTasks?: AITask[];
  isGenerating: boolean;
  onRefresh: () => void;
  branch?: string | null;
}

export const AITasksCard = ({ newTasks = [], isGenerating, onRefresh, branch }: AITasksCardProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [pendingNewTasks, setPendingNewTasks] = useState<AITask[]>([]);

  // When new tasks come from AI, store them temporarily
  useEffect(() => {
    if (newTasks.length > 0) {
      setPendingNewTasks(newTasks);
    }
  }, [newTasks]);

  // Fetch existing tasks from database
  const { data: dbTasks = [], isLoading: loadingTasks } = useQuery({
    queryKey: ['ai-tasks', branch],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_tasks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as DBTask[];
    },
  });

  // Listen to realtime updates
  useEffect(() => {
    const channel = supabase
      .channel('ai-tasks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ai_tasks'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['ai-tasks'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Save new tasks to database
  const saveMutation = useMutation({
    mutationFn: async (tasks: AITask[]) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("İstifadəçi tapılmadı");

      // Get user's branch
      const { data: branchData } = await supabase
        .from('manager_branches')
        .select('branch')
        .eq('user_id', user.id)
        .maybeSingle();

      const userBranch = branchData?.branch || branch || 'baku';

      const tasksToInsert = tasks.map(task => ({
        title: task.title,
        description: task.description,
        priority: task.priority,
        category: task.category,
        target_employee: task.targetEmployee || null,
        department: task.department || null,
        branch: userBranch,
        status: 'pending',
        created_by: user.id,
      }));

      const { error } = await supabase
        .from('ai_tasks')
        .insert(tasksToInsert);

      if (error) throw error;
    },
    onSuccess: () => {
      setPendingNewTasks([]);
      queryClient.invalidateQueries({ queryKey: ['ai-tasks'] });
      toast({
        title: "Tapşırıqlar saxlanıldı",
        description: "AI tapşırıqlar uğurla database-ə əlavə edildi",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Xəta",
        description: error.message || "Tapşırıqlar saxlanıla bilmədi",
        variant: "destructive",
      });
    },
  });

  // Update task status mutation
  const updateMutation = useMutation({
    mutationFn: async ({ taskId, status }: { taskId: string; status: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const updateData: any = { status };
      if (status === 'completed') {
        updateData.completed_at = new Date().toISOString();
        updateData.completed_by = user?.id;
      } else {
        updateData.completed_at = null;
        updateData.completed_by = null;
      }

      const { error } = await supabase
        .from('ai_tasks')
        .update(updateData)
        .eq('id', taskId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-tasks'] });
    },
    onError: (error: any) => {
      toast({
        title: "Xəta",
        description: error.message || "Status yenilənə bilmədi",
        variant: "destructive",
      });
    },
  });

  const handleTaskToggle = (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    updateMutation.mutate({ taskId, status: newStatus });
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

  const activeTasks = dbTasks.filter(t => t.status !== 'completed');
  const completedCount = dbTasks.filter(t => t.status === 'completed').length;
  const isLoading = loadingTasks || isGenerating;

  // Combine db tasks with pending new tasks for display
  const allTasks = [
    ...dbTasks,
  ];

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
            {pendingNewTasks.length > 0 && (
              <Button
                variant="default"
                size="sm"
                onClick={() => saveMutation.mutate(pendingNewTasks)}
                disabled={saveMutation.isPending}
                className="gap-2"
              >
                {saveMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Saxla ({pendingNewTasks.length})
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="gap-2"
            >
              {isGenerating ? (
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
        {/* Pending new tasks section */}
        {pendingNewTasks.length > 0 && (
          <div className="mb-4 p-3 rounded-lg border-2 border-dashed border-primary/30 bg-primary/5">
            <p className="text-sm font-medium text-primary mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Yeni AI tapşırıqlar ({pendingNewTasks.length})
            </p>
            <div className="space-y-2">
              {pendingNewTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-2 rounded bg-background/50 text-sm"
                >
                  <span>{task.title}</span>
                  <Badge variant="outline" className={cn("text-xs", getPriorityColor(task.priority))}>
                    {task.priority}
                  </Badge>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              "Saxla" düyməsinə basaraq tapşırıqları database-ə əlavə edin
            </p>
          </div>
        )}

        {isLoading && dbTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mb-3" />
            <p>Tapşırıqlar yüklənir...</p>
          </div>
        ) : allTasks.length === 0 && pendingNewTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <CheckCircle2 className="h-12 w-12 mb-3 text-status-good" />
            <p className="font-medium">Tapşırıq yoxdur</p>
            <p className="text-sm">Yeni tapşırıqlar yaratmaq üçün "Yenilə" düyməsinə basın</p>
          </div>
        ) : (
          <div className="space-y-3">
            {allTasks.map((task) => {
              const isCompleted = task.status === 'completed';
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
                    onCheckedChange={() => handleTaskToggle(task.id, task.status)}
                    disabled={updateMutation.isPending}
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
                      {task.target_employee && (
                        <span className="flex items-center gap-1 bg-muted px-2 py-0.5 rounded">
                          <User className="w-3 h-3" />
                          {task.target_employee}
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
                      {isCompleted && task.completed_at && (
                        <span className="text-status-good">
                          ✓ {new Date(task.completed_at).toLocaleDateString('az-Latn')}
                        </span>
                      )}
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
                  {dbTasks.filter(t => t.priority === "kritik" && t.status !== 'completed').length} kritik
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
