import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  LayoutDashboard, FileText, HelpCircle, Handshake,
  Plus, Pencil, Trash2, Save, ArrowLeft, Eye, EyeOff,
  GripVertical, ExternalLink, LogOut,
} from "lucide-react";

/* ═══════════════════════════════════════════════ */
/*  Content Management Tab                         */
/* ═══════════════════════════════════════════════ */
const ContentTab = () => {
  const queryClient = useQueryClient();
  const [editItem, setEditItem] = useState<any>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({ content_key: "", content_value: "", content_type: "text", section: "hero" });

  const { data: contents = [], isLoading } = useQuery({
    queryKey: ["cms_content"],
    queryFn: async () => {
      const { data, error } = await supabase.from("cms_content").select("*").order("section").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const addMutation = useMutation({
    mutationFn: async (item: typeof newItem) => {
      const { error } = await supabase.from("cms_content").insert(item as any);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["cms_content"] }); setShowAdd(false); setNewItem({ content_key: "", content_value: "", content_type: "text", section: "hero" }); toast.success("Məzmun əlavə edildi"); },
    onError: (e: any) => toast.error(e.message),
  });

  const updateMutation = useMutation({
    mutationFn: async (item: any) => {
      const { error } = await supabase.from("cms_content").update({ content_value: item.content_value, content_type: item.content_type, section: item.section, is_active: item.is_active, sort_order: item.sort_order } as any).eq("id", item.id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["cms_content"] }); setEditItem(null); toast.success("Yeniləndi"); },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("cms_content").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["cms_content"] }); toast.success("Silindi"); },
    onError: (e: any) => toast.error(e.message),
  });

  const sections = [...new Set(contents.map((c: any) => c.section))];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Sayt Məzmunu</h3>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1"><Plus className="w-4 h-4" /> Əlavə et</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Yeni məzmun</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Açar (key)</Label><Input value={newItem.content_key} onChange={e => setNewItem({ ...newItem, content_key: e.target.value })} placeholder="hero_title" /></div>
              <div><Label>Dəyər</Label><Textarea value={newItem.content_value} onChange={e => setNewItem({ ...newItem, content_value: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Tip</Label>
                  <Select value={newItem.content_type} onValueChange={v => setNewItem({ ...newItem, content_type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="text">Mətn</SelectItem><SelectItem value="number">Rəqəm</SelectItem><SelectItem value="html">HTML</SelectItem><SelectItem value="url">URL</SelectItem></SelectContent>
                  </Select>
                </div>
                <div><Label>Bölmə</Label>
                  <Select value={newItem.section} onValueChange={v => setNewItem({ ...newItem, section: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="hero">Hero</SelectItem><SelectItem value="features">Xüsusiyyətlər</SelectItem><SelectItem value="stats">Statistika</SelectItem><SelectItem value="pricing">Qiymətlər</SelectItem><SelectItem value="general">Ümumi</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={() => addMutation.mutate(newItem)} disabled={!newItem.content_key || !newItem.content_value} className="w-full">
                <Save className="w-4 h-4 mr-1" /> Saxla
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Yüklənir...</div>
      ) : contents.length === 0 ? (
        <Card><CardContent className="py-8 text-center text-muted-foreground">Hələ heç bir məzmun yoxdur. "Əlavə et" düyməsini basın.</CardContent></Card>
      ) : (
        sections.map(section => (
          <div key={section} className="space-y-2">
            <Badge variant="outline" className="capitalize">{section}</Badge>
            {contents.filter((c: any) => c.section === section).map((item: any) => (
              <Card key={item.id} className="group">
                <CardContent className="py-3 px-4">
                  {editItem?.id === item.id ? (
                    <div className="space-y-2">
                      <Textarea value={editItem.content_value} onChange={e => setEditItem({ ...editItem, content_value: e.target.value })} />
                      <div className="flex items-center gap-2">
                        <Switch checked={editItem.is_active} onCheckedChange={v => setEditItem({ ...editItem, is_active: v })} />
                        <Label className="text-xs">Aktiv</Label>
                        <Input type="number" className="w-20 ml-auto" value={editItem.sort_order} onChange={e => setEditItem({ ...editItem, sort_order: parseInt(e.target.value) || 0 })} />
                        <Button size="sm" onClick={() => updateMutation.mutate(editItem)}><Save className="w-3 h-3" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditItem(null)}>Ləğv</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{item.content_key}</code>
                          {!item.is_active && <Badge variant="secondary" className="text-xs"><EyeOff className="w-3 h-3 mr-1" />Gizli</Badge>}
                        </div>
                        <p className="text-sm mt-1 text-muted-foreground line-clamp-2">{item.content_value}</p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditItem(item)}><Pencil className="w-3 h-3" /></Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => { if (confirm("Silmək istədiyinizdən əminsiniz?")) deleteMutation.mutate(item.id); }}><Trash2 className="w-3 h-3" /></Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════ */
/*  FAQ Management Tab                             */
/* ═══════════════════════════════════════════════ */
const FAQTab = () => {
  const queryClient = useQueryClient();
  const [editItem, setEditItem] = useState<any>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newFaq, setNewFaq] = useState({ question: "", answer: "" });

  const { data: faqs = [], isLoading } = useQuery({
    queryKey: ["cms_faqs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("cms_faqs").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const addMutation = useMutation({
    mutationFn: async (item: typeof newFaq) => {
      const { error } = await supabase.from("cms_faqs").insert(item as any);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["cms_faqs"] }); setShowAdd(false); setNewFaq({ question: "", answer: "" }); toast.success("FAQ əlavə edildi"); },
    onError: (e: any) => toast.error(e.message),
  });

  const updateMutation = useMutation({
    mutationFn: async (item: any) => {
      const { error } = await supabase.from("cms_faqs").update({ question: item.question, answer: item.answer, is_active: item.is_active, sort_order: item.sort_order } as any).eq("id", item.id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["cms_faqs"] }); setEditItem(null); toast.success("Yeniləndi"); },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("cms_faqs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["cms_faqs"] }); toast.success("Silindi"); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Tez-tez Verilən Suallar</h3>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1"><Plus className="w-4 h-4" /> Sual əlavə et</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Yeni FAQ</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Sual</Label><Input value={newFaq.question} onChange={e => setNewFaq({ ...newFaq, question: e.target.value })} /></div>
              <div><Label>Cavab</Label><Textarea value={newFaq.answer} onChange={e => setNewFaq({ ...newFaq, answer: e.target.value })} rows={4} /></div>
              <Button onClick={() => addMutation.mutate(newFaq)} disabled={!newFaq.question || !newFaq.answer} className="w-full">
                <Save className="w-4 h-4 mr-1" /> Saxla
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Yüklənir...</div>
      ) : faqs.length === 0 ? (
        <Card><CardContent className="py-8 text-center text-muted-foreground">Hələ FAQ yoxdur.</CardContent></Card>
      ) : (
        faqs.map((faq: any, i: number) => (
          <Card key={faq.id} className="group">
            <CardContent className="py-3 px-4">
              {editItem?.id === faq.id ? (
                <div className="space-y-2">
                  <Input value={editItem.question} onChange={e => setEditItem({ ...editItem, question: e.target.value })} />
                  <Textarea value={editItem.answer} onChange={e => setEditItem({ ...editItem, answer: e.target.value })} rows={3} />
                  <div className="flex items-center gap-2">
                    <Switch checked={editItem.is_active} onCheckedChange={v => setEditItem({ ...editItem, is_active: v })} />
                    <Label className="text-xs">Aktiv</Label>
                    <Input type="number" className="w-20 ml-auto" value={editItem.sort_order} onChange={e => setEditItem({ ...editItem, sort_order: parseInt(e.target.value) || 0 })} />
                    <Button size="sm" onClick={() => updateMutation.mutate(editItem)}><Save className="w-3 h-3" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditItem(null)}>Ləğv</Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground">#{i + 1}</span>
                      <span className="font-medium text-sm">{faq.question}</span>
                      {!faq.is_active && <Badge variant="secondary" className="text-xs"><EyeOff className="w-3 h-3 mr-1" />Gizli</Badge>}
                    </div>
                    <p className="text-sm mt-1 text-muted-foreground line-clamp-2">{faq.answer}</p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditItem(faq)}><Pencil className="w-3 h-3" /></Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => { if (confirm("Silmək istədiyinizdən əminsiniz?")) deleteMutation.mutate(faq.id); }}><Trash2 className="w-3 h-3" /></Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════ */
/*  Partners Management Tab                        */
/* ═══════════════════════════════════════════════ */
const PartnersTab = () => {
  const queryClient = useQueryClient();
  const [editItem, setEditItem] = useState<any>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newPartner, setNewPartner] = useState({ name: "", logo_url: "", website_url: "" });

  const { data: partners = [], isLoading } = useQuery({
    queryKey: ["cms_partners"],
    queryFn: async () => {
      const { data, error } = await supabase.from("cms_partners").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const addMutation = useMutation({
    mutationFn: async (item: typeof newPartner) => {
      const { error } = await supabase.from("cms_partners").insert(item as any);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["cms_partners"] }); setShowAdd(false); setNewPartner({ name: "", logo_url: "", website_url: "" }); toast.success("Partner əlavə edildi"); },
    onError: (e: any) => toast.error(e.message),
  });

  const updateMutation = useMutation({
    mutationFn: async (item: any) => {
      const { error } = await supabase.from("cms_partners").update({ name: item.name, logo_url: item.logo_url, website_url: item.website_url, is_active: item.is_active, sort_order: item.sort_order } as any).eq("id", item.id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["cms_partners"] }); setEditItem(null); toast.success("Yeniləndi"); },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("cms_partners").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["cms_partners"] }); toast.success("Silindi"); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Tərəfdaşlar</h3>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1"><Plus className="w-4 h-4" /> Partner əlavə et</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Yeni tərəfdaş</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Ad</Label><Input value={newPartner.name} onChange={e => setNewPartner({ ...newPartner, name: e.target.value })} /></div>
              <div><Label>Logo URL</Label><Input value={newPartner.logo_url} onChange={e => setNewPartner({ ...newPartner, logo_url: e.target.value })} placeholder="https://..." /></div>
              <div><Label>Veb-sayt URL</Label><Input value={newPartner.website_url} onChange={e => setNewPartner({ ...newPartner, website_url: e.target.value })} placeholder="https://..." /></div>
              <Button onClick={() => addMutation.mutate(newPartner)} disabled={!newPartner.name} className="w-full">
                <Save className="w-4 h-4 mr-1" /> Saxla
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Yüklənir...</div>
      ) : partners.length === 0 ? (
        <Card><CardContent className="py-8 text-center text-muted-foreground">Hələ partner yoxdur.</CardContent></Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {partners.map((p: any) => (
            <Card key={p.id} className="group">
              <CardContent className="py-3 px-4">
                {editItem?.id === p.id ? (
                  <div className="space-y-2">
                    <Input value={editItem.name} onChange={e => setEditItem({ ...editItem, name: e.target.value })} />
                    <Input value={editItem.logo_url || ""} onChange={e => setEditItem({ ...editItem, logo_url: e.target.value })} placeholder="Logo URL" />
                    <Input value={editItem.website_url || ""} onChange={e => setEditItem({ ...editItem, website_url: e.target.value })} placeholder="Website URL" />
                    <div className="flex items-center gap-2">
                      <Switch checked={editItem.is_active} onCheckedChange={v => setEditItem({ ...editItem, is_active: v })} />
                      <Label className="text-xs">Aktiv</Label>
                      <Button size="sm" className="ml-auto" onClick={() => updateMutation.mutate(editItem)}><Save className="w-3 h-3" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditItem(null)}>Ləğv</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {p.logo_url ? (
                        <img src={p.logo_url} alt={p.name} className="w-10 h-10 object-contain rounded" />
                      ) : (
                        <div className="w-10 h-10 rounded bg-muted flex items-center justify-center text-xs font-bold">{p.name[0]}</div>
                      )}
                      <div>
                        <p className="font-medium text-sm">{p.name}</p>
                        {p.website_url && <a href={p.website_url} target="_blank" rel="noopener" className="text-xs text-muted-foreground hover:underline flex items-center gap-1"><ExternalLink className="w-3 h-3" />Sayt</a>}
                      </div>
                      {!p.is_active && <Badge variant="secondary" className="text-xs"><EyeOff className="w-3 h-3" /></Badge>}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditItem(p)}><Pencil className="w-3 h-3" /></Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => { if (confirm("Silmək?")) deleteMutation.mutate(p.id); }}><Trash2 className="w-3 h-3" /></Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════ */
/*  Main Admin CMS Page                            */
/* ═══════════════════════════════════════════════ */
const AdminCMS = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}><ArrowLeft className="w-5 h-5" /></Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <LayoutDashboard className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-sm font-bold">Admin CMS</h1>
                <p className="text-xs text-muted-foreground">Sayt məzmununu idarə edin</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => window.open("/", "_blank")} className="gap-1 hidden sm:inline-flex">
              <Eye className="w-3.5 h-3.5" /> Sayta bax
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1 text-destructive">
              <LogOut className="w-3.5 h-3.5" /> Çıxış
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content" className="gap-1.5">
              <FileText className="w-4 h-4" /> Məzmun
            </TabsTrigger>
            <TabsTrigger value="faqs" className="gap-1.5">
              <HelpCircle className="w-4 h-4" /> FAQ
            </TabsTrigger>
            <TabsTrigger value="partners" className="gap-1.5">
              <Handshake className="w-4 h-4" /> Tərəfdaşlar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content"><ContentTab /></TabsContent>
          <TabsContent value="faqs"><FAQTab /></TabsContent>
          <TabsContent value="partners"><PartnersTab /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminCMS;
