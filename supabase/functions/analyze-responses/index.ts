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
    const { moodDistribution, topReasons, riskCount, responseRate, overallIndex, criticalComplaints } = await req.json();
    
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const systemPrompt = `Sən HR analitika ekspertisən. Sənə işçilərin əhval sorğularının nəticələri veriləcək. 

XÜSUSI DİQQƏT: Kritik şikayətlər bölməsinə xüsusi diqqət yetir! Bu bölmədə işçilərin sərbəst mətn şikayətləri var. Əgər orada zorakılıq, təhqir, döyülmə, söyülmə, mobbing və ya digər ciddi problemlər haqqında şikayət varsa, bunu MÜTLƏƏQİ qeyd et və risk səviyyəsini "kritik" olaraq təyin et!

Cavabını aşağıdakı JSON formatında ver:
{
  "score": <0-100 arası ümumi qiymət balı>,
  "summary": "<1-2 cümlə qısa xülasə>",
  "observations": ["<müşahidə 1>", "<müşahidə 2>", "<müşahidə 3>"],
  "recommendations": ["<tövsiyyə 1>", "<tövsiyyə 2>", "<tövsiyyə 3>"],
  "riskLevel": "<aşağı|orta|yüksək|kritik>",
  "criticalAlerts": ["<kritik xəbərdarlıq 1>", "<kritik xəbərdarlıq 2>"],
  "tasks": [
    {
      "id": "<unikal_id>",
      "title": "<tapşırıq başlığı>",
      "description": "<ətraflı təsvir>",
      "priority": "<kritik|yüksək|orta>",
      "targetEmployee": "<işçi kodu əgər varsa>",
      "department": "<şöbə adı>",
      "category": "<kateqoriya: Görüş|Müdaxilə|Araşdırma|Dəyişiklik>"
    }
  ]
}

Tapşırıqlar yaratma qaydaları:
- Hər kritik hal üçün konkret tapşırıq yarat
- Prioritet: kritik (dərhal müdaxilə), yüksək (bu həftə), orta (planlaşdırılmış)
- Kateqoriyalar: "Görüş" (1-1 söhbət), "Müdaxilə" (dərhal tədbir), "Araşdırma" (problem analizi), "Dəyişiklik" (proses dəyişikliyi)
- Ən az 3, ən çox 7 tapşırıq yarat
- Zorakılıq/mobbing halları varsa "kritik" prioritetli tapşırıq MÜTLƏQ olmalıdır!

Score hesablama meyarları:
- Yaxşı əhval % yüksəkdirsə +
- Risk halları azdırsa +
- Cavab dərəcəsi yüksəkdirsə +
- Pis əhval % aşağıdırsa +
- KRİTİK: Zorakılıq, söyülmə, döyülmə şikayətləri varsa score çox aşağı olmalı və riskLevel "kritik" olmalıdır!

Azərbaycan dilində yaz. Qısa və konkret ol.`;

    // Handle both array and object formats for moodDistribution
    let moodDistributionText = "";
    if (Array.isArray(moodDistribution)) {
      moodDistributionText = moodDistribution.map((m: any) => `- ${m.mood}: ${m.count} nəfər (${m.percentage}%)`).join('\n');
    } else if (typeof moodDistribution === 'object' && moodDistribution !== null) {
      moodDistributionText = Object.entries(moodDistribution).map(([mood, percentage]) => `- ${mood}: ${percentage}%`).join('\n');
    }

    // Handle both array formats for topReasons
    let topReasonsText = "";
    if (Array.isArray(topReasons)) {
      topReasonsText = topReasons.map((r: any, i: number) => `${i + 1}. ${r.reason}: ${r.count || ''} (${r.percentage}%)`).join('\n');
    }

    // Handle critical complaints (free text from employees)
    let criticalComplaintsText = "";
    if (Array.isArray(criticalComplaints) && criticalComplaints.length > 0) {
      criticalComplaintsText = criticalComplaints.map((c: any, i: number) => 
        `${i + 1}. "${c.reason}" (Kateqoriya: ${c.category || "Qeyd olunmayıb"}, Filial: ${c.branch}, Şöbə: ${c.department})`
      ).join('\n');
    }

    const userPrompt = `İşçi sorğusu nəticələri:

Ümumi məmnuniyyət indeksi: ${overallIndex}%
Cavab dərəcəsi: ${responseRate}%
Risk halları sayı: ${riskCount}

Əhval bölgüsü:
${moodDistributionText}

Əsas şikayət səbəbləri:
${topReasonsText || "Qeyd olunmayıb"}

⚠️ KRİTİK ŞİKAYƏTLƏR (işçilərin sərbəst mətn cavabları):
${criticalComplaintsText || "Kritik şikayət yoxdur"}

Bu məlumatlara əsasən JSON formatında analiz ver. Kritik şikayətlərə xüsusi diqqət yetir!`;

    console.log("Calling Gemini API...");
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: systemPrompt + "\n\n" + userPrompt }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048
        }
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
        // No credits: return a safe fallback analysis (so the UI doesn't break)
        const keywordList = [
          "zorakılıq",
          "döy",
          "doy",
          "döyül",
          "söy",
          "söyüş",
          "təhqir",
          "mobbing",
          "təzyiq",
          "hədə",
          "hədəl",
          "qorxu",
          "vur",
          "şiddət",
          "şikayət"
        ];

        const complaintReasons = Array.isArray(criticalComplaints)
          ? criticalComplaints
              .map((c: any) => String(c?.reason ?? "").trim())
              .filter(Boolean)
          : [];

        const flaggedComplaints = complaintReasons.filter((txt) => {
          const lower = txt.toLowerCase();
          return keywordList.some((k) => lower.includes(k));
        });

        const hasCritical = flaggedComplaints.length > 0;

        const riskLevel = hasCritical
          ? "kritik"
          : riskCount > 5
            ? "yüksək"
            : riskCount > 0
              ? "orta"
              : "aşağı";

        const scoreBase = typeof overallIndex === "number" ? overallIndex : 0;
        const score = hasCritical ? Math.min(scoreBase, 20) : scoreBase;

        const topReasonLine = Array.isArray(topReasons) && topReasons.length > 0
          ? `Əsas səbəb: ${topReasons[0]?.reason ?? ""} (${topReasons[0]?.percentage ?? 0}%)`
          : "Əsas səbəb: Qeyd olunmayıb";

        const analysis = {
          score,
          summary: "AI krediti tələb olunduğu üçün əsas göstəricilər əsasında analiz göstərilir.",
          observations: [
            `Ümumi indeks: ${scoreBase}%`,
            `Risk halları: ${riskCount}`,
            topReasonLine,
          ],
          recommendations: hasCritical
            ? [
                "Kritik şikayətləri dərhal araşdırın və müdaxilə edin.",
                "Şikayət edən işçi(lər) üçün 1-1 görüş planlayın.",
                "Filial rəhbərliyi ilə təcili tədbir planı hazırlayın.",
              ]
            : [
                "Əsas şikayət səbəbləri üzrə qısa fəaliyyət planı hazırlayın.",
                "Komanda yüklənməsini və qrafiki yenidən qiymətləndirin.",
                "Növbəti həftə üçün izləmə indikatorları təyin edin.",
              ],
          riskLevel,
          criticalAlerts: hasCritical
            ? flaggedComplaints.slice(0, 3).map((t) => `Kritik şikayət: "${t.slice(0, 140)}"`)
            : [],
          tasks: [],
        };

        return new Response(JSON.stringify({ analysis }), {
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
    // Gemini API response format: data.candidates[0].content.parts[0].text
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    console.log("Gemini API response:", content);
    
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
