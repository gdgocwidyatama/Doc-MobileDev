---
title: "Sesi 4: Material 3 Design: Tokens, Component Reuse & Contributors Screen"
description: "Panduan koding hands-on Sesi 4: implementasi chip WallpaperTag, tombol navigasi kembali Material 3 seragam, navigasi ke PreviewScreen, dan integrasi REST API GitHub di ContributorsScreen."
---

## Gambaran Umum Sesi 4

Selamat datang di materi koding **Sesi 4**!

Di sesi ini, kita akan menerapkan prinsip-prinsip desain modern **Material 3 Expressive** dan menyambungkan data eksternal:
1. **Material Design Tokens & Reusability**: Memahami sistem warna semantik dan memecah antarmuka menjadi komponen modular yang bisa digunakan kembali (*reusable components*).
2. **Chip Kategori `WallpaperTag`**: Menambahkan label kategori semi-transparan di atas kartu wallpaper.
3. **Standarisasi Navigasi Kembali**: Menggunakan tombol bulat `FilledIconButton` yang seragam di seluruh sub-layar.
4. **Alur Pratinjau Wallpaper**: Mengaktifkan navigasi dari kartu beranda menuju layar pratinjau penuh (`PreviewScreen`).
5. **Integrasi REST API GitHub**: Menarik data kontributor proyek secara live langsung dari API resmi GitHub dan merendernya di `ContributorsScreen`.

Seluruh kode yang kamu tulis di bawah ini dipasangkan langsung ke baris komentar `// TODO: [Session 4]` pada template proyek.

---

## Langkah 1: Tambahkan Chip Tag Kategori di `WallpaperCard.kt`

Buka berkas `app/src/main/kotlin/com/gdgoc/luminawalls/ui/components/WallpaperCard.kt`.

Gunakan `Ctrl + F` (atau `Cmd + F` di Mac) untuk mencari baris komentar berikut:

```kotlin
    // TODO: [Session 4] Tulis komponen chip label / tag menggunakan Surface & Text di bawah sini:
```

Tepat di bawah baris komentar tersebut, tambahkan fungsi composable pembantu `WallpaperTag`:

```kotlin
    @Composable
    fun WallpaperTag(
        text: String,
        modifier: Modifier = Modifier,
    ) {
        Surface(
            shape = RoundedCornerShape(8.dp),
            color = Color.Black.copy(alpha = 0.45f),
            modifier = modifier,
        ) {
            Text(
                text = text,
                style = MaterialTheme.typography.labelSmall,
                fontWeight = FontWeight.Medium,
                color = Color.White.copy(alpha = 0.9f),
                modifier = Modifier.padding(horizontal = 7.dp, vertical = 2.dp),
            )
        }
    }
```

Sekarang panggil komponen `WallpaperTag` tersebut di dalam `WallpaperCard`: tepat di bawah baris teks `Text(text = "By ${wallpaper.author}", ...)`, tambahkan blok baris chip berikut:

```kotlin
                if (wallpaper.tags.isNotEmpty()) {
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(4.dp),
                        modifier = Modifier.padding(top = 2.dp),
                    ) {
                        wallpaper.tags.take(2).forEach { tag ->
                            WallpaperTag(text = tag)
                        }
                    }
                }
```

> `WallpaperTag` membungkus teks kategori dengan `Surface` semi-transparan warna gelap (`alpha = 0.45f`). Ini memberikan aksen visual modern khas Material 3 tanpa menutupi detail foto wallpaper di baliknya.

---

## Langkah 2: Seragamkan Tombol Kembali di Sub-Layar

Untuk menciptakan pengalaman navigasi yang konsisten, kita menggunakan tombol bulat Material 3 (`FilledIconButton`) dengan ikon `ArrowBack` di layar Pratinjau dan Pengaturan.

### 1. Pasang di `PreviewScreen.kt`
Buka berkas `app/src/main/kotlin/com/gdgoc/luminawalls/ui/screens/preview/PreviewScreen.kt`.

Cari baris komentar berikut:

```kotlin
            // TODO: [Session 4] Tulis FilledIconButton kembali (onBackClick) di bawah sini:
```

Tempel komponen tombol kembali berikut tepat di bawahnya:

```kotlin
            FilledIconButton(
                onClick = onBackClick,
                shape = CircleShape,
                colors = IconButtonDefaults.filledIconButtonColors(
                    containerColor = MaterialTheme.colorScheme.surfaceContainerHigh,
                    contentColor = MaterialTheme.colorScheme.onSurface,
                ),
                modifier = Modifier.size(42.dp),
            ) {
                Icon(
                    imageVector = Icons.AutoMirrored.Rounded.ArrowBack,
                    contentDescription = stringResource(R.string.action_back),
                    modifier = Modifier.size(20.dp),
                )
            }
```

