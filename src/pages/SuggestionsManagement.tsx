import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, ArrowLeft, CheckCircle2, Clock, Eye, MoreVertical } from "lucide-react";
import { format } from "date-fns";
import { az } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import obaLogo from "@/assets/oba-logo.jpg";
import { useLanguage } from "@/hooks/useLanguage";
import { Lightbulb, AlertCircle, Star } from "lucide-react";

interface Suggestion {
  id: string;
  branch: string;
  department: string;
  category: string;
  suggestion_text: string;
  status: string;
  priority: string;
  admin_notes: string | null;
  created_at: string;
}

const SuggestionsManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [filter, setFilter] = useState("all");
  const { t } = useLanguage();

  const categoryConfig: Record<string, { label: string; icon: any; color: string }> = {
    suggestion: { label: t("suggestionBox.suggestion"), icon: Lightbulb, color: "bg-amber-500" },
    complaint: { label: t("suggestionBox.complaint"), icon: AlertCircle, color: "bg-rose-500" },
    improvement: { label: t("suggestionBox.improvement"), icon: Star, color: "bg-emerald-500" },
    other: { label: t("suggestionBox.other"), icon: MessageSquare, color: "bg-violet-500" },
  };

  const statusConfig: Record<string, { label: string; color: string }> = {
    new: { label: t("suggestionsManagement.new"), color: "bg-blue-500" },
    reviewing: { label: t("suggestionsManagement.reviewing"), color: "bg-amber-500" },
    resolved: { label: t("suggestionsManagement.resolved"), color: "bg-emerald-500" },
    rejected: { label: t("suggestionsManagement.rejected"), color: "bg-rose-500" },
  };

  const { data: suggestions = [], isLoading } = useQuery<Suggestion[]>({
    queryKey: ["suggestions"],
    queryFn: async () => {
      const { data, error } = await supabase.from("anonymous_suggestions").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: string; notes?: string }) => {
      const { error } = await supabase.from("anonymous_suggestions").update({ status, admin_notes: notes, reviewed_at: new Date().toISOString() }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suggestions"] });
      toast({ title: t("suggestionsManagement.statusUpdated") });
      setSelectedSuggestion(null);
    },
  });

  const filteredSuggestions = filter === "all" ? suggestions : suggestions.filter(s => s.status === filter);

  const stats = {
    total: suggestions.length,
    new: suggestions.filter(s => s.status === "new").length,
    reviewing: suggestions.filter(s => s.status === "reviewing").length,
    resolved: suggestions.filter(s => s.status === "resolved").length,
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
      </div>

      <header className="sticky top-0 z-50 bg-card/70 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/hr-panel")} className="rounded-xl">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <img src={obaLogo} alt="OBA" className="w-12 h-12 rounded-xl object-cover" />
              <div>
                <h1 className="text-xl font-bold flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-violet-500" />
                  {t("suggestionsManagement.title")}
                </h1>
                <p className="text-sm text-muted-foreground">{t("suggestionsManagement.subtitle")}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: t("suggestionsManagement.total"), value: stats.total, color: "from-violet-500 to-purple-500", icon: MessageSquare },
            { label: t("suggestionsManagement.new"), value: stats.new, color: "from-blue-500 to-cyan-500", icon: Clock },
            { label: t("suggestionsManagement.reviewing"), value: stats.reviewing, color: "from-amber-500 to-yellow-500", icon: Eye },
            { label: t("suggestionsManagement.resolved"), value: stats.resolved, color: "from-emerald-500 to-green-500", icon: CheckCircle2 },
          ].map((stat) => (
            <motion.div key={stat.label} variants={itemVariants}>
              <Card className="border-border/50 hover:shadow-lg transition-shadow">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <Tabs value={filter} onValueChange={setFilter} className="space-y-6">
          <TabsList className="bg-card/50 border border-border/50">
            <TabsTrigger value="all">{t("suggestionsManagement.allTab")}</TabsTrigger>
            <TabsTrigger value="new">{t("suggestionsManagement.newTab")}</TabsTrigger>
            <TabsTrigger value="reviewing">{t("suggestionsManagement.reviewingTab")}</TabsTrigger>
            <TabsTrigger value="resolved">{t("suggestionsManagement.resolvedTab")}</TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="space-y-4">
            {isLoading ? (
              <div className="text-center py-12"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>
            ) : filteredSuggestions.length === 0 ? (
              <Card className="border-border/50"><CardContent className="p-12 text-center"><MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" /><p className="text-muted-foreground">{t("suggestionsManagement.noSuggestions")}</p></CardContent></Card>
            ) : (
              <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
                {filteredSuggestions.map((suggestion) => {
                  const cat = categoryConfig[suggestion.category] || categoryConfig.other;
                  const status = statusConfig[suggestion.status] || statusConfig.new;
                  const CatIcon = cat.icon;
                  return (
                    <motion.div key={suggestion.id} variants={itemVariants}>
                      <Card className="border-border/50 hover:shadow-lg transition-all">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4 flex-1">
                              <div className={`p-2.5 rounded-xl ${cat.color}`}><CatIcon className="w-5 h-5 text-white" /></div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline" className="text-xs">{suggestion.department}</Badge>
                                  <Badge className={`${status.color} text-white text-xs`}>{status.label}</Badge>
                                  <span className="text-xs text-muted-foreground">{format(new Date(suggestion.created_at), "dd MMM yyyy, HH:mm", { locale: az })}</span>
                                </div>
                                <p className="text-sm line-clamp-2">{suggestion.suggestion_text}</p>
                                {suggestion.admin_notes && <p className="text-xs text-muted-foreground mt-2 italic">{t("suggestionsManagement.note")}: {suggestion.admin_notes}</p>}
                              </div>
                            </div>
                            <Dialog>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="rounded-lg"><MoreVertical className="w-4 h-4" /></Button></DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DialogTrigger asChild>
                                    <DropdownMenuItem onClick={() => { setSelectedSuggestion(suggestion); setAdminNotes(suggestion.admin_notes || ""); }}>
                                      <Eye className="w-4 h-4 mr-2" />{t("common.view")}
                                    </DropdownMenuItem>
                                  </DialogTrigger>
                                  <DropdownMenuItem onClick={() => updateMutation.mutate({ id: suggestion.id, status: "reviewing" })}>
                                    <Clock className="w-4 h-4 mr-2" />{t("suggestionsManagement.reviewing")}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => updateMutation.mutate({ id: suggestion.id, status: "resolved" })}>
                                    <CheckCircle2 className="w-4 h-4 mr-2" />{t("suggestionsManagement.resolved")}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                              <DialogContent className="max-w-lg">
                                <DialogHeader><DialogTitle className="flex items-center gap-2"><CatIcon className="w-5 h-5" />{cat.label}</DialogTitle></DialogHeader>
                                <div className="space-y-4">
                                  <div><p className="text-sm text-muted-foreground mb-1">{t("suggestionsManagement.branch")}</p><p className="font-medium">{suggestion.department}</p></div>
                                  <div><p className="text-sm text-muted-foreground mb-1">{t("suggestionsManagement.text")}</p><p className="bg-muted/50 p-3 rounded-lg">{suggestion.suggestion_text}</p></div>
                                  <div><p className="text-sm text-muted-foreground mb-1">{t("suggestionsManagement.adminNote")}</p><Textarea value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} placeholder={t("suggestionsManagement.notePlaceholder")} className="min-h-[100px]" /></div>
                                  <div className="flex gap-2">
                                    <Button variant="outline" onClick={() => updateMutation.mutate({ id: suggestion.id, status: "reviewing", notes: adminNotes })} className="flex-1">{t("suggestionsManagement.reviewing")}</Button>
                                    <Button onClick={() => updateMutation.mutate({ id: suggestion.id, status: "resolved", notes: adminNotes })} className="flex-1 bg-emerald-600 hover:bg-emerald-700">{t("suggestionsManagement.resolved")}</Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default SuggestionsManagement;
