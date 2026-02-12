import { useEffect } from "react";

const ExportSpec = () => {
  useEffect(() => {
    const html = `<!DOCTYPE html>
<html lang="az">
<head>
  <meta charset="UTF-8">
  <title>OBA - Texniki Tapşırıq v2.0</title>
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
    
    .arch-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 12px 0; font-family: monospace; font-size: 11.5px; white-space: pre; overflow-x: auto; line-height: 1.5; }
    
    .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; }
    .badge-green { background: #dcfce7; color: #166534; }
    .badge-red { background: #fee2e2; color: #991b1b; }
    .badge-yellow { background: #fef9c3; color: #854d0e; }
    
    .section { page-break-inside: avoid; }
    .footer { margin-top: 60px; padding-top: 20px; border-top: 2px solid #e2e8f0; text-align: center; font-size: 12px; color: #94a3b8; }
    
    @media print {
      body { padding: 20px 30px; }
      .cover { padding: 40px 0 30px; }
      h2 { page-break-before: auto; }
      .section { page-break-inside: avoid; }
    }
  </style>
</head>
<body>

<div class="cover">
  <h1>TEXNİKİ TAPŞIRIQ</h1>
  <h2>OBA Personal Məmnuniyyət İdarəetmə Sistemi</h2>
  <p>Versiya: 2.0 | Tarix: 12 Fevral 2026</p>
  <p>Canlı URL: https://oba-mood-ai.lovable.app</p>
</div>

<div class="section">
<h2>1. ÜMUMİ MƏLUMAT</h2>

<h3>1.1 Layihənin Adı</h3>
<p><strong>OBA Əhval Sistemi</strong> — Personal Məmnuniyyət İdarəetmə Platforması</p>

<h3>1.2 Layihənin Məqsədi</h3>
<p>İşçilərin gündəlik əhval-ruhiyyəsini real vaxtda izləyən, süni intellekt vasitəsilə analiz edən, burnout risklərini əvvəlcədən müəyyən edən və rəhbərliyə actionable tövsiyələr təqdim edən tam funksional web tətbiqdir.</p>

<h3>1.3 Hədəf İstifadəçilər</h3>
<table>
  <tr><th>Rol</th><th>Təsvir</th><th>Giriş Səviyyəsi</th></tr>
  <tr><td><strong>İşçi</strong></td><td>Gündəlik əhval sorğusunu dolduran şəxslər</td><td>Anonim, autentifikasiya tələb olunmur</td></tr>
  <tr><td><strong>Menecer</strong></td><td>Filial/bölgə səviyyəsində idarəetmə</td><td>Email/şifrə ilə giriş, yalnız öz filialı</td></tr>
  <tr><td><strong>HR</strong></td><td>Bütün sistem üzrə tam nəzarət</td><td>Email/şifrə ilə giriş, tam giriş</td></tr>
</table>

<h3>1.4 Layihənin Sahibi</h3>
<p>Sifarişçi: Şahin &nbsp;|&nbsp; İcraçı: Kərbala Ayı Arzu xanım</p>
</div>

<div class="section">
<h2>2. TEXNOLOGİYA STEKİ</h2>

<h3>2.1 Frontend</h3>
<table>
  <tr><th>Texnologiya</th><th>Versiya</th><th>Təyinat</th></tr>
  <tr><td>React</td><td>18.3</td><td>UI framework</td></tr>
  <tr><td>TypeScript</td><td>5.x</td><td>Tip təhlükəsizliyi</td></tr>
  <tr><td>Vite</td><td>5.x</td><td>Build tool və dev server</td></tr>
  <tr><td>Tailwind CSS</td><td>3.x</td><td>Utility-first CSS</td></tr>
  <tr><td>Framer Motion</td><td>12.x</td><td>Animasiyalar</td></tr>
  <tr><td>Shadcn/UI</td><td>Latest</td><td>UI komponent kitabxanası</td></tr>
  <tr><td>React Router</td><td>6.30</td><td>Client-side routing</td></tr>
  <tr><td>TanStack React Query</td><td>5.83</td><td>Server state management</td></tr>
  <tr><td>Recharts</td><td>2.15</td><td>Qrafiklər və diaqramlar</td></tr>
  <tr><td>Zod</td><td>3.25</td><td>Form validasiyası</td></tr>
</table>

<h3>2.2 Backend (Lovable Cloud)</h3>
<table>
  <tr><th>Xidmət</th><th>Təyinat</th></tr>
  <tr><td>PostgreSQL Database</td><td>Əsas verilənlər bazası</td></tr>
  <tr><td>Row Level Security (RLS)</td><td>Rol əsaslı data təhlükəsizliyi</td></tr>
  <tr><td>Edge Functions (Deno)</td><td>Serverless API endpointləri</td></tr>
  <tr><td>Realtime Subscriptions</td><td>Real vaxt bildirişlər</td></tr>
  <tr><td>Auth (Email/Password)</td><td>İstifadəçi autentifikasiyası</td></tr>
</table>

<h3>2.3 AI İnteqrasiyası</h3>
<table>
  <tr><th>Model</th><th>Təyinat</th></tr>
  <tr><td>Google Gemini 2.5 Flash</td><td>Əhval analizi, risk proqnozu, tövsiyələr</td></tr>
  <tr><td>Lovable AI Gateway</td><td>API key-siz AI çağırışları</td></tr>
</table>
</div>

<div class="section">
<h2>3. SİSTEM ARXİTEKTURASI</h2>

<div class="arch-box">┌─────────────────────────────────────────────────────────────┐
│                    İSTİFADƏÇİLƏR                            │
│   İşçi (Anonim)    Menecer (Auth)    HR (Auth)              │
└──────┬──────────────────┬──────────────────┬────────────────┘
       │                  │                  │
       ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│                  REACT FRONTEND (SPA)                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │Ana Səhifə│ │Dashboard │ │HR Panel  │ │Analytics │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
└──────────────────────┬──────────────────────────────────────┘
                       │ SDK
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              LOVABLE CLOUD BACKEND                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  PostgreSQL   │  │Edge Functions│  │  Realtime     │      │
│  │  (11 cədvəl)  │  │(AI Analiz)   │  │(Bildirişlər) │      │
│  │  + RLS        │  │(Risk Proqnoz)│  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              AI GATEWAY — Google Gemini 2.5 Flash            │
└─────────────────────────────────────────────────────────────┘</div>

<h3>3.2 Routing Strukturu</h3>
<table>
  <tr><th>Route</th><th>Auth</th><th>Təsvir</th></tr>
  <tr><td>/</td><td>❌</td><td>İşçi sorğu interfeysi (anonim)</td></tr>
  <tr><td>/auth</td><td>❌</td><td>Giriş/Qeydiyyat səhifəsi</td></tr>
  <tr><td>/dashboard</td><td>✅</td><td>Menecer idarəetmə paneli</td></tr>
  <tr><td>/hr-panel</td><td>✅</td><td>HR idarəetmə paneli</td></tr>
  <tr><td>/analytics</td><td>✅</td><td>Proqnozlaşdırıcı analitika</td></tr>
  <tr><td>/reports</td><td>✅</td><td>Hesabatlar və export</td></tr>
  <tr><td>/employee-responses</td><td>✅</td><td>İşçi cavabları detallı</td></tr>
  <tr><td>/manager-actions</td><td>✅</td><td>Menecer tapşırıqları</td></tr>
  <tr><td>/targets</td><td>✅</td><td>Məmnuniyyət hədəfləri</td></tr>
  <tr><td>/suggestion-box</td><td>❌</td><td>Anonim təklif qutusu</td></tr>
  <tr><td>/install</td><td>❌</td><td>PWA quraşdırma</td></tr>
</table>
</div>

<div class="section">
<h2>4. VERİLƏNLƏR BAZASI (11 Cədvəl)</h2>

<h3>4.1 employee_responses</h3>
<table>
  <tr><th>Sütun</th><th>Tip</th><th>Təsvir</th></tr>
  <tr><td>id</td><td>UUID</td><td>Unikal identifikator</td></tr>
  <tr><td>employee_code</td><td>TEXT</td><td>Anonim işçi kodu (EMP+4 rəqəm)</td></tr>
  <tr><td>branch</td><td>TEXT</td><td>Filial kodu</td></tr>
  <tr><td>department</td><td>TEXT</td><td>Şöbə adı</td></tr>
  <tr><td>mood</td><td>TEXT</td><td>Əhval: Əla, Yaxşı, Normal, Pis, Çox pis</td></tr>
  <tr><td>reason</td><td>TEXT</td><td>Sərbəst mətn səbəb</td></tr>
  <tr><td>reason_category</td><td>TEXT</td><td>Kateqoriya</td></tr>
  <tr><td>response_date</td><td>DATE</td><td>Cavab tarixi</td></tr>
</table>

<h3>4.2 burnout_alerts</h3>
<table>
  <tr><th>Sütun</th><th>Tip</th><th>Təsvir</th></tr>
  <tr><td>id</td><td>UUID</td><td>Unikal identifikator</td></tr>
  <tr><td>employee_code</td><td>TEXT</td><td>İşçi kodu</td></tr>
  <tr><td>branch / department</td><td>TEXT</td><td>Filial / Şöbə</td></tr>
  <tr><td>risk_score</td><td>INTEGER</td><td>Risk balı (0-100)</td></tr>
  <tr><td>is_resolved</td><td>BOOLEAN</td><td>Həll statusu</td></tr>
  <tr><td>reason_category</td><td>TEXT</td><td>Risk səbəbi</td></tr>
</table>

<h3>4.3 Digər Cədvəllər</h3>
<table>
  <tr><th>Cədvəl</th><th>Təsvir</th></tr>
  <tr><td>external_metrics</td><td>Xarici ERP metriklər (satış, şikayət, müştəri)</td></tr>
  <tr><td>risk_predictions</td><td>AI risk proqnozları</td></tr>
  <tr><td>ai_tasks</td><td>AI tərəfindən yaradılan tapşırıqlar</td></tr>
  <tr><td>manager_actions</td><td>Menecer fəaliyyətləri</td></tr>
  <tr><td>manager_branches</td><td>Menecer-filial təyinatları</td></tr>
  <tr><td>manager_notifications</td><td>Menecer bildirişləri</td></tr>
  <tr><td>anonymous_suggestions</td><td>Anonim təkliflər</td></tr>
  <tr><td>satisfaction_targets</td><td>Məmnuniyyət hədəfləri</td></tr>
  <tr><td>user_roles</td><td>İstifadəçi rolları (hr, manager, employee)</td></tr>
</table>

<h3>4.4 Database Funksiyaları</h3>
<table>
  <tr><th>Funksiya</th><th>Təsvir</th></tr>
  <tr><td>has_role(user_id, role)</td><td>İstifadəçinin rolunu yoxlayır</td></tr>
  <tr><td>get_user_branch(user_id)</td><td>Menecerin filialını qaytarır</td></tr>
  <tr><td>assign_user_role(user_id, role)</td><td>Yeni istifadəçiyə rol təyin edir</td></tr>
</table>
</div>

<div class="section">
<h2>5. FUNKSİONAL TƏLƏBLƏR</h2>

<h3>5.1 İşçi Modulu (Anonim)</h3>
<ul>
  <li><strong>Gündəlik Əhval Sorğusu:</strong> Bölgə seçimi → Əhval seçimi → Səbəb seçimi → Uğur ekranı</li>
  <li><strong>Əhval Seçimləri:</strong> Yaxşı 😊 | Normal 😐 | Pis 😔</li>
  <li><strong>Səbəb Kateqoriyaları:</strong> İş yükü, Qrafik, Menecer, Komanda, Digər</li>
  <li><strong>Anonimlik:</strong> Hər cavab üçün təsadüfi EMP kodu</li>
  <li><strong>Avtomatik Risk Alert:</strong> Pis əhval zamanı 70-95 arası risk skorlu burnout alert</li>
  <li><strong>Anonim Təklif Qutusu:</strong> Kateqoriya, filial, şöbə seçimi ilə sərbəst təklif</li>
  <li><strong>PWA:</strong> Mobil quraşdırma dəstəyi (iOS + Android)</li>
</ul>

<h3>5.2 Menecer Modulu</h3>
<ul>
  <li><strong>Dashboard:</strong> Məmnuniyyət indeksi, cavab sayı, burnout risk, cavab dərəcəsi</li>
  <li><strong>Qrafiklər:</strong> Əhval paylanması (Pie), Səbəblər (Bar), Trend (Line), Filial müqayisəsi</li>
  <li><strong>AI Analiz:</strong> Avtomatik müşahidələr, tövsiyələr, risk səviyyəsi</li>
  <li><strong>AI Tapşırıqları:</strong> Status idarəetmə (pending → in_progress → completed)</li>
  <li><strong>Tarix filtri:</strong> Son 7, 30, 90 gün + xüsusi aralıq</li>
  <li><strong>Real-time Bildirişlər:</strong> Push notification</li>
</ul>

<h3>5.3 HR Modulu (Tam Giriş)</h3>
<ul>
  <li><strong>HR Paneli:</strong> Bütün filiallar, region-rayon filtri, burnout cədvəli</li>
  <li><strong>Hesabatlar:</strong> Həftəlik/Aylıq/Rüblük/İllik + CSV/Excel/PDF export</li>
  <li><strong>Proqnozlaşdırıcı Analitika:</strong> Stress-satış korrelyasiyası, filial statusları</li>
  <li><strong>Menecer Təyinatları:</strong> Menecerləri fillallara təyin etmə</li>
  <li><strong>Məmnuniyyət Hədəfləri:</strong> Filial/şöbə üzrə hədəf təyin və izləmə</li>
  <li><strong>Təkliflərin İdarəsi:</strong> Status, prioritet, admin qeydləri</li>
</ul>

<h3>5.4 AI Funksionallığı</h3>
<ul>
  <li><strong>analyze-responses:</strong> Əhval analizi, müşahidələr, tövsiyələr, tapşırıqlar</li>
  <li><strong>predict-risk:</strong> Stress, satış, şikayət proqnozu</li>
  <li><strong>Model:</strong> Google Gemini 2.5 Flash (Lovable AI Gateway)</li>
  <li><strong>Fallback:</strong> AI xətası zamanı metrik əsaslı avtomatik analiz</li>
</ul>
</div>

<div class="section">
<h2>6. QEYRİ-FUNKSİONAL TƏLƏBLƏR</h2>

<h3>6.1 Performans</h3>
<ul>
  <li>İlk yüklənmə: &lt; 3 saniyə</li>
  <li>API cavab: &lt; 500ms</li>
  <li>AI analiz: &lt; 10 saniyə</li>
  <li>100+ eyni vaxtda istifadəçi</li>
</ul>

<h3>6.2 Təhlükəsizlik</h3>
<ul>
  <li>✅ Row Level Security (RLS) bütün cədvəllərdə</li>
  <li>✅ SECURITY DEFINER funksiyalar</li>
  <li>✅ İşçi cavabları tam anonim</li>
  <li>✅ PII backend-ə ötürülmür</li>
  <li>✅ Email/şifrə autentifikasiyası</li>
  <li>✅ DELETE əksər cədvəllərdə qadağan</li>
</ul>

<h3>6.3 Digər</h3>
<ul>
  <li>Mobile-first responsive dizayn (320px — 1920px)</li>
  <li>Açıq/Qaranlıq tema dəstəyi</li>
  <li>Tam Azərbaycan dilində interfeys</li>
  <li>PWA dəstəyi</li>
</ul>
</div>

<div class="section">
<h2>7. EDGE FUNKSİYALARI</h2>

<h4>analyze-responses</h4>
<p><code>POST /functions/v1/analyze-responses</code></p>
<p>Giriş: əhval paylanması, top səbəblər, risk sayı, kritik şikayətlər</p>
<p>Çıxış: skor, xülasə, müşahidələr, tövsiyələr, risk səviyyəsi, tapşırıqlar</p>

<h4>predict-risk</h4>
<p><code>POST /functions/v1/predict-risk</code></p>
<p>Giriş: stress, satış, şikayət dataları</p>
<p>Çıxış: risk proqnozu, etibarlılıq skoru, təsiredici amillər</p>
</div>

<div class="section">
<h2>8. DİZAYN SİSTEMİ</h2>
<table>
  <tr><th>Element</th><th>Dəyər</th></tr>
  <tr><td>Əsas rəng</td><td>hsl(195, 85%, 45%) — Cyan/Teal</td></tr>
  <tr><td>Font</td><td>Inter (400-800)</td></tr>
  <tr><td>Animasiyalar</td><td>Framer Motion</td></tr>
  <tr><td>UI Kit</td><td>Shadcn/UI</td></tr>
  <tr><td>Küncləri</td><td>rounded-xl / rounded-2xl</td></tr>
  <tr><td>Effektlər</td><td>backdrop-blur-xl, gradient, shadow-xl</td></tr>
</table>
</div>

<div class="section">
<h2>9. TEST VƏ DEMO</h2>

<h3>Test Filialları (9 ədəd)</h3>
<p>Bakı Mərkəz, Gəncə, Sumqayıt, Mingəçevir, Şirvan, Lənkəran, Şəki, Quba, Naxçıvan</p>

<h3>Test Ssenariləri</h3>
<table>
  <tr><th>Filial</th><th>Vəziyyət</th><th>Status</th></tr>
  <tr><td>Bakı Mərkəz</td><td>Yüksək stress, düşən satış (15,200₼ → 6,800₼)</td><td><span class="badge badge-red">Kritik</span></td></tr>
  <tr><td>Lənkəran</td><td>Yüksək stress, çox şikayət</td><td><span class="badge badge-red">Kritik</span></td></tr>
  <tr><td>Gəncə, Şəki</td><td>Orta stress</td><td><span class="badge badge-yellow">Diqqət</span></td></tr>
  <tr><td>Sumqayıt, Quba, Mingəçevir</td><td>Aşağı stress, yaxşı satış</td><td><span class="badge badge-green">Uğurlu</span></td></tr>
</table>

<h3>Əhval Balı Şkalası</h3>
<table>
  <tr><th>Əhval</th><th>Bal</th><th>Rəng</th></tr>
  <tr><td>Əla</td><td>100</td><td>🟢</td></tr>
  <tr><td>Yaxşı</td><td>75</td><td>🟢</td></tr>
  <tr><td>Normal</td><td>50</td><td>🟡</td></tr>
  <tr><td>Pis</td><td>25</td><td>🔴</td></tr>
  <tr><td>Çox pis</td><td>0</td><td>🔴</td></tr>
</table>
</div>

<div class="section">
<h2>10. DEPLOYMENT</h2>
<ul>
  <li><strong>Frontend:</strong> Lovable Cloud CDN (avtomatik deploy)</li>
  <li><strong>Backend:</strong> Lovable Cloud</li>
  <li><strong>Domain:</strong> oba-mood-ai.lovable.app</li>
  <li><strong>CI/CD:</strong> Git push → avtomatik build və deploy</li>
</ul>
</div>

<div class="section">
<h2>11. GƏLƏCƏK PLANLAR</h2>
<ul>
  <li>☐ 1C/SAP API real inteqrasiyası</li>
  <li>☐ Mobil native tətbiq (React Native)</li>
  <li>☐ Email bildirişləri</li>
  <li>☐ Təkmilləşdirilmiş AI modelləri</li>
  <li>☐ Çoxdilli dəstək (RU, EN)</li>
  <li>☐ İşçi self-service portal</li>
  <li>☐ Detallı audit log</li>
</ul>
</div>

<div class="footer">
  <p><strong>OBA Personal Məmnuniyyət İdarəetmə Sistemi</strong> © 2026</p>
  <p>Sənəd Tarixi: 12 Fevral 2026 | Versiya 2.0</p>
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
      <p className="text-muted-foreground">PDF hazırlanır... Çap pəncərəsi açılacaq.</p>
    </div>
  );
};

export default ExportSpec;
