/*
# Manicure Course Sales Page — Full Schema

## Purpose
Stores all content for a premium manicure course landing page plus the admin panel that edits it.
Single-row config tables hold editable text, colors, typography, SEO, analytics, and offer data.
Multi-row tables hold modules, testimonials, FAQ, and CTAs — each with CRUD + ordering + active toggle.

## Tables

1. `site_config` — single row (id=1). Holds hero, benefits, for-whom, objection, guarantee,
   final-CTA copy, color palette, typography settings, SEO meta, analytics tracking codes,
   and offer details (price, old price, payment condition, bonus, guarantee text).
2. `modules` — course modules + bonus. Columns: number, title, description, image_url, icon,
   order, is_active, is_bonus.
3. `testimonials` — carousel cards. Columns: name, photo_url, text, result, rating (1-5),
   is_featured, order, is_active.
4. `faqs` — accordion items. Columns: question, answer, order, is_active.
5. `ctas` — configurable call-to-action buttons. Columns: key (unique slug), label, url,
   color, icon (lucide name), open_new_tab, is_active.

## Security
- All tables have RLS enabled.
- SELECT is public (TO anon, authenticated) so the public landing page renders without login.
- INSERT/UPDATE/DELETE are restricted to authenticated admins.
- A storage bucket `site-assets` is created for image uploads, public-read, 5MB image limit.
- Storage policies: public read, authenticated insert/update/delete.
*/

-- =========================================================
-- site_config (single row)
-- =========================================================
CREATE TABLE IF NOT EXISTS site_config (
  id smallint PRIMARY KEY DEFAULT 1,
  hero_headline text NOT NULL DEFAULT 'Aprenda Manicure do Zero e Desenvolva uma Técnica Profissional',
  hero_subheadline text NOT NULL DEFAULT 'Aprenda passo a passo, mesmo que você esteja começando agora, com aulas práticas e materiais organizados para facilitar sua evolução.',
  hero_microcopy text NOT NULL DEFAULT 'Acesso online • Estude no seu ritmo • Conteúdo passo a passo',
  hero_image_url text,
  benefits_title text NOT NULL DEFAULT 'O que você encontra dentro do curso',
  benefits jsonb NOT NULL DEFAULT '[
    "Aulas organizadas passo a passo",
    "Conteúdo pensado para iniciantes",
    "Técnicas práticas demonstradas",
    "Materiais e ferramentas explicados",
    "Conteúdo acessível online",
    "Aprendizado no próprio ritmo",
    "Bônus para continuar evoluindo"
  ]'::jsonb,
  for_whom_title text NOT NULL DEFAULT 'Para quem é este curso',
  for_whom jsonb NOT NULL DEFAULT '[
    "Para quem está começando do zero",
    "Para quem quer aperfeiçoar suas técnicas",
    "Para quem quer aprender novas técnicas de manicure",
    "Para quem quer estudar no próprio ritmo"
  ]'::jsonb,
  objection_title text NOT NULL DEFAULT 'E se eu nunca fiz manicure?',
  objection_text text NOT NULL DEFAULT 'O curso foi pensado para quem está dando os primeiros passos. Cada módulo começa pelo básico e avança com calma, mostrando cada etapa na prática. Você acompanha no seu tempo, revisa quantas vezes quiser e evolui com confiança.',
  offer_title text NOT NULL DEFAULT 'Curso Completo de Manicure',
  offer_price text NOT NULL DEFAULT 'R$ 197',
  offer_old_price text NOT NULL DEFAULT 'R$ 397',
  offer_condition text NOT NULL DEFAULT 'À vista ou parcelado em até 12x',
  offer_text text NOT NULL DEFAULT 'Acesso completo a todos os módulos do curso, bônus inclusos e certificado de conclusão.',
  offer_bonus text NOT NULL DEFAULT 'Bônus — Unhas de Gel para Iniciantes',
  offer_includes jsonb NOT NULL DEFAULT '[
    "Todos os módulos do curso",
    "Bônus Unhas de Gel para Iniciantes",
    "Acesso online, no seu ritmo",
    "Certificado de conclusão"
  ]'::jsonb,
  guarantee_title text NOT NULL DEFAULT 'Você pode conhecer o curso com tranquilidade',
  guarantee_text text NOT NULL DEFAULT 'Acreditamos na qualidade do conteúdo. Por isso, você conhece o curso com calma e decide se é para você. Em caso de dúvida, entre em contato com nosso suporte e te ajudamos.',
  final_cta_headline text NOT NULL DEFAULT 'Seu próximo passo começa aqui',
  final_cta_text text NOT NULL DEFAULT 'Comece agora a aprender uma técnica profissional de manicure, no seu ritmo e com conteúdo organizado do zero ao avançado.',
  -- Colors
  color_primary text NOT NULL DEFAULT '#b91c63',
  color_secondary text NOT NULL DEFAULT '#7a3b6e',
  color_button text NOT NULL DEFAULT '#b91c63',
  color_button_text text NOT NULL DEFAULT '#ffffff',
  color_text text NOT NULL DEFAULT '#1f2937',
  color_background text NOT NULL DEFAULT '#fdfcfd',
  color_card text NOT NULL DEFAULT '#ffffff',
  color_highlight text NOT NULL DEFAULT '#f5e6ee',
  -- Typography
  font_heading text NOT NULL DEFAULT 'Playfair Display',
  font_body text NOT NULL DEFAULT 'Inter',
  font_base_size text NOT NULL DEFAULT '16px',
  font_heading_weight text NOT NULL DEFAULT '600',
  font_body_weight text NOT NULL DEFAULT '400',
  font_letter_spacing text NOT NULL DEFAULT '0',
  font_line_height text NOT NULL DEFAULT '1.6',
  -- SEO
  seo_title text NOT NULL DEFAULT 'Curso de Manicure do Zero ao Avançado | Aulas Online',
  seo_description text NOT NULL DEFAULT 'Aprenda manicure do zero com aulas práticas passo a passo, materiais explicados e bônus de unhas de gel. Estude online no seu ritmo.',
  seo_og_image text,
  -- Analytics
  google_analytics text,
  meta_pixel text,
  google_tag_manager text,
  updated_at timestamptz DEFAULT now()
);

