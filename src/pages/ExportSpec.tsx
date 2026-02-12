import { useEffect } from "react";

const ExportSpec = () => {
  useEffect(() => {
    const html = `<!DOCTYPE html>
<html lang="az">
<head>
  <meta charset="UTF-8">
  <title>OBA — Developer Guide</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', sans-serif; color: #1a1a2e; padding: 48px 56px; max-width: 900px; margin: 0 auto; line-height: 1.7; }
    
    .cover { text-align: center; padding: 80px 0 60px; border-bottom: 4px solid #0891b2; margin-bottom: 40px; }
    .cover h1 { font-size: 32px; font-weight: 800; color: #0891b2; margin-bottom: 8px; }
    .cover h2 { font-size: 20px; font-weight: 600; color: #334155; margin-bottom: 4px; }
    .cover p { color: #64748b; font-size: 14px; margin-top: 12px; }
    
    h2 { font-size: 22px; font-weight: 700; color: #0891b2; margin: 36px 0 16px; padding-bottom: 8px; border-bottom: 2px solid #e2e8f0; }
    h3 { font-size: 17px; font-weight: 600; color: #1e293b; margin: 24px 0 10px; }
    h4 { font-size: 15px; font-weight: 600; color: #334155; margin: 18px 0 8px; }
    
    p, li { font-size: 13.5px; color: #334155; }
    ul, ol { margin-left: 20px; margin-bottom: 12px; }
    li { margin-bottom: 4px; }
    
    table { width: 100%; border-collapse: collapse; margin: 12px 0 20px; font-size: 12.5px; }
    th { background: #f1f5f9; font-weight: 600; text-transform: uppercase; font-size: 11px; color: #64748b; letter-spacing: 0.5px; }
    th, td { padding: 8px 12px; text-align: left; border: 1px solid #e2e8f0; }
    tr:nth-child(even) { background: #f8fafc; }
    
    code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 12px; font-family: 'SF Mono', 'Fira Code', monospace; }
    .arch-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 12px 0; font-family: 'SF Mono', 'Fira Code', monospace; font-size: 11.5px; white-space: pre; overflow-x: auto; line-height: 1.5; }
    
    .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; }
    .badge-green { background: #dcfce7; color: #166534; }
    .badge-red { background: #fee2e2; color: #991b1b; }
    .badge-yellow { background: #fef9c3; color: #854d0e; }
    .badge-blue { background: #dbeafe; color: #1e40af; }
    
    .warn { background: #fffbeb; border-left: 4px solid #f59e0b; padding: 10px 14px; margin: 12px 0; border-radius: 0 6px 6px 0; font-size: 13px; }
    
    .section { page-break-inside: avoid; }
    .footer { margin-top: 60px; padding-top: 20px; border-top: 2px solid #e2e8f0; text-align: center; font-size: 12px; color: #94a3b8; }
    
    @media print {
      body { padding: 20px 30px; }
      .cover { padding: 40px 0 30px; }
      .section { page-break-inside: avoid; }
    }
  </style>
</head>
<body>

<div class="cover">
  <h1>DEVELOPER GUIDE</h1>
  <h2>OBA Personal Məmnuniyyət İdarəetmə Sistemi</h2>
  <p>Versiya: 2.0 | Fevral 2026</p>
  <p>Canlı URL: https://oba-mood-ai.lovable.app</p>
</div>

<div class="section">
<h2>1. LAYİHƏ HAQQINDA</h2>
<p><strong>OBA Əhval Sistemi</strong> — İşçilərin gündəlik əhval-ruhiyyəsini real vaxtda izləyən, AI ilə analiz edən, burnout risklərini əvvəlcədən müəyyən edən və rəhbərliyə tövsiyələr təqdim edən web tətbiq.</p>

<h3>İstifadəçi Rolları</h3>
<table>
  <tr><th>Rol</th><th>Giriş</th><th>İmkanlar</th></tr>
  <tr><td><strong>İşçi</strong></td><td>Anonim (auth yoxdur)</td><td>Sorğu doldurma, anonim təklif göndərmə</td></tr>
  <tr><td><strong>Menecer</strong></td><td>Email/şifrə</td><td>Öz filialının dashboardu, AI analiz, tapşırıqlar</td></tr>
  <tr><td><strong>HR</strong></td><td>Email/şifrə</td><td>Bütün filiallar, hesabatlar, menecer təyinatları, hədəflər</td></tr>
</table>
</div>

<div class="section">
<h2>2. TEXNOLOGİYA STEKİ</h2>

<h3>Frontend</h3>
<table>
  <tr><th>Texnologiya</th><th>Versiya</th><th>Təyinat</th></tr>
  <tr><td>React</td><td>18.3</td><td>UI framework</td></tr>
  <tr><td>TypeScript</td><td>5.x</td><td>Tip təhlükəsizliyi</td></tr>
  <tr><td>Vite</td><td>5.x</td><td>Build tool, dev server</td></tr>
  <tr><td>Tailwind CSS</td><td>3.x</td><td>Utility-first styling</td></tr>
  <tr><td>Shadcn/UI</td><td>Latest</td><td>UI komponent kitabxanası</td></tr>
  <tr><td>Framer Motion</td><td>12.x</td><td>Animasiyalar</td></tr>
  <tr><td>React Router</td><td>6.30</td><td>Client-side routing</td></tr>
  <tr><td>TanStack React Query</td><td>5.83</td><td>Server state management</td></tr>
  <tr><td>Recharts</td><td>2.15</td><td>Qrafiklər və diaqramlar</td></tr>
  <tr><td>Zod</td><td>3.25</td><td>Form validasiyası</td></tr>
</table>

<h3>Backend</h3>
<table>
  <tr><th>Xidmət</th><th>Təyinat</th></tr>
  <tr><td>PostgreSQL</td><td>Əsas verilənlər bazası</td></tr>
  <tr><td>Row Level Security (RLS)</td><td>Rol əsaslı data təhlükəsizliyi</td></tr>
  <tr><td>Edge Functions (Deno)</td><td>Serverless API endpointləri</td></tr>
  <tr><td>Realtime Subscriptions</td><td>Real vaxt bildirişlər</td></tr>
  <tr><td>Auth (Email/Password)</td><td>İstifadəçi autentifikasiyası</td></tr>
</table>

<h3>AI</h3>
<p><strong>Google Gemini 2.5 Flash</strong> — Lovable AI Gateway vasitəsilə. API key lazım deyil.</p>
</div>

<div class="section">
<h2>3. FOLDER STRUKTURU</h2>
<div class="arch-box">src/
├── assets/                # Şəkillər (logo)
├── components/
│   ├── ui/                # Shadcn/UI bazis komponentlər
│   ├── charts/            # Recharts qrafik komponentləri
│   │   ├── MoodPieChart.tsx
│   │   ├── ReasonsBarChart.tsx
│   │   ├── TrendLineChart.tsx
│   │   └── BranchComparisonChart.tsx
│   ├── MoodSelector.tsx          # Əhval seçimi (Yaxşı/Normal/Pis)
│   ├── ReasonSelector.tsx        # Səbəb seçimi
│   ├── SuccessScreen.tsx         # Uğur ekranı
│   ├── BranchSelector.tsx        # Filial seçimi
│   ├── AIAnalysisCard.tsx        # AI analiz nəticələri kartı
│   ├── AITasksCard.tsx           # AI tapşırıqları kartı
│   ├── PredictiveAnalytics.tsx   # Proqnoz analitikası
│   ├── ProtectedRoute.tsx        # Auth route wrapper
│   ├── ManagerBranchAssignment.tsx
│   ├── MobileNavMenu.tsx
│   ├── NotificationButton.tsx
│   └── ThemeToggle.tsx           # Tema keçidi
├── hooks/
│   ├── use-mobile.tsx            # Mobil ekran aşkarlama
│   ├── useNotifications.ts       # Bildiriş hook
│   └── useTheme.ts              # Tema idarəetmə
├── integrations/supabase/
│   ├── client.ts                 # ⚠️ AVTOMATİK
│   └── types.ts                  # ⚠️ AVTOMATİK
├── lib/
│   ├── utils.ts                  # cn() utility
│   └── exportUtils.ts            # CSV/Excel export
├── pages/                        # 15 səhifə (aşağıda)
├── index.css                     # Design tokens
├── main.tsx                      # Entry point
└── App.tsx                       # Router + providers

supabase/
├── config.toml                   # ⚠️ AVTOMATİK
└── functions/
    ├── analyze-responses/        # AI əhval analizi
    └── predict-risk/             # AI risk proqnozu</div>

<div class="warn">⚠️ <code>src/integrations/supabase/</code> və <code>supabase/config.toml</code> avtomatik generasiya olunur. Manual dəyişiklik etməyin.</div>
</div>

<div class="section">
<h2>4. ROUTİNG</h2>
<table>
  <tr><th>Route</th><th>Auth</th><th>Komponent</th><th>Təsvir</th></tr>
  <tr><td><code>/</code></td><td>❌</td><td>Index.tsx</td><td>İşçi sorğu interfeysi (anonim)</td></tr>
  <tr><td><code>/auth</code></td><td>❌</td><td>Auth.tsx</td><td>Giriş / Qeydiyyat</td></tr>
  <tr><td><code>/dashboard</code></td><td>✅</td><td>Dashboard.tsx</td><td>Menecer idarəetmə paneli</td></tr>
  <tr><td><code>/hr-panel</code></td><td>✅</td><td>HRPanel.tsx</td><td>HR tam nəzarət paneli</td></tr>
  <tr><td><code>/analytics</code></td><td>✅</td><td>Analytics.tsx</td><td>Proqnozlaşdırıcı analitika</td></tr>
  <tr><td><code>/reports</code></td><td>✅</td><td>Reports.tsx</td><td>Hesabatlar + export</td></tr>
  <tr><td><code>/employee-responses</code></td><td>✅</td><td>EmployeeResponses.tsx</td><td>İşçi cavabları detallı</td></tr>
  <tr><td><code>/manager-actions</code></td><td>✅</td><td>ManagerActions.tsx</td><td>Menecer tapşırıqları</td></tr>
  <tr><td><code>/manager-assignments</code></td><td>✅</td><td>ManagerAssignments.tsx</td><td>Menecer-filial təyinatları</td></tr>
  <tr><td><code>/targets</code></td><td>✅</td><td>Targets.tsx</td><td>Məmnuniyyət hədəfləri</td></tr>
  <tr><td><code>/suggestions-management</code></td><td>✅</td><td>SuggestionsManagement.tsx</td><td>Təkliflərin idarəsi</td></tr>
  <tr><td><code>/suggestion-box</code></td><td>❌</td><td>SuggestionBox.tsx</td><td>Anonim təklif qutusu</td></tr>
  <tr><td><code>/install</code></td><td>❌</td><td>Install.tsx</td><td>PWA quraşdırma</td></tr>
</table>
<p><strong>Auth mexanizmi:</strong> <code>ProtectedRoute</code> komponenti istifadəçinin autentifikasiya statusunu yoxlayır. Auth olmayan istifadəçi <code>/auth</code>-a yönləndirilir.</p>
</div>

<div class="section">
<h2>5. DATABASE SXEMİ (11 Cədvəl)</h2>

<h3>employee_responses — İşçi cavabları (anonim)</h3>
<table>
  <tr><th>Sütun</th><th>Tip</th><th>Təsvir</th></tr>
  <tr><td>id</td><td>UUID (PK)</td><td>Unikal ID</td></tr>
  <tr><td>employee_code</td><td>TEXT</td><td>Anonim kod (EMP+4 rəqəm)</td></tr>
  <tr><td>branch</td><td>TEXT</td><td>Filial</td></tr>
  <tr><td>department</td><td>TEXT</td><td>Şöbə</td></tr>
  <tr><td>mood</td><td>TEXT</td><td>Əla, Yaxşı, Normal, Pis, Çox pis</td></tr>
  <tr><td>reason</td><td>TEXT?</td><td>Sərbəst mətn səbəb</td></tr>
  <tr><td>reason_category</td><td>TEXT?</td><td>Kateqoriya</td></tr>
  <tr><td>response_date</td><td>DATE</td><td>Cavab tarixi</td></tr>
</table>

<h3>burnout_alerts — Risk alertləri</h3>
<table>
  <tr><th>Sütun</th><th>Tip</th><th>Təsvir</th></tr>
  <tr><td>id</td><td>UUID (PK)</td><td></td></tr>
  <tr><td>employee_code</td><td>TEXT</td><td>İşçi kodu</td></tr>
  <tr><td>branch / department</td><td>TEXT</td><td>Filial / Şöbə</td></tr>
  <tr><td>risk_score</td><td>INTEGER</td><td>0-100</td></tr>
  <tr><td>is_resolved</td><td>BOOLEAN</td><td>Həll statusu</td></tr>
  <tr><td>reason_category</td><td>TEXT</td><td>Risk səbəbi</td></tr>
</table>

<h3>user_roles — İstifadəçi rolları</h3>
<table>
  <tr><th>Sütun</th><th>Tip</th><th>Təsvir</th></tr>
  <tr><td>user_id</td><td>UUID</td><td>Auth user ID</td></tr>
  <tr><td>role</td><td>ENUM</td><td><code>hr</code> | <code>manager</code> | <code>employee</code></td></tr>
</table>

<h3>Digər cədvəllər</h3>
<table>
  <tr><th>Cədvəl</th><th>Təsvir</th></tr>
  <tr><td>ai_tasks</td><td>AI tapşırıqları (pending → in_progress → completed)</td></tr>
  <tr><td>manager_actions</td><td>Menecer fəaliyyətləri (burnout_alerts FK)</td></tr>
  <tr><td>manager_branches</td><td>Menecer-filial təyinatları</td></tr>
  <tr><td>manager_notifications</td><td>Real-time bildirişlər</td></tr>
  <tr><td>anonymous_suggestions</td><td>Anonim təkliflər</td></tr>
  <tr><td>satisfaction_targets</td><td>Məmnuniyyət hədəfləri</td></tr>
  <tr><td>external_metrics</td><td>Xarici ERP dataları (satış, şikayət)</td></tr>
  <tr><td>risk_predictions</td><td>AI risk proqnozları</td></tr>
</table>

<h3>Database funksiyaları</h3>
<table>
  <tr><th>Funksiya</th><th>Təsvir</th></tr>
  <tr><td><code>has_role(user_id, role)</code></td><td>Rolun olub-olmadığını yoxlayır</td></tr>
  <tr><td><code>get_user_branch(user_id)</code></td><td>Menecerin filialını qaytarır</td></tr>
  <tr><td><code>assign_user_role(user_id, role)</code></td><td>Rol təyin edir</td></tr>
</table>

<div class="warn">⚠️ Bütün cədvəllərdə <strong>Row Level Security (RLS)</strong> aktivdir. <code>employee_responses</code> anonim INSERT icazəsi var.</div>
</div>

<div class="section">
<h2>6. EDGE FUNKSİYALARI (API)</h2>

<h4>analyze-responses</h4>
<p><code>POST /functions/v1/analyze-responses</code></p>
<p><strong>Giriş:</strong> əhval paylanması, top səbəblər, risk sayı</p>
<p><strong>Çıxış:</strong> skor, xülasə, müşahidələr, tövsiyələr, risk səviyyəsi, tapşırıqlar</p>
<p><strong>Fallback:</strong> AI xətası zamanı metrik əsaslı avtomatik analiz</p>

<h4>predict-risk</h4>
<p><code>POST /functions/v1/predict-risk</code></p>
<p><strong>Giriş:</strong> stress, satış, şikayət dataları</p>
<p><strong>Çıxış:</strong> risk proqnozu, etibarlılıq skoru, təsiredici amillər</p>

<p><strong>Model:</strong> Google Gemini 2.5 Flash (Lovable AI Gateway, API key tələb olunmur)</p>
</div>

<div class="section">
<h2>7. DİZAYN SİSTEMİ</h2>
<table>
  <tr><th>Element</th><th>Dəyər</th></tr>
  <tr><td>Əsas rəng</td><td>hsl(195, 85%, 45%) — Cyan/Teal</td></tr>
  <tr><td>Font</td><td>Inter (400-800)</td></tr>
  <tr><td>UI Kit</td><td>Shadcn/UI</td></tr>
  <tr><td>Animasiyalar</td><td>Framer Motion</td></tr>
  <tr><td>Tema</td><td>Açıq/Qaranlıq (ThemeToggle)</td></tr>
  <tr><td>Responsive</td><td>Mobile-first (320px — 1920px)</td></tr>
</table>

<h3>Rəng qaydası</h3>
<p>Komponentlərdə birbaşa rəng istifadə etməyin. Həmişə semantic Tailwind token-ları (<code>bg-primary</code>, <code>text-foreground</code>) istifadə edin.</p>
<div class="arch-box">// ✅ Doğru
&lt;div className="bg-primary text-primary-foreground" /&gt;

// ❌ Yanlış
&lt;div className="bg-blue-500 text-white" /&gt;</div>
</div>

<div class="section">
<h2>8. DEVELOPMENT</h2>

<h3>Quraşdırma</h3>
<div class="arch-box">npm install
npm run dev</div>

<h3>Build</h3>
<div class="arch-box">npm run build
npm run preview</div>

<h3>⚠️ Mühüm qaydalar</h3>
<ul>
  <li><code>src/integrations/supabase/client.ts</code> və <code>types.ts</code> — <strong>redaktə etməyin</strong></li>
  <li><code>supabase/config.toml</code> — <strong>redaktə etməyin</strong></li>
  <li><code>.env</code> faylı avtomatik konfiqurasiya olunur</li>
  <li>Edge functions avtomatik deploy olunur</li>
  <li>Supabase client-i belə import edin: <code>import { supabase } from "@/integrations/supabase/client"</code></li>
</ul>

<h3>Əhval balı şkalası</h3>
<table>
  <tr><th>Əhval</th><th>Bal</th></tr>
  <tr><td>Əla</td><td>100 🟢</td></tr>
  <tr><td>Yaxşı</td><td>75 🟢</td></tr>
  <tr><td>Normal</td><td>50 🟡</td></tr>
  <tr><td>Pis</td><td>25 🔴</td></tr>
  <tr><td>Çox pis</td><td>0 🔴</td></tr>
</table>

<h3>Test filialları</h3>
<p>Bakı Mərkəz, Gəncə, Sumqayıt, Mingəçevir, Şirvan, Lənkəran, Şəki, Quba, Naxçıvan</p>
</div>

<div class="footer">
  <p><strong>OBA Personal Məmnuniyyət İdarəetmə Sistemi</strong> — Developer Guide</p>
  <p>Fevral 2026 | Versiya 2.0</p>
</div>

</body>
</html>`;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.onload = () => {
        setTimeout(() => printWindow.print(), 500);
      };
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <p className="text-muted-foreground">Developer Guide PDF hazırlanır... Çap pəncərəsi açılacaq.</p>
    </div>
  );
};

export default ExportSpec;
