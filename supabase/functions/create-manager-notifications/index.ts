import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { criticalAlerts, branch, analysisDate } = await req.json();
    
    if (!criticalAlerts || criticalAlerts.length === 0) {
      console.log("No critical alerts to process");
      return new Response(JSON.stringify({ success: true, count: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all managers assigned to the branch
    const { data: managers, error: managersError } = await supabase
      .from('manager_branches')
      .select('user_id')
      .eq('branch', branch);

    if (managersError) {
      console.error("Error fetching managers:", managersError);
      throw managersError;
    }

    if (!managers || managers.length === 0) {
      console.log(`No managers found for branch: ${branch}`);
      return new Response(JSON.stringify({ success: true, count: 0, message: "No managers for this branch" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Found ${managers.length} managers for branch ${branch}`);

    // Create notifications for each manager
    const notifications = [];
    
    for (const manager of managers) {
      for (const alert of criticalAlerts) {
        notifications.push({
          manager_user_id: manager.user_id,
          branch: branch,
          notification_type: 'critical_complaint',
          title: 'Kritik Şikayət Aşkarlandı',
          message: alert,
        });
      }
    }

    if (notifications.length > 0) {
      const { error: insertError } = await supabase
        .from('manager_notifications')
        .insert(notifications);

      if (insertError) {
        console.error("Error inserting notifications:", insertError);
        throw insertError;
      }

      console.log(`Created ${notifications.length} notifications`);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      count: notifications.length,
      managersNotified: managers.length 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("create-manager-notifications error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
