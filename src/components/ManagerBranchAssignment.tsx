import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { UserCog, MapPin, Plus, Trash2, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const branches = [
  { id: "baku", name: "Bakı", icon: "🏙️" },
  { id: "ganja", name: "Gəncə", icon: "🌆" },
  { id: "sumgait", name: "Sumqayıt", icon: "🏭" },
  { id: "mingachevir", name: "Mingəçevir", icon: "⚡" },
  { id: "shirvan", name: "Şirvan", icon: "🌾" },
  { id: "lankaran", name: "Lənkəran", icon: "🌊" },
  { id: "shaki", name: "Şəki", icon: "🏔️" },
  { id: "quba", name: "Quba", icon: "🍎" },
];

interface ManagerWithBranch {
  id: string;
  user_id: string;
  branch: string;
  assigned_at: string;
  user_email?: string;
}

interface ManagerRole {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
}

export const ManagerBranchAssignment = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedManager, setSelectedManager] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<string>("");

  // Fetch managers with their branch assignments
  const { data: managerBranches = [], isLoading: loadingAssignments } = useQuery({
    queryKey: ['manager-branch-assignments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('manager_branches')
        .select('*')
        .order('assigned_at', { ascending: false });
      
      if (error) throw error;
      return data as ManagerWithBranch[];
    },
  });

  // Fetch all managers from user_roles
  const { data: managers = [], isLoading: loadingManagers } = useQuery({
    queryKey: ['all-managers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('role', 'manager');
      
      if (error) throw error;
      return data as ManagerRole[];
    },
  });

  // Get managers without branch assignment
  const unassignedManagers = managers.filter(
    m => !managerBranches.some(mb => mb.user_id === m.user_id)
  );

  // Get branches that are already assigned
  const assignedBranchIds = managerBranches.map(mb => mb.branch);

  // Assign manager to branch mutation
  const assignMutation = useMutation({
    mutationFn: async ({ userId, branch }: { userId: string; branch: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('manager_branches')
        .insert({
          user_id: userId,
          branch: branch,
          assigned_by: user?.id,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manager-branch-assignments'] });
      setSelectedManager("");
      setSelectedBranch("");
      toast({
        title: "Təyinat uğurlu",
        description: "Menecer bölgəyə təyin edildi",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Xəta",
        description: error.message || "Təyinat zamanı xəta baş verdi",
        variant: "destructive",
      });
    },
  });

  // Remove assignment mutation
  const removeMutation = useMutation({
    mutationFn: async (assignmentId: string) => {
      const { error } = await supabase
        .from('manager_branches')
        .delete()
        .eq('id', assignmentId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manager-branch-assignments'] });
      toast({
        title: "Təyinat silindi",
        description: "Menecer bölgədən çıxarıldı",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Xəta",
        description: error.message || "Silmə zamanı xəta baş verdi",
        variant: "destructive",
      });
    },
  });

  const handleAssign = () => {
    if (!selectedManager || !selectedBranch) {
      toast({
        title: "Xəta",
        description: "Menecer və bölgə seçin",
        variant: "destructive",
      });
      return;
    }
    assignMutation.mutate({ userId: selectedManager, branch: selectedBranch });
  };

  const getBranchName = (branchId: string) => {
    return branches.find(b => b.id === branchId)?.name || branchId;
  };

  const getBranchIcon = (branchId: string) => {
    return branches.find(b => b.id === branchId)?.icon || "📍";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCog className="w-5 h-5 text-primary" />
          Menecer-Bölgə Təyinatları
        </CardTitle>
        <CardDescription>
          Hər bölgə üçün cavabdeh meneceri təyin edin
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Assignment Form */}
        <div className="p-4 rounded-lg border border-border bg-muted/30">
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Yeni Təyinat
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Select value={selectedManager} onValueChange={setSelectedManager}>
              <SelectTrigger>
                <SelectValue placeholder="Menecer seçin" />
              </SelectTrigger>
              <SelectContent>
                {unassignedManagers.length === 0 ? (
                  <SelectItem value="none" disabled>Təyin olunmamış menecer yoxdur</SelectItem>
                ) : (
                  unassignedManagers.map(manager => (
                    <SelectItem key={manager.user_id} value={manager.user_id}>
                      {manager.user_id.slice(0, 8)}...
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger>
                <SelectValue placeholder="Bölgə seçin" />
              </SelectTrigger>
              <SelectContent>
                {branches.map(branch => (
                  <SelectItem 
                    key={branch.id} 
                    value={branch.id}
                    disabled={assignedBranchIds.includes(branch.id)}
                  >
                    {branch.icon} {branch.name}
                    {assignedBranchIds.includes(branch.id) && " (təyin olunub)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              onClick={handleAssign} 
              disabled={!selectedManager || !selectedBranch || assignMutation.isPending}
              className="gap-2"
            >
              <Check className="w-4 h-4" />
              Təyin Et
            </Button>
          </div>
        </div>

        {/* Current Assignments */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Mövcud Təyinatlar ({managerBranches.length})
          </h4>
          
          {loadingAssignments || loadingManagers ? (
            <div className="text-center py-4 text-muted-foreground">Yüklənir...</div>
          ) : managerBranches.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground border border-dashed border-border rounded-lg">
              <UserCog className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Heç bir menecer-bölgə təyinatı yoxdur</p>
              <p className="text-sm">Yuxarıdakı formdan təyinat əlavə edin</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {managerBranches.map(assignment => (
                <div 
                  key={assignment.id}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-lg border border-border",
                    "bg-card hover:bg-accent/30 transition-colors"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{getBranchIcon(assignment.branch)}</div>
                    <div>
                      <div className="font-medium">{getBranchName(assignment.branch)}</div>
                      <div className="text-xs text-muted-foreground">
                        Menecer: {assignment.user_id.slice(0, 8)}...
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Təyin: {new Date(assignment.assigned_at).toLocaleDateString('az-Latn')}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMutation.mutate(assignment.id)}
                    disabled={removeMutation.isPending}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Branch Coverage Summary */}
        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-medium mb-3">Bölgə Əhatəsi</h4>
          <div className="flex flex-wrap gap-2">
            {branches.map(branch => {
              const isAssigned = assignedBranchIds.includes(branch.id);
              return (
                <Badge 
                  key={branch.id}
                  variant={isAssigned ? "default" : "outline"}
                  className={cn(
                    "gap-1",
                    !isAssigned && "text-muted-foreground border-dashed"
                  )}
                >
                  {branch.icon} {branch.name}
                  {isAssigned && <Check className="w-3 h-3 ml-1" />}
                </Badge>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {assignedBranchIds.length}/{branches.length} bölgə menecerlə təmin edilib
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