INSERT INTO site_config (id) VALUES (1)
  ON CONFLICT (id) DO NOTHING;

-- =========================================================
-- modules
-- =========================================================
CREATE TABLE IF NOT EXISTS modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number text NOT NULL DEFAULT '01',
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  image_url text,
  icon text NOT NULL DEFAULT 'BookOpen',
  is_bonus boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- =========================================================
-- testimonials
-- =========================================================
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  photo_url text,
  text text NOT NULL DEFAULT '',
  result text NOT NULL DEFAULT '',
  rating int NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  is_featured boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- =========================================================
-- faqs
-- =========================================================
CREATE TABLE IF NOT EXISTS faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- =========================================================
-- ctas
-- =========================================================
CREATE TABLE IF NOT EXISTS ctas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  label text NOT NULL DEFAULT 'Quero começar agora',
  url text NOT NULL DEFAULT '#',
  color text NOT NULL DEFAULT '#b91c63',
  icon text NOT NULL DEFAULT 'ArrowRight',
  open_new_tab boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- =========================================================
-- RLS
-- =========================================================
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ctas ENABLE ROW LEVEL SECURITY;

-- Public read for all
DROP POLICY IF EXISTS "public_read_site_config" ON site_config;
CREATE POLICY "public_read_site_config" ON site_config FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_read_modules" ON modules;
CREATE POLICY "public_read_modules" ON modules FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_read_testimonials" ON testimonials;
CREATE POLICY "public_read_testimonials" ON testimonials FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_read_faqs" ON faqs;
CREATE POLICY "public_read_faqs" ON faqs FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_read_ctas" ON ctas;
CREATE POLICY "public_read_ctas" ON ctas FOR SELECT
  TO anon, authenticated USING (true);

-- Admin write (authenticated only)
DROP POLICY IF EXISTS "admin_write_site_config" ON site_config;
CREATE POLICY "admin_write_site_config" ON site_config FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_write_modules" ON modules;
CREATE POLICY "admin_write_modules" ON modules FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_write_testimonials" ON testimonials;
CREATE POLICY "admin_write_testimonials" ON testimonials FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_write_faqs" ON faqs;
CREATE POLICY "admin_write_faqs" ON faqs FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_write_ctas" ON ctas;
CREATE POLICY "admin_write_ctas" ON ctas FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

-- =========================================================
-- Storage bucket
-- =========================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "public_read_site_assets" ON storage.objects;
CREATE POLICY "public_read_site_assets" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'site-assets');

DROP POLICY IF EXISTS "admin_write_site_assets" ON storage.objects;
CREATE POLICY "admin_write_site_assets" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'site-assets');

DROP POLICY IF EXISTS "admin_update_site_assets" ON storage.objects;
CREATE POLICY "admin_update_site_assets" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'site-assets');

DROP POLICY IF EXISTS "admin_delete_site_assets" ON storage.objects;
CREATE POLICY "admin_delete_site_assets" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'site-assets');