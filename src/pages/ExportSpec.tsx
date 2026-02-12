import { useEffect } from "react";

const ExportSpec = () => {
  useEffect(() => {
    const html = `<!DOCTYPE html>
<html lang="az">
<head>
  <meta charset="UTF-8">
  <title>OBA Əhval Sistemi — Layihə Haqqında</title>
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
    li { margin-bottom: 6px; }
    
    table { width: 100%; border-collapse: collapse; margin: 12px 0 20px; font-size: 12.5px; }
    th { background: #f1f5f9; font-weight: 600; text-transform: uppercase; font-size: 11px; color: #64748b; letter-spacing: 0.5px; }
    th, td { padding: 8px 12px; text-align: left; border: 1px solid #e2e8f0; }
    tr:nth-child(even) { background: #f8fafc; }
    
    .flow-box { background: #f0fdfa; border: 2px solid #99f6e4; border-radius: 12px; padding: 24px; margin: 16px 0; font-family: 'SF Mono', 'Fira Code', monospace; font-size: 12px; white-space: pre; line-height: 2; text-align: center; }
    
    .feature-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px; margin: 12px 0; }
    .feature-card h4 { margin: 0 0 8px; color: #0891b2; }
    .feature-card p { margin: 0; font-size: 13px; }
    .feature-card ul { margin-top: 8px; margin-bottom: 0; }
    
    .badge { display: inline-block; padding: 3px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; margin-right: 6px; }
    .badge-green { background: #dcfce7; color: #166534; }
    .badge-blue { background: #dbeafe; color: #1e40af; }
    .badge-yellow { background: #fef9c3; color: #854d0e; }
    .badge-red { background: #fee2e2; color: #991b1b; }
    
    .check { color: #16a34a; margin-right: 6px; }
    
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
  <h1>OBA ƏHVAL SİSTEMİ</h1>
  <h2>Personal Məmnuniyyət İdarəetmə Sistemi</h2>
  <p>Layihə Haqqında Sənəd</p>
  <p>Versiya: 2.0 | Fevral 2026</p>
  <p>Canlı URL: https://oba-mood-ai.lovable.app</p>
</div>

<div class="section">
<h2>1. ÜMUMİ MƏLUMAT</h2>
<p><strong>OBA Əhval Sistemi</strong> — işçilərin gündəlik əhval-ruhiyyəsini real vaxtda izləyən, süni intellekt (AI) ilə analiz edən və burnout (tükənmə) risklərini əvvəlcədən aşkarlayan web tətbiqdir.</p>

<h3>🎯 Məqsəd</h3>
<p>Personalın əhvalı düşəndə müştəri təcrübəsi zərər görməzdən <strong>əvvəl</strong> müdaxilə etmək. Rəhbərliyə vaxtında, dəqiq və hərəkətə keçməyə imkan verən tövsiyələr təqdim etmək.</p>
</div>

<div class="section">
<h2>2. İSTİFADƏÇİ ROLLARI</h2>
<table>
  <tr><th>Rol</th><th>Giriş üsulu</th><th>İmkanları</th></tr>
  <tr><td><strong>İşçi</strong></td><td>Anonim (giriş tələb olunmur)</td><td>Gündəlik əhval sorğusu doldurma, anonim təklif göndərmə</td></tr>
  <tr><td><strong>Menecer</strong></td><td>Email + şifrə</td><td>Öz filialının dashboardu, AI analiz, tapşırıqlar, bildirişlər</td></tr>
  <tr><td><strong>HR</strong></td><td>Email + şifrə</td><td>Bütün filiallar, hesabatlar, menecer təyinatları, hədəflər, təkliflərin idarəsi</td></tr>
</table>
</div>

<div class="section">
<h2>3. FUNKSİONALLIQLAR</h2>

<div class="feature-card">
  <h4>🎭 3.1 İşçi Sorğu Sistemi (Anonim)</h4>
  <ul>
    <li>Hər gün sadə bir sual: "Bu gün özünüzü necə hiss edirsiniz?"</li>
    <li><strong>5 əhval seçimi:</strong> Əla, Yaxşı, Normal, Pis, Çox pis</li>
    <li>Mənfi əhval seçildikdə <strong>səbəb kateqoriyası</strong> soruşulur: Menecer, İş yükü, Qrafik, Komanda, Şərtlər, Digər</li>
    <li>"Digər" seçildikdə sərbəst mətn yazmaq imkanı</li>
    <li>Tam anonimlik — şəxsi məlumat saxlanmır</li>
    <li>Cavab göndərildikdən sonra uğur ekranı və məxfilik xəbərdarlığı</li>
  </ul>
</div>

<div class="feature-card">
  <h4>📊 3.2 Menecer Dashboard</h4>
  <ul>
    <li><strong>Ümumi məmnuniyyət indeksi</strong> — filialın orta əhval balı (0–100)</li>
    <li><strong>Cavab sayı və cavab dərəcəsi</strong> — neçə işçi sorğunu doldurub</li>
    <li><strong>Burnout risk sayı</strong> — risk altında olan işçi sayı</li>
    <li><strong>Əhval bölgüsü</strong> — Əla/Yaxşı/Normal/Pis/Çox pis nisbətləri vizual olaraq</li>
    <li><strong>Top səbəblər</strong> — ən çox seçilən mənfi əhval kateqoriyaları</li>
    <li><strong>Risk alertləri</strong> — diqqət tələb edən hallar üçün xəbərdarlıq kartları</li>
  </ul>
</div>

<div class="feature-card">
  <h4>🤖 3.3 AI Analiz (Süni İntellekt)</h4>
  <ul>
    <li>Toplanmış əhval datalarını <strong>avtomatik analiz</strong> edir</li>
    <li><strong>Xülasə</strong> — ümumi vəziyyətin qısa təsviri</li>
    <li><strong>Müşahidələr</strong> — diqqəti çəkən tendensiyalar</li>
    <li><strong>Tövsiyələr</strong> — hərəkətə keçmək üçün konkret addımlar</li>
    <li><strong>Risk səviyyəsi</strong> — aşağı / orta / yüksək / kritik</li>
    <li><strong>Kritik tapşırıqlar</strong> — AI-ın müəyyən etdiyi təcili addımlar (avtomatik yaradılır)</li>
  </ul>
</div>

<div class="feature-card">
  <h4>🔮 3.4 Proqnozlaşdırıcı Analitika</h4>
  <ul>
    <li>Gələcək <strong>risk proqnozu</strong> — stress, satış, şikayət datalarına əsasən</li>
    <li><strong>Etibarlılıq skoru</strong> — proqnozun dəqiqlik dərəcəsi</li>
    <li><strong>Təsiredici amillər</strong> — hansı faktorlar riski artırır</li>
  </ul>
</div>

<div class="feature-card">
  <h4>📈 3.5 Qrafiklər və Vizualizasiya</h4>
  <ul>
    <li><strong>Əhval Pie Chart</strong> — əhval paylanması dairəvi qrafik</li>
    <li><strong>Səbəblər Bar Chart</strong> — mənfi əhval kateqoriyaları sütun qrafik</li>
    <li><strong>Trend Line Chart</strong> — əhval tendensiyası zaman xətti</li>
    <li><strong>Filial müqayisəsi</strong> — filiallar arası müqayisə qrafiki</li>
  </ul>
</div>

<div class="feature-card">
  <h4>📋 3.6 Hesabatlar və Export</h4>
  <ul>
    <li>Əhval datalarını <strong>CSV və Excel formatında</strong> yükləmə imkanı</li>
    <li>Tarix, filial, şöbə üzrə <strong>filtrasiya</strong></li>
    <li>Detallı işçi cavabları siyahısı</li>
  </ul>
</div>

<div class="feature-card">
  <h4>🎯 3.7 Məmnuniyyət Hədəfləri</h4>
  <ul>
    <li>HR filial və şöbə üzrə <strong>hədəf dəyərlər</strong> təyin edə bilər</li>
    <li>Cari dəyər vs hədəf — progress izləmə</li>
    <li>Müəyyən müddət üçün (başlanğıc – bitiş tarixi)</li>
  </ul>
</div>

<div class="feature-card">
  <h4>💡 3.8 Anonim Təklif Qutusu</h4>
  <ul>
    <li>İşçilər <strong>anonim təkliflər</strong> göndərə bilər (giriş tələb olunmur)</li>
    <li>HR təklifləri nəzərdən keçirə, prioritet təyin edə, qeyd əlavə edə bilər</li>
    <li>Status: gözləyir → baxılır → tamamlandı</li>
  </ul>
</div>

<div class="feature-card">
  <h4>👔 3.9 Menecer Tapşırıqları</h4>
  <ul>
    <li>Burnout alertlərinə əsasən <strong>fəaliyyət planı</strong> yaratmaq</li>
    <li>Tapşırıq növləri: Fərdi görüş, İş yükü tənzimlənməsi, Qrafik dəyişikliyi, Komanda iclası, Təlim</li>
    <li>Status: gözləyir → icrada → tamamlandı</li>
  </ul>
</div>

<div class="feature-card">
  <h4>🔔 3.10 Bildiriş Sistemi</h4>
  <ul>
    <li>Menecerlərə <strong>real-time bildirişlər</strong> göndərilir</li>
    <li>Yeni burnout riski, kritik vəziyyət haqqında xəbərdarlıqlar</li>
    <li>Oxunmuş/oxunmamış status</li>
  </ul>
</div>

<div class="feature-card">
  <h4>👥 3.11 Menecer-Filial Təyinatları</h4>
  <ul>
    <li>HR hər meneceri müəyyən filiala təyin edə bilər</li>
    <li>Menecer yalnız öz filialının datalarını görür</li>
  </ul>
</div>

<div class="feature-card">
  <h4>🌓 3.12 Tema və Mobil Dəstək</h4>
  <ul>
    <li><strong>Açıq/Qaranlıq tema</strong> — istifadəçi seçimi yadda saxlanılır</li>
    <li>Tam <strong>responsive</strong> dizayn (320px – 1920px)</li>
    <li>Mobil naviqasiya menyusu, touch-friendly düymələr</li>
    <li><strong>PWA quraşdırma</strong> — telefonun ana ekranına əlavə etmək imkanı</li>
  </ul>
</div>
</div>

<div class="section">
<h2>4. ƏHVAL BALI ŞKALASI</h2>
<table>
  <tr><th>Əhval</th><th>Bal</th><th>İşarə</th></tr>
  <tr><td>Əla</td><td>100</td><td><span class="badge badge-green">🟢 Əla</span></td></tr>
  <tr><td>Yaxşı</td><td>75</td><td><span class="badge badge-green">🟢 Yaxşı</span></td></tr>
  <tr><td>Normal</td><td>50</td><td><span class="badge badge-yellow">🟡 Normal</span></td></tr>
  <tr><td>Pis</td><td>25</td><td><span class="badge badge-red">🔴 Pis</span></td></tr>
  <tr><td>Çox pis</td><td>0</td><td><span class="badge badge-red">🔴 Çox pis</span></td></tr>
</table>
</div>

<div class="section">
<h2>5. İŞ AXINI</h2>
<div class="flow-box">İşçi sorğu doldurur (anonim)
        ↓
Data bazaya yazılır
        ↓
Menecer dashboardda görür
        ↓
AI avtomatik analiz edir
        ↓
Kritik tapşırıqlar yaradılır
        ↓
Menecer hərəkətə keçir
        ↓
Nəticə izlənir</div>
</div>

<div class="section">
<h2>6. FİLİALLAR</h2>
<p>Sistem 9 filialı əhatə edir:</p>
<p><span class="badge badge-blue">Bakı Mərkəz</span> <span class="badge badge-blue">Gəncə</span> <span class="badge badge-blue">Sumqayıt</span> <span class="badge badge-blue">Mingəçevir</span> <span class="badge badge-blue">Şirvan</span> <span class="badge badge-blue">Lənkəran</span> <span class="badge badge-blue">Şəki</span> <span class="badge badge-blue">Quba</span> <span class="badge badge-blue">Naxçıvan</span></p>
</div>

<div class="section">
<h2>7. TƏHLÜKƏSİZLİK VƏ MƏXFİLİK</h2>
<ul>
  <li><span class="check">✅</span> İşçi cavabları <strong>tam anonim</strong> — şəxsi məlumat saxlanmır</li>
  <li><span class="check">✅</span> Rol əsaslı giriş — hər istifadəçi yalnız öz səlahiyyətləri daxilində data görür</li>
  <li><span class="check">✅</span> Bütün cədvəllərdə <strong>sətir səviyyəsində təhlükəsizlik</strong> (RLS) aktivdir</li>
  <li><span class="check">✅</span> HTTPS ilə şifrələnmiş bağlantı</li>
</ul>
</div>

<div class="footer">
  <p><strong>OBA Personal Məmnuniyyət İdarəetmə Sistemi</strong></p>
  <p>Sifarişçi: Şahin | İcraçı: PATCO Group</p>
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
      <p className="text-muted-foreground">Layihə haqqında PDF hazırlanır... Çap pəncərəsi açılacaq.</p>
    </div>
  );
};

export default ExportSpec;