### 2. Pasang di `SettingsScreen.kt`
Buka berkas `app/src/main/kotlin/com/gdgoc/luminawalls/ui/screens/settings/SettingsScreen.kt`.

Cari baris komentar yang sama pada parameter `leadingAction`:

```kotlin
            // TODO: [Session 4] Tulis FilledIconButton kembali (onBackClick) di bawah sini:
```

Tempel tombol kembali yang sama persis seperti di atas.

> Menggunakan `Icons.AutoMirrored.Rounded.ArrowBack` menjamin ikon panah otomatis membalik arah secara benar jika aplikasi dijalankan pada perangkat dengan bahasa RTL (*Right-to-Left* seperti bahasa Arab).

---

## Langkah 3: Buka Layar Pratinjau di `LuminaMainApp.kt`

Buka berkas `app/src/main/kotlin/com/gdgoc/luminawalls/ui/LuminaMainApp.kt`.

Cari baris komentar berikut di dalam blok `onWallpaperClick = { wall -> ... }`:

```kotlin
                                            // TODO: [Session 4] Navigasikan ke PreviewScreen (AppScreen.Preview(wall)) di bawah sini:
```

Tempel satu baris navigasi berikut:

```kotlin
                                            activeScreen = AppScreen.Preview(wall)
```

> Baris ini mengubah state aktif aplikasi menjadi `AppScreen.Preview(wallpaper)`. Orkestrator `AnimatedContent` yang ada di `LuminaMainApp` otomatis memicu animasi geser horizontal dari kanan ke kiri untuk membuka tampilan pratinjau wallpaper.

---

## Langkah 4: Hubungkan REST API GitHub di `ContributorRepository.kt`

Buka berkas `app/src/main/kotlin/com/gdgoc/luminawalls/data/repository/ContributorRepository.kt`.

Kita akan melengkapi dua slot pada repositori ini:

### 1. Tentukan URL Repositori Proyek
Cari baris komentar berikut:

```kotlin
    // TODO: [Session 4] Masukkan URL repositori GitHub LuminaWalls kamu di bawah sini:
```

Pastikan konstanta URL repositori mengarah ke repositori proyek:

```kotlin
    const val DEFAULT_REPO_URL = "https://github.com/gdgocwidyatama/MobileDev"
```

### 2. Eksekusi REST API Publik GitHub
Cari baris komentar berikut di dalam fungsi `fetchFromGitHub`:

```kotlin
            // TODO: [Session 4] Eksekusi REST API GitHub untuk mengambil daftar kontributor di bawah sini:
```

Hapus baris `emptyList()` bawaan di bawahnya, lalu gantikan dengan logika koneksi HTTP dan pembacaan JSON berikut:

```kotlin
            try {
                val apiUrl = resolveApiUrl(targetUrlOrRepo)
                val connection = (URL(apiUrl).openConnection() as HttpURLConnection).apply {
                    requestMethod = "GET"
                    setRequestProperty("Accept", "application/vnd.github.v3+json")
                    setRequestProperty("User-Agent", "LuminaWalls-Android")
                    connectTimeout = 8000
                    readTimeout = 8000
                }

                if (connection.responseCode == HttpURLConnection.HTTP_OK) {
                    val jsonText = connection.inputStream.bufferedReader().use { it.readText() }
                    val array = JSONArray(jsonText)
                    val list = mutableListOf<Contributor>()
                    for (i in 0 until array.length()) {
                        val item = array.getJSONObject(i)
                        val login = item.optString("login")
                        if (login.isBlank() || login.contains("[bot]")) continue
                        list.add(
                            Contributor(
                                name = login,
                                role = "Open Source Contributor",
                                github = item.optString("html_url", "https://github.com/$login"),
                                bio = "Contributor to LuminaWalls",
                                avatarLetter = login.take(1).uppercase(),
                                avatarUrl = item.optString("avatar_url", "https://github.com/$login.png"),
                            )
                        )
                    }
                    if (list.isNotEmpty()) list else initialContributors
                } else {
                    initialContributors
                }
            } catch (_: Exception) {
                initialContributors
            }
```

> Fungsi ini menggunakan pustaka standar Android `HttpURLConnection` untuk meminta data dari endpoint resmi GitHub (`/repos/{owner}/{repo}/contributors`). Jika perangkat sedang offline atau kehabisan kuota, blok `catch` otomatis mengembalikan data awal `initialContributors` sehingga aplikasi tidak mengalami force close.

