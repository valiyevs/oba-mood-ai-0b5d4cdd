-- Create manager notifications table
CREATE TABLE public.manager_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  manager_user_id uuid NOT NULL,
  branch text NOT NULL,
  notification_type text NOT NULL DEFAULT 'critical_complaint',
  title text NOT NULL,
  message text NOT NULL,
  related_alert_id uuid REFERENCES public.burnout_alerts(id) ON DELETE SET NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.manager_notifications ENABLE ROW LEVEL SECURITY;

-- Managers can view their own notifications
CREATE POLICY "Managers can view own notifications"
ON public.manager_notifications
FOR SELECT
USING (manager_user_id = auth.uid());

-- Managers can update their own notifications (mark as read)
CREATE POLICY "Managers can update own notifications"
ON public.manager_notifications
FOR UPDATE
USING (manager_user_id = auth.uid());

-- HR can view all notifications
CREATE POLICY "HR can view all notifications"
ON public.manager_notifications
FOR SELECT
USING (has_role(auth.uid(), 'hr'::app_role));

-- System can create notifications (via service role)
CREATE POLICY "System can create notifications"
ON public.manager_notifications
FOR INSERT
WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_manager_notifications_user ON public.manager_notifications(manager_user_id);
CREATE INDEX idx_manager_notifications_unread ON public.manager_notifications(manager_user_id, is_read) WHERE is_read = false;