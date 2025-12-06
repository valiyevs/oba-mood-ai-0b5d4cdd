import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { moodDistribution, topReasons, riskCount, responseRate, overallIndex } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `Sən HR analitika ekspertisən. Sənə işçilərin əhval sorğularının nəticələri veriləcək. Sənin vəzifən bu məlumatları analiz edib:
1. Əsas müşahidələri yazmaq (3-4 cümlə)
2. Problemli sahələri müəyyən etmək
3. Konkret tövsiyyələr vermək (3-5 tövsiyyə)

Cavabını Azərbaycan dilində yaz. Qısa və konkret ol. Emoji istifadə etmə.`;

    const userPrompt = `İşçi sorğusu nəticələri:

Ümumi məmnuniyyət indeksi: ${overallIndex}%
Cavab dərəcəsi: ${responseRate}%
Risk halları sayı: ${riskCount}

Əhval bölgüsü:
${moodDistribution.map((m: any) => `- ${m.mood}: ${m.count} nəfər (${m.percentage}%)`).join('\n')}

Əsas şikayət səbəbləri:
${topReasons.map((r: any, i: number) => `${i + 1}. ${r.reason}: ${r.count} şikayət (${r.percentage}%)`).join('\n')}

Bu məlumatlara əsasən analiz və tövsiyyələrini ver.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit aşıldı, zəhmət olmasa bir az gözləyin." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Kredit tələb olunur, hesabınıza balans əlavə edin." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI xətası baş verdi" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const analysis = data.choices?.[0]?.message?.content || "Analiz aparıla bilmədi.";

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-responses error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Naməlum xəta" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