---

## Langkah 5: Bangun Tampilan Layar di `ContributorsScreen.kt`

Buka berkas `app/src/main/kotlin/com/gdgoc/luminawalls/ui/screens/contributors/ContributorsScreen.kt`.

Kita akan melengkapi tata letak konten dan daftar kontributor:

### 1. Pasang Blok Konten Utama
Cari baris komentar berikut di dalam `LazyColumn`:

```kotlin
            // TODO: [Session 4] Buat LuminaHeroCard, GdgocTeamBlock, dan ContributorsBlock di bawah sini:
```

Tempel susunan kartu informasi dan blok tim berikut:

```kotlin
            item {
                LuminaHeroCard()
            }
            item {
                Spacer(modifier = Modifier.height(20.dp))
                GdgocTeamBlock()
            }
            item {
                Spacer(modifier = Modifier.height(24.dp))
                ContributorsBlock(
                    contributors = contributors,
                    onOpenGithub = { url ->
                        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                        context.startActivity(intent)
                    },
                )
            }
```

### 2. Tampilkan Daftar Kartu Kontributor
Gulir ke bawah ke fungsi `ContributorsBlock`, lalu cari komentar:

```kotlin
    // TODO: [Session 4] Tampilkan daftar kontributor menggunakan Column, LuminaListItem, dan avatar foto di bawah sini:
```

Tempel perulangan daftar kontributor menggunakan komponen `LuminaListItem`:

```kotlin
    Column(
        modifier = Modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(2.dp),
    ) {
        contributors.forEachIndexed { index, contributor ->
            val contributorBadge = if (index < 3) "#${index + 1}" else null
            val avatarUrl = contributor.avatarUrl ?: "https://github.com/${contributor.name}.png"
            LuminaListItem(
                title = contributor.name,
                subtitle = contributor.bio,
                shape = itemShapeFor(index, contributors.size),
                trailingBadgeText = contributorBadge,
                onClick = { onOpenGithub(contributor.github) },
                leadingContent = {
                    Surface(
                        shape = CircleShape,
                        color = MaterialTheme.colorScheme.primaryContainer,
                        modifier = Modifier.size(44.dp),
                    ) {
                        NetworkImage(
                            url = avatarUrl,
                            contentDescription = contributor.name,
                            modifier = Modifier
                                .fillMaxSize()
                                .clip(CircleShape),
                        )
                    }
                },
            )
        }
    }
```

> Komponen `LuminaListItem` secara cerdas menampilkan foto avatar GitHub kontributor di sisi kiri, username dan bio di tengah, serta badge peringkat kontributor (`#1`, `#2`, `#3`) di sisi kanan. Ketika baris kontributor diketuk, intent implicit `Intent.ACTION_VIEW` langsung membuka halaman profil GitHub kontributor di aplikasi browser.

---

## Uji Coba Jalankan di HP Fisik

1. Hubungkan smartphone ke laptop dan klik **Run 'app'** (`Shift + F10`).
2. **Uji Coba Chip Tag & Navigasi Preview**:
   - Perhatikan kartu wallpaper di Home Screen kini memiliki label chip kategori (seperti `Cyber` atau `Nature`) di sudut kiri bawah.
   - Ketuk salah satu kartu wallpaper: amati aplikasi berpindah mulus ke halaman **PreviewScreen**.
   - Ketuk tombol back bundar di pojok kiri atas untuk kembali ke Beranda.
3. **Uji Coba Layar Contributors**:
   - Ketuk tab **Contributors** di bar navigasi bawah.
   - Perhatikan daftar kontributor proyek LuminaWalls termuat secara langsung dari REST API GitHub lengkap dengan foto profil masing-masing.
   - Ketuk salah satu nama kontributor untuk membuktikan browser otomatis membuka halaman GitHub mereka.

---

## Simpan Checkpoint Sesi 4 ke Git

Buka tab Terminal di Android Studio, lalu jalankan:

```bash
git status
git add .
git commit -m "feat(sesi-4): implement wallpaper tags, back navigation, and github contributors screen"
git push origin main
```

Langkahmu tinggal satu sesi lagi! Di **Sesi 5 (Capstone Showcase)**, kita akan menarik ratusan katalog wallpaper online dari Cloudflare Worker, memasang image loader Coil, mengaktifkan fitur pasang wallpaper native ke sistem Android, dan mengoptimasi berkas APK dengan R8!
