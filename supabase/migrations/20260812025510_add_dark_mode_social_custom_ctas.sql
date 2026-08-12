/*
# Add dark mode, social links, and custom CTA support

## Changes
1. site_config: add dark mode color fields + dark_mode_enabled toggle
2. site_config: add social media link fields (instagram, facebook, whatsapp, youtube, tiktok, email)
3. ctas: add section column for custom CTA placement, is_custom flag for user-created CTAs

## Security
- No RLS changes needed; existing policies cover new columns.
*/

ALTER TABLE site_config
  ADD COLUMN IF NOT EXISTS dark_mode_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS dark_color_background text NOT NULL DEFAULT '#1a1626',
  ADD COLUMN IF NOT EXISTS dark_color_text text NOT NULL DEFAULT '#f5f0f5',
  ADD COLUMN IF NOT EXISTS dark_color_card text NOT NULL DEFAULT '#2a2438',
  ADD COLUMN IF NOT EXISTS dark_color_highlight text NOT NULL DEFAULT '#3d2f3d',
  ADD COLUMN IF NOT EXISTS social_instagram text,
  ADD COLUMN IF NOT EXISTS social_facebook text,
  ADD COLUMN IF NOT EXISTS social_whatsapp text,
  ADD COLUMN IF NOT EXISTS social_youtube text,
  ADD COLUMN IF NOT EXISTS social_tiktok text,
  ADD COLUMN IF NOT EXISTS social_email text;

ALTER TABLE ctas
  ADD COLUMN IF NOT EXISTS section text NOT NULL DEFAULT 'custom',
  ADD COLUMN IF NOT EXISTS is_custom boolean NOT NULL DEFAULT false;