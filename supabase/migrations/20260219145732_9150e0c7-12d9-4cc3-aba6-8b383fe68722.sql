
-- Fix: Allow reading ALL cms_content (active + inactive) so deactivation works in frontend
DROP POLICY IF EXISTS "Anyone can read active cms_content" ON public.cms_content;
CREATE POLICY "Anyone can read cms_content" ON public.cms_content FOR SELECT USING (true);

-- Add missing CMS keys for hero section (hero_title_1 and hero_title_2)
INSERT INTO public.cms_content (content_key, content_value, section, sort_order, is_active)
VALUES
  ('hero_title_1', 'Əməkdaş əhvalını rəqabət üstünlüyünə', 'hero', 1, true),
  ('hero_title_2', 'çevirin', 'hero', 2, true)
ON CONFLICT DO NOTHING;

-- Add missing CMS keys for AI Insights section
INSERT INTO public.cms_content (content_key, content_value, section, sort_order, is_active)
VALUES
  ('ai_insights_badge', 'AI Insights', 'ai_insights', 0, true),
  ('ai_insights_title', 'Real-vaxt AI Analiz', 'ai_insights', 1, true),
  ('ai_insight_1_title', 'Stress Artımı Aşkarlandı', 'ai_insights', 2, true),
  ('ai_insight_1_desc', 'Marketinq şöbəsində stress səviyyəsi bu həftə 12% artıb. Proaktiv müdaxilə tövsiyə olunur.', 'ai_insights', 3, true),
  ('ai_insight_2_title', 'Burnout Riski', 'ai_insights', 4, true),
  ('ai_insight_2_desc', '3 əməkdaşda ardıcıl 5 gün mənfi əhval-ruhiyyə qeydə alınıb. Menecerə bildiriş göndərildi.', 'ai_insights', 5, true),
  ('ai_insight_3_title', 'Pozitiv Trend', 'ai_insights', 6, true),
  ('ai_insight_3_desc', 'Satış şöbəsində məmnuniyyət 8% artıb. Komanda toplantılarının müsbət təsiri müşahidə olunur.', 'ai_insights', 7, true),
  ('trust_title', 'Etibarlı Tərəfdaşlar', 'social_proof', 0, true),
  ('trusted_partner', 'Etibarlı Tərəfdaş Sertifikatı', 'social_proof', 1, true),
  ('nav_free_start', 'Pulsuz başlayın', 'general', 10, true),
  ('cta_demo_btn', 'Canlı demo sınayın', 'general', 11, true),
  ('free_start_btn', 'Pulsuz başla', 'general', 12, true),
  ('popular_badge', 'Ən populyar', 'pricing', 0, true),
  ('faq_title', 'Tez-tez Verilən Suallar', 'faq', 0, true),
  ('badge_process', 'Proses', 'features', 50, true),
  ('badge_results', 'Nəticələr', 'features', 51, true),
  ('badge_reviews', 'Rəylər', 'features', 52, true),
  ('badge_pricing', 'Qiymətlər', 'pricing', 1, true),
  ('reviews_title', 'Müştərilərimiz nə deyir?', 'testimonials', 0, true),
  ('pricing_title', 'Abunə Paketləri', 'pricing', 2, true),
  ('pricing_subtitle', 'Filial bazasında. 14 gün pulsuz.', 'pricing', 3, true),
  ('step_label', 'Addım', 'features', 53, true),
  ('solution_shield', 'İtki olmadan ÖNCƏ müdaxilə', 'features', 54, true),
  ('stat_companies', '50', 'stats', 0, true),
  ('stat_companies_label', 'Şirkət istifadə edir', 'stats', 1, true),
  ('stat_users', '340', 'stats', 2, true),
  ('stat_users_label', 'Aktiv istifadəçi', 'stats', 3, true),
  ('stat_branches', '120', 'stats', 4, true),
  ('stat_branches_label', 'Filial', 'stats', 5, true),
  ('stat_satisfaction', '98', 'stats', 6, true),
  ('stat_satisfaction_label', 'Məmnuniyyət', 'stats', 7, true)
ON CONFLICT DO NOTHING;
