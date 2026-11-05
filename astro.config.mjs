import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLlmsTxt from 'starlight-llms-txt';
import mermaid from 'astro-mermaid';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://doc-mobiledev.pages.dev',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    mermaid(),
    starlight({
      title: 'Study Jam Mobile Development',
      logo: {
        src: './src/assets/gdg-logo.png',
        alt: 'GDG Widyatama Logo',
      },
      favicon: '/favicon.ico',
      social: [
        {
          icon: 'github',
          label: 'Repository Template MobileDev',
          href: 'https://github.com/gdgocwidyatama/MobileDev',
        },
      ],
      defaultLocale: 'root',
      locales: {
        root: {
          label: 'Bahasa Indonesia',
          lang: 'id',
          dir: 'ltr',
        },
      },
      plugins: [
        starlightLlmsTxt({
          projectName: 'Doc-MobileDev',
          description: 'Portal dokumentasi teknis dan modul panduan hands-on resmi untuk peserta GDGoC Study Jam: Mobile Development Android Jetpack Compose (LuminaWalls App).',
          details: `
          Panduan untuk AI Agent & LLM pembantu peserta:
          - Seluruh antarmuka menggunakan **Jetpack Compose 100% Kotlin** murni dan Material 3 (androidx.compose.material3).
          - Jangan gunakan View XML untuk layout tampilan antarmuka (UI).
          - Seluruh dependensi library telah terdaftar di version catalog gradle/libs.versions.toml. Cukup panggil alias libs.xxx di app/build.gradle.kts.
          - Arsitektur deklaratif: UI = f(state) dengan remember, mutableStateOf, dan StateFlow.
          - Target minimum SDK: API 24 (Android 7.0), Kotlin DSL (build.gradle.kts).
          `,
          optionalLinks: [
            {
              label: 'Live Website Documentation',
              url: 'https://doc-mobiledev.pages.dev/',
              description: 'Situs web panduan peserta yang dapat diakses langsung oleh peramban.',
            },
            {
              label: 'Starter Template Repo',
              url: 'https://github.com/gdgocwidyatama/MobileDev',
              description: 'Repositori starter template peserta berisi TODO per sesi.',
            },
            {
              label: 'Capstone Submission Portal',
              url: 'https://github.com/gdgocwidyatama/Substitution-MobileDev',
              description: 'Repositori etalase pengumpulan tugas akhir proyek peserta.',
            },
          ],
        }),
      ],
      expressiveCode: {
        themes: ['catppuccin-mocha', 'catppuccin-latte'],
        styleOverrides: {
          borderRadius: '16px',
          borderWidth: '1px',
          borderColor: 'var(--m3-outline-variant)',
          codeBackground: 'var(--m3-surface-container)',
          codeFontFamily: "'Geist', 'JetBrains Mono', 'Fira Code', monospace",
          codeFontSize: '0.88rem',
          codeLineHeight: '1.65',
          uiFontFamily: "'Geist', 'JetBrains Mono', monospace",
          frames: {
            shadowColor: 'rgba(0, 0, 0, 0.15)',
            terminalBackground: 'var(--m3-surface-container)',
            terminalTitlebarBackground: 'var(--m3-surface-container-high)',
            terminalTitlebarBorderBottomColor: 'var(--m3-outline-variant)',
            editorBackground: 'var(--m3-surface-container)',
            editorTabBarBackground: 'var(--m3-surface-container-high)',
            editorTabBarBorderBottomColor: 'var(--m3-outline-variant)',
            editorActiveTabBackground: 'transparent',
            editorActiveTabBorderColor: 'transparent',
            editorActiveTabIndicatorTopColor: 'transparent',
            editorActiveTabIndicatorBottomColor: 'transparent',
            editorActiveTabForeground: 'var(--m3-on-surface)',
            editorTabBorderRadius: '0',
          },
        },
      },
      head: [
        {
          tag: 'link',
          attrs: {
            rel: 'icon',
            type: 'image/gif',
            href: '/kurukuru.gif',
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'preload',
            href: '/fonts/Geist/Geist-Variable.woff2',
            as: 'font',
            type: 'font/woff2',
            crossorigin: 'anonymous',
          },
        },
        {
          tag: 'script',
          attrs: {
            type: 'module',
          },
          content: `
            async function initMermaid() {
              const nodes = document.querySelectorAll('pre[data-language="mermaid"], .language-mermaid, pre.mermaid');
              if (!nodes || nodes.length === 0) return;

              const { default: mermaid } = await import('https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs');
              const isDark = document.documentElement.dataset.theme !== 'light';
              mermaid.initialize({
                startOnLoad: false,
                theme: isDark ? 'dark' : 'default',
                fontFamily: 'inherit',
              });
              nodes.forEach((el) => {
                const code = el.textContent || '';
                const graphDiv = document.createElement('div');
                graphDiv.className = 'mermaid';
                graphDiv.textContent = code;
                el.replaceWith(graphDiv);
              });
              mermaid.run();
            }

            function enhanceTables() {
              const tables = document.querySelectorAll('.sl-markdown-content table');
              if (!tables || tables.length === 0) return;
              tables.forEach((table) => {
                const parent = table.parentElement;
                if (parent && !parent.classList.contains('table-wrapper')) {
                  const wrapper = document.createElement('div');
                  wrapper.className = 'table-wrapper';
                  parent.insertBefore(wrapper, table);
                  wrapper.appendChild(table);
                }
              });
            }

            function initEnhancements() {
              initMermaid();
              enhanceTables();
            }

            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', initEnhancements);
            } else {
              initEnhancements();
            }
          `,
        },
      ],
      sidebar: [
        { label: 'Beranda', slug: 'index' },
        {
          label: 'Panduan Sesi Praktik',
          items: [
            { label: 'Sesi 1: Setup Tools & Git', slug: 'sesi-1' },
            { label: 'Sesi 2: Gateway & Setup Wizard', slug: 'sesi-2' },
            { label: 'Sesi 3: Stacking Cards & DataStore', slug: 'sesi-3' },
            { label: 'Sesi 4: Material 3 & Contributors', slug: 'sesi-4' },
            { label: 'Sesi 5: Remote API, Coil & R8', slug: 'sesi-5' },
          ],
        },
      ],
      components: {
        Hero: './src/components/Hero.astro',
        SiteTitle: './src/components/SiteTitle.astro',
        Footer: './src/components/Footer.astro',
      },
      customCss: [
        './src/styles/custom.css',
      ],
    }),
  ],
});
