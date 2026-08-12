import { useEffect } from 'react';
import type { SiteConfig } from './types';

const FONT_OPTIONS = [
  'Playfair Display',
  'Inter',
  'Cormorant Garamond',
  'Lora',
  'Montserrat',
  'DM Serif Display',
  'Poppins',
  'Nunito Sans',
];

const loadedFonts = new Set<string>();

function loadFont(font: string) {
  if (loadedFonts.has(font) || !FONT_OPTIONS.includes(font)) return;
  loadedFonts.add(font);
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font).replace(/%20/g, '+')}:wght@400;500;600;700&display=swap`;
  document.head.appendChild(link);
}

export function useTheme(config: SiteConfig | null, darkMode = false) {
  useEffect(() => {
    if (!config) return;
    const root = document.documentElement;
    root.style.setProperty('--color-primary', config.color_primary);
    root.style.setProperty('--color-secondary', config.color_secondary);
    root.style.setProperty('--color-button', config.color_button);
    root.style.setProperty('--color-button-text', config.color_button_text);
    root.style.setProperty('--color-text', darkMode ? config.dark_color_text : config.color_text);
    root.style.setProperty('--color-background', darkMode ? config.dark_color_background : config.color_background);
    root.style.setProperty('--color-card', darkMode ? config.dark_color_card : config.color_card);
    root.style.setProperty('--color-highlight', darkMode ? config.dark_color_highlight : config.color_highlight);
    root.style.setProperty('--font-heading', `'${config.font_heading}', serif`);
    root.style.setProperty('--font-body', `'${config.font_body}', sans-serif`);
    root.style.setProperty('--font-base-size', config.font_base_size);
    root.style.setProperty('--font-heading-weight', config.font_heading_weight);
    root.style.setProperty('--font-body-weight', config.font_body_weight);
    root.style.setProperty('--font-letter-spacing', config.font_letter_spacing);
    root.style.setProperty('--font-line-height', config.font_line_height);
    document.body.style.fontSize = config.font_base_size;
    document.body.style.fontFamily = `'${config.font_body}', sans-serif`;
    document.body.style.lineHeight = config.font_line_height;
    document.body.style.letterSpacing = config.font_letter_spacing;
    document.body.style.color = darkMode ? config.dark_color_text : config.color_text;
    document.body.style.backgroundColor = darkMode ? config.dark_color_background : config.color_background;
    loadFont(config.font_heading);
    loadFont(config.font_body);
  }, [config, darkMode]);
}

export { FONT_OPTIONS };
