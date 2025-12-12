import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, AlertTriangle, CheckCircle, Clock, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { az } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  manager_user_id: string;
  branch: string;
  notification_type: string;
  title: string;
  message: string;
  related_alert_id: string | null;
  is_read: boolean;
  created_at: string;
}

interface ManagerNotificationsPanelProps {
  branch?: string | null;
}

export const ManagerNotificationsPanel = ({ branch }: ManagerNotificationsPanelProps) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  // Fetch notifications
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['manager-notifications', branch],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('manager_notifications')
        .select('*')
        .eq('manager_user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return (data || []) as Notification[];
    },
  });

  // Subscribe to real-time updates
  useEffect(() => {
    const setupRealtimeSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const channel = supabase
        .channel('manager-notifications-realtime')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'manager_notifications',
            filter: `manager_user_id=eq.${user.id}`,
          },
          (payload) => {
            console.log('New notification received:', payload);
            // Invalidate query to refresh notifications list
            queryClient.invalidateQueries({ queryKey: ['manager-notifications'] });
            
            // Show toast for new notification
            const newNotification = payload.new as Notification;
            toast({
              title: "🔔 Yeni Bildiriş",
              description: newNotification.title,
              variant: "destructive",
            });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    const cleanup = setupRealtimeSubscription();
    return () => {
      cleanup.then((unsubscribe) => unsubscribe?.());
    };
  }, [queryClient, toast]);

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('manager_notifications')
        .update({ is_read: true })
        .eq('id', notificationId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manager-notifications'] });
    },
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('manager_notifications')
        .update({ is_read: true })
        .eq('manager_user_id', user.id)
        .eq('is_read', false);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manager-notifications'] });
    },
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification);
    if (!notification.is_read) {
      markAsReadMutation.mutate(notification.id);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'critical_complaint':
        return <AlertTriangle className="w-5 h-5 text-rose-500" />;
      default:
        return <Bell className="w-5 h-5 text-amber-500" />;
    }
  };

  const getNotificationBadge = (type: string) => {
    switch (type) {
      case 'critical_complaint':
        return <Badge variant="destructive" className="text-xs">Kritik</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">Bildiriş</Badge>;
    }
  };

  return (
    <Card className="relative overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-rose-500/5 opacity-50" />
      
      <CardHeader className="relative pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-rose-500 shadow-lg">
                <Bell className="h-5 w-5 text-white" />
              </div>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-foreground">
                Kritik Bildirişlər
              </CardTitle>
              <CardDescription className="text-sm">
                Təcili diqqət tələb edən hallar
              </CardDescription>
            </div>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markAllAsReadMutation.mutate()}
              disabled={markAllAsReadMutation.isPending}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Hamısını oxunmuş et
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="relative">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>Hazırda bildiriş yoxdur</p>
            <p className="text-sm mt-1">Kritik hallar aşkarlandıqda burada görünəcək</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-3">
              <AnimatePresence>
                {notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleNotificationClick(notification)}
                    className={cn(
                      "p-4 rounded-xl border cursor-pointer transition-all duration-200",
                      notification.is_read
                        ? "bg-muted/30 border-border/30 hover:bg-muted/50"
                        : "bg-gradient-to-r from-rose-500/10 to-amber-500/10 border-rose-500/30 hover:border-rose-500/50 shadow-sm"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {getNotificationIcon(notification.notification_type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {getNotificationBadge(notification.notification_type)}
                          {!notification.is_read && (
                            <span className="w-2 h-2 bg-rose-500 rounded-full" />
                          )}
                        </div>
                        <h4 className={cn(
                          "font-medium text-sm truncate",
                          notification.is_read ? "text-muted-foreground" : "text-foreground"
                        )}>
                          {notification.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {format(new Date(notification.created_at), "dd MMM, HH:mm", { locale: az })}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
        )}

        {/* Notification Detail Modal */}
        <AnimatePresence>
          {selectedNotification && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setSelectedNotification(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-card border border-border/50 rounded-2xl shadow-2xl max-w-lg w-full p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getNotificationIcon(selectedNotification.notification_type)}
                    {getNotificationBadge(selectedNotification.notification_type)}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedNotification(null)}
                    className="rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {selectedNotification.title}
                </h3>
                
                <p className="text-muted-foreground mb-4">
                  {selectedNotification.message}
                </p>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground border-t border-border/50 pt-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {format(new Date(selectedNotification.created_at), "dd MMMM yyyy, HH:mm", { locale: az })}
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedNotification(null)}
                    className="rounded-xl"
                  >
                    Bağla
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};
