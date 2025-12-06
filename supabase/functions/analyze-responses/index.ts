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

    const systemPrompt = `Sən HR analitika ekspertisən. Sənə işçilərin əhval sorğularının nəticələri veriləcək. 

Cavabını aşağıdakı JSON formatında ver:
{
  "score": <0-100 arası ümumi qiymət balı>,
  "summary": "<1-2 cümlə qısa xülasə>",
  "observations": ["<müşahidə 1>", "<müşahidə 2>", "<müşahidə 3>"],
  "recommendations": ["<tövsiyyə 1>", "<tövsiyyə 2>", "<tövsiyyə 3>"],
  "riskLevel": "<aşağı|orta|yüksək|kritik>"
}

Score hesablama meyarları:
- Yaxşı əhval % yüksəkdirsə +
- Risk halları azdırsa +
- Cavab dərəcəsi yüksəkdirsə +
- Pis əhval % aşağıdırsa +

Azərbaycan dilində yaz. Qısa və konkret ol.`;

    const userPrompt = `İşçi sorğusu nəticələri:

Ümumi məmnuniyyət indeksi: ${overallIndex}%
Cavab dərəcəsi: ${responseRate}%
Risk halları sayı: ${riskCount}

Əhval bölgüsü:
${moodDistribution.map((m: any) => `- ${m.mood}: ${m.count} nəfər (${m.percentage}%)`).join('\n')}

Əsas şikayət səbəbləri:
${topReasons.map((r: any, i: number) => `${i + 1}. ${r.reason}: ${r.count} şikayət (${r.percentage}%)`).join('\n')}

Bu məlumatlara əsasən JSON formatında analiz ver.`;

    console.log("Calling AI gateway...");
    
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
    const content = data.choices?.[0]?.message?.content || "";
    
    console.log("AI response:", content);
    
    // Parse JSON from response
    let analysis;
    try {
      // Extract JSON from response (handle markdown code blocks)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      // Fallback response
      analysis = {
        score: overallIndex,
        summary: "Analiz aparıldı.",
        observations: ["Məlumatlar analiz edildi."],
        recommendations: ["Daha çox məlumat toplanmalıdır."],
        riskLevel: riskCount > 5 ? "yüksək" : riskCount > 0 ? "orta" : "aşağı"
      };
    }

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
