<p align="center">
  <img src="https://img.shields.io/badge/Astro-7.x-BC52EE?style=for-the-badge&logo=astro&logoColor=white" alt="Astro">
  <img src="https://img.shields.io/badge/Starlight-0.41-FF5D01?style=for-the-badge&logo=astro&logoColor=white" alt="Starlight">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Bun-FCD34D?style=for-the-badge&logo=bun&logoColor=black" alt="Bun">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Cloudflare_Pages-F38020?style=for-the-badge&logo=cloudflarepages&logoColor=white" alt="Cloudflare Pages">
  <a href="https://doc-mobiledev.pages.dev/llms.txt"><img src="https://img.shields.io/badge/llms.txt-Standard-8A2BE2?style=for-the-badge" alt="llms.txt"></a>
  <a href="https://github.com/gdgocwidyatama/MobileDev"><img src="https://img.shields.io/badge/MobileDev-Starter%20Template-4285F4?style=for-the-badge&logo=github&logoColor=white" alt="Starter Template"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-GPL--3.0-blue?style=for-the-badge" alt="License"></a>
</p>

# Doc-MobileDev

Portal dokumentasi teknis dan panduan koding hands-on resmi untuk peserta **Google Developer Groups (GDG) On Campus Widyatama University** — Study Jam Mobile Development: Android Jetpack Compose (*LuminaWalls App*).

Live site: [doc-mobiledev.pages.dev](https://doc-mobiledev.pages.dev/)

---

## Modul Panduan Peserta (5 Sesi)

| Sesi | Topik Pertemuan | Fokus Hands-on Peserta |
|---|---|---|
| [**Sesi 1**](src/content/docs/sesi-1.md) | Environment Setup, First App Launch & Git on GitHub | Colok HP fisik (`enableEdgeToEdge`), pasang Splash API (`core-splashscreen`), dan push commit pertama ke GitHub fork pribadi. |
| [**Sesi 2**](src/content/docs/sesi-2.md) | App Gateway & Setup Wizard — Thinking in Compose Basics | Koding dari kanvas kosong (*true blank canvas*), Setup Wizard 3 langkah, gerbang navigasi state `isSetupCompleted`, dan Stacking Card perdana. |
| [**Sesi 3**](src/content/docs/sesi-3.md) | Stacking Cards, Settings Theme Switcher & Floating Nav Bar | Katalog galeri 2 kolom `LazyVerticalGrid`, persistensi DataStore Preferences, Monet Theme Switcher 3 mode (Dark/Light/System), dan `FloatingNavBar`. |
| [**Sesi 4**](src/content/docs/sesi-4.md) | Material 3 Design — Tokens, Component Reuse & Contributors Screen | Design Tokens M3 semantik, chip label reusable `WallpaperTag`, tombol navigasi Back adaptif, dan konsumsi REST API GitHub kontributor. |
| [**Sesi 5**](src/content/docs/sesi-5.md) | Capstone Showcase — Remote API, Coil, Native WallpaperManager, R8 & Submission | LuminaWalls Full App: remote API Cloudflare Worker, asinkron caching Coil, pasang wallpaper native via BottomSheet, rilis APK R8, dan pengumpulan Capstone. |

---

## Quick Start

### Prerequisites

- [Bun](https://bun.sh) (v1.1 atau lebih baru) / Node.js (v18+)

### Installation

```bash
# Clone repositori
git clone https://github.com/gdgocwidyatama/Doc-MobileDev.git
cd Doc-MobileDev

# Pasang dependensi
bun install
```

### Local Development

```bash
bun run dev
```

Server lokal akan berjalan di `http://localhost:3000`.

### Production Build

```bash
bun run build
```

Menghasilkan HTML statis teroptimasi di dalam direktori `dist/`.

### Preview Production Build

```bash
bun run preview
```

### Deploy ke Cloudflare Pages

```bash
bun run deploy
```

---

## AI Agent & LLM Integration (llms.txt)

Dokumentasi ini mendukung standar **[llms.txt](https://llmstxt.org/)** agar peserta yang menggunakan AI coding assistant (Cursor, Claude Code, GitHub Copilot, Windsurf, dll.) dapat langsung menyuplai konteks resmi modul:

- **Index Entrypoint**: [`https://doc-mobiledev.pages.dev/llms.txt`](https://doc-mobiledev.pages.dev/llms.txt)
- **Ringkas / Compact**: [`https://doc-mobiledev.pages.dev/llms-small.txt`](https://doc-mobiledev.pages.dev/llms-small.txt)
- **Koleksi Lengkap**: [`https://doc-mobiledev.pages.dev/llms-full.txt`](https://doc-mobiledev.pages.dev/llms-full.txt)

---

## License

Proyek ini dilisensikan di bawah lisensi [GNU General Public License v3.0 (GPL-3.0)](LICENSE).
