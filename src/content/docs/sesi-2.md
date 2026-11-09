---
title: "Sesi 2: App Gateway & Setup Wizard (Thinking in Compose Basics)"
description: "Panduan koding hands-on Sesi 2: gerbang state navigasi di MainActivity, data dummy wallpaper, tombol interaktif wizard, dan perakitan kartu Stacking Card di LuminaWalls."
---

## Gambaran Umum Sesi 2

Selamat datang di materi koding **Sesi 2**!

Di sesi ini, kita mulai membangun antarmuka aplikasi **LuminaWalls** dari kanvas kosong (*blank canvas*). Fokus utama kita adalah memahami cara berpikir deklaratif di Jetpack Compose:
1. **App Gateway**: Menghubungkan titik masuk aplikasi di `MainActivity.kt` ke orkestrator navigasi `LuminaMainApp()`.
2. **Setup Onboarding Wizard**: Menyusun alur orientasi 3 langkah (Sambutan, Pilih Tema, dan Selesai) menggunakan animasi geser.
3. **Komponen Interaktif**: Membuat tombol dinamis wizard di `SetupComponents.kt` yang bisa berubah teks dan aksinya.
4. **Stacking Card**: Merakit kartu wallpaper berlapis (`WallpaperCard.kt`) menggunakan `Box`, gradasi hitam (*scrim*), dan teks judul.
5. **Kanvas Beranda**: Menampilkan 2 kartu wallpaper dummy perdana di `HomeScreen.kt`.

Seluruh kode yang kamu tulis di bawah ini dipasangkan langsung ke baris komentar `// TODO: [Session 2]` yang sudah tersedia di template proyek.


---

## Langkah 1: Hubungkan Gerbang Aplikasi di `MainActivity.kt`

Buka berkas `app/src/main/kotlin/com/gdgoc/luminawalls/MainActivity.kt`.

### 1. Tambahkan Import di Bagian Atas
Pastikan berkas mengimpor komponen orkestrator dan SplashScreen di baris import paling atas:

```kotlin
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import com.gdgoc.luminawalls.ui.LuminaMainApp
```

### 2. Ganti Konten Starter dengan Orkestrator
Gunakan `Ctrl + F` (atau `Cmd + F` di Mac) untuk mencari baris komentar berikut:

```kotlin
            // TODO: [Session 2] Hapus Greeting(), ganti dengan gerbang state isSetupCompleted (SetupScreen vs HomeScreen) di bawah sini:
```

Hapus blok `Surface { Greeting("Android") }` bawaan template di dalam `setContent`, lalu ganti dengan memanggil orkestrator aplikasi:

```kotlin
            LuminaMainApp()
```

Sehingga keseluruhan berkas `MainActivity.kt` menjadi bersih dan rapi seperti ini:

```kotlin
package com.gdgoc.luminawalls

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import com.gdgoc.luminawalls.ui.LuminaMainApp

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        val splashScreen = installSplashScreen()
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            // TODO: [Session 2] Hapus Greeting(), ganti dengan gerbang state isSetupCompleted (SetupScreen vs HomeScreen) di bawah sini:
            LuminaMainApp()
        }
    }
}
```

> `LuminaMainApp()` bertindak sebagai nahkoda utama aplikasi. Di dalamnya sudah disiapkan gerbang state: jika pengguna baru pertama kali membuka aplikasi, sistem otomatis menampilkan `SetupScreen`. Jika proses onboarding sudah pernah diselesaikan, aplikasi langsung mengarahkan pengguna ke halaman utama `HomeScreen`.

---

## Langkah 2: Isi Data Dummy Wallpaper di `WallpaperRepository.kt`

Buka berkas `app/src/main/kotlin/com/gdgoc/luminawalls/data/repository/WallpaperRepository.kt`.

Cari baris komentar berikut:

```kotlin
    // TODO: [Session 2] Inisialisasi daftar wallpaper dummy awal untuk kanvas Home Screen di bawah sini:
```

Tepat di bawah baris komentar tersebut, ubah deklarasi `private val initialWallpapers = emptyList<Wallpaper>()` menjadi:

```kotlin
    private val initialWallpapers = listOf(
        Wallpaper(
            id = "1",
            title = "lone",
            author = "Yanto",
            category = "Anu",
            tags = listOf("Cyber", "Minimalist"),
        ),
        Wallpaper(
            id = "2",
            title = "Sunset Bloom",
            author = "Ariya",
            category = "Nature",
            tags = listOf("Nature", "Sunset"),
        ),
    )
```

> Sebelum kita menghubungkan aplikasi ke REST API Cloudflare di Sesi 5, kita menyediakan dua data dummy lokal ini agar kanvas galeri tidak kosong dan kartu wallpaper bisa langsung kita uji coba di layar smartphone.
>
> **Catatan Import**: Berkas `WallpaperRepository.kt` pada langkah ini tidak memerlukan impor tambahan karena model `Wallpaper` sudah berada dalam package data yang sama.

---

## Langkah 3: Tambahkan Tombol Navigasi Wizard di `SetupComponents.kt`

Buka berkas `app/src/main/kotlin/com/gdgoc/luminawalls/ui/components/SetupComponents.kt`.

### 1. Tambahkan Import di Bagian Atas
Pastikan impor berikut sudah tersedia di bagian paling atas berkas:

```kotlin
import androidx.compose.foundation.layout.width
import androidx.compose.ui.res.stringResource
import com.gdgoc.luminawalls.R
```

### 2. Pasang Tombol Navigasi Dinamis
Cari baris komentar berikut di dalam fungsi `SetupBottomBar`:

```kotlin
            // TODO: [Session 2] Tulis Button navigasi wizard ("Lanjut" / "Mulai Jelajahi") di bawah sini:
```

Tempel kode tombol Material 3 berikut tepat di bawah komentar tersebut:

```kotlin
            Button(
                onClick = if (isLastPage) onFinishClicked else onNextClicked,
                enabled = isEnabled,
                shape = RoundedCornerShape(20.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = MaterialTheme.colorScheme.primary,
                    contentColor = MaterialTheme.colorScheme.onPrimary,
                ),
                modifier = Modifier.height(50.dp),
            ) {
                Text(
                    text = stringResource(if (isLastPage) R.string.action_get_started else R.string.action_next),
                    style = MaterialTheme.typography.labelLarge,
                    fontFamily = GoogleSansRounded,
                    fontWeight = FontWeight.Bold,
                )
                Spacer(modifier = Modifier.width(8.dp))
                Icon(
                    imageVector = if (isLastPage) Icons.Default.Check else Icons.AutoMirrored.Filled.ArrowForward,
                    contentDescription = null,
                    modifier = Modifier.size(18.dp),
                )
            }
```

> Tombol ini bersifat reaktif (*state-driven*): jika pengguna masih berada di halaman 1 atau 2, tombol menampilkan teks "Lanjut" dengan ikon panah. Namun ketika pengguna mencapai halaman terakhir, tombol otomatis berubah menjadi "Mulai Jelajahi" dengan ikon centang.

---

## Langkah 4: Lengkapi Alur Langkah di `SetupScreen.kt`

Buka berkas `app/src/main/kotlin/com/gdgoc/luminawalls/ui/setup/SetupScreen.kt`.

### 1. Tambahkan Import di Bagian Atas
Pastikan baris impor berikut sudah ada di bagian paling atas berkas:

```kotlin
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.ui.res.stringResource
import com.gdgoc.luminawalls.R
import com.gdgoc.luminawalls.ui.components.LuminaListItem
import com.gdgoc.luminawalls.ui.components.SetupBottomBar
import com.gdgoc.luminawalls.ui.components.SetupHeader
```

Di berkas ini terdapat empat slot TODO yang perlu kita isi secara berurutan:

### 2. Pasang Bottom Bar Wizard di `SetupScreen`
Cari komentar di dalam parameter `bottomBar = { ... }`:

```kotlin
            // TODO: [Session 2] Tulis SetupBottomBar untuk tombol navigasi wizard (Next / Finish) di bawah sini:
```

Tempel pemanggilan komponen bar bawah berikut tepat di bawahnya:

```kotlin
            SetupBottomBar(
                currentPage = step,
                pageCount = pageCount,
                onNextClicked = { if (step < pageCount - 1) step += 1 },
                onFinishClicked = onFinished,
                isNextButtonEnabled = true,
                isFinishButtonEnabled = true,
            )
```

### 3. Header Sambutan Langkah 1 di `WelcomeStep()`
Gulir ke fungsi `WelcomeStep()`, lalu cari komentar:

```kotlin
        // TODO: [Session 2] Tulis SetupHeader sambutan pembuka di bawah sini:
```

Tempel pemanggilan header pembuka berikut:

```kotlin
        SetupHeader(
            title = stringResource(R.string.setup_welcome_title),
            subtitle = stringResource(R.string.setup_welcome_subtitle),
        )
```

### 4. Header & Opsi Tema Langkah 2 di `PersonalizationStep()`
Gulir ke fungsi `PersonalizationStep()`, lalu cari komentar:

```kotlin
        // TODO: [Session 2] Tulis SetupHeader pemilihan tema di bawah sini:
```

Tempel header pemilihan tema:

```kotlin
        SetupHeader(
            title = stringResource(R.string.setup_theme_title),
            subtitle = stringResource(R.string.setup_theme_subtitle),
        )
```

Tepat di bawahnya pada fungsi yang sama, cari komentar:

```kotlin
        // TODO: [Session 2] Tulis opsi tema menggunakan Column & LuminaListItem di bawah sini:
```

Tempel daftar pilihan tema menggunakan `LuminaListItem`:

```kotlin
        Spacer(modifier = Modifier.height(28.dp))
        Column(
            modifier = Modifier.fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(10.dp),
        ) {
            themeOptions.forEach { option ->
                LuminaListItem(
                    title = stringResource(option.titleRes),
                    subtitle = stringResource(option.descriptionRes),
                    shape = RoundedCornerShape(22.dp),
                    onClick = { onThemeModeSelected(option.mode) },
                )
            }
        }
```

> **Catatan Tata Letak Tengah**:
> Kontainer `Column` pembungkus di `PersonalizationStep()` menggunakan `verticalArrangement = Arrangement.Center` dan `modifier = Modifier.fillMaxSize().padding(24.dp)` agar posisi judul dan kartu pilihan tema tersusun rapi pas di tengah layar, senada dengan slide `WelcomeStep()` dan `DoneStep()`.

### 5. Header Penutup Langkah 3 di `DoneStep()`
Gulir ke fungsi `DoneStep()`, lalu cari komentar:

```kotlin
        // TODO: [Session 2] Tulis SetupHeader penutup (selesai) di bawah sini:
```

Tempel header penutup berikut:

```kotlin
        SetupHeader(
            title = stringResource(R.string.setup_done_title),
            subtitle = stringResource(R.string.setup_done_subtitle),
        )
```

> Dengan mengisi keempat bagian ini, wizard onboarding kita kini berfungsi penuh dengan indikator titik halaman, tombol navigasi maju-mundur, dan animasi slide horizontal otomatis bawaan Compose.

---

## Langkah 5: Merakit Stacking Card di `WallpaperCard.kt`

Buka berkas `app/src/main/kotlin/com/gdgoc/luminawalls/ui/components/WallpaperCard.kt`.

### 1. Tambahkan Import di Bagian Atas
Pastikan baris impor berikut sudah tersedia di bagian paling atas berkas:

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Alignment
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
```

### 2. Rakit Stacking Card Berlapis
Cari baris komentar berikut di dalam fungsi `WallpaperCard`:

```kotlin
    // TODO: [Session 2] Tulis Stacking Card dasar menggunakan Box, Gradient Scrim, dan Text di bawah sini:
```

Tempel implementasi kartu berlapis (*Stacking Card*) berikut tepat di bawahnya:

```kotlin
    Surface(
        shape = RoundedCornerShape(24.dp),
        color = MaterialTheme.colorScheme.surfaceContainerLow,
        modifier = modifier
            .fillMaxWidth()
            .aspectRatio(0.72f)
            .bouncyClickable(onClick = { onWallpaperClick(wallpaper) }),
    ) {
        Box(modifier = Modifier.fillMaxSize()) {
            // Layer 1: Wadah gambar / placeholder
            NetworkImage(
                url = wallpaper.imageUrl,
                contentDescription = wallpaper.title,
                modifier = Modifier.fillMaxSize(),
            )

            // Layer 2: Gradient Scrim hitam tipis agar teks selalu terbaca kontras
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(
                        Brush.verticalGradient(
                            colors = listOf(
                                Color.Transparent,
                                Color.Black.copy(alpha = 0.75f),
                            ),
                            startY = 300f,
                        )
                    )
            )

            // Layer 3: Informasi teks judul & author di pojok kiri bawah
            Column(
                modifier = Modifier
                    .align(Alignment.BottomStart)
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(4.dp),
            ) {
                Text(
                    text = wallpaper.title,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = Color.White,
                )
                Text(
                    text = "By ${wallpaper.author}",
                    style = MaterialTheme.typography.labelSmall,
                    color = Color.White.copy(alpha = 0.8f),
                )
            }
        }
    }
```

> **Prinsip Desain Stacking Card**:
> Menggunakan kontainer `Box`, kita menyusun elemen secara berlapis (z-axis):
> - **Lapisan Bawah**: Gambar wallpaper melalui `NetworkImage`.
> - **Lapisan Tengah**: Gradasi hitam vertikal (*scrim*) dari transparan ke hitam semi-transparan.
> - **Lapisan Atas**: Teks judul dan nama author berwarna putih.
> Gradasi hitam (*scrim*) adalah teknik standar Material Design agar teks putih selalu terbaca tajam dan tidak tenggelam pada wallpaper yang memiliki latar belakang terang.

---

## Langkah 6: Tampilkan Kartu Perdana di `HomeScreen.kt`

Buka berkas `app/src/main/kotlin/com/gdgoc/luminawalls/ui/screens/home/HomeScreen.kt`.

### 1. Tambahkan Import di Bagian Atas
Pastikan baris impor berikut sudah tersedia di bagian paling atas berkas:

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.ui.unit.dp
import com.gdgoc.luminawalls.ui.components.WallpaperCard
```

### 2. Tampilkan Kartu Berdampingan
Cari baris komentar berikut:

```kotlin
        // TODO: [Session 2] Tampilkan Stacking Card awal (WallpaperCard) di bawah sini:
```

Tempel kode penampil kartu berikut tepat di bawah komentar tersebut:

```kotlin
        if (wallpapers.isNotEmpty()) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 14.dp, vertical = 14.dp),
                horizontalArrangement = Arrangement.spacedBy(10.dp),
            ) {
                wallpapers.take(2).forEach { wallpaper ->
                    WallpaperCard(
                        wallpaper = wallpaper,
                        onWallpaperClick = onWallpaperClick,
                        modifier = Modifier.weight(1f),
                    )
                }
            }
        }
```

> Di Sesi 2 ini, kita menggunakan tata letak horizontal `Row` sederhana untuk menampilkan dua kartu pertama secara berdampingan. Modifier `weight(1f)` memastikan kedua kartu membagi lebar layar secara proporsional dan seimbang.

---

## Uji Coba Jalankan di HP Fisik

1. Hubungkan smartphone Android kamu ke laptop.
2. Klik tombol hijau **Run 'app'** atau tekan shortcut `Shift + F10` di Android Studio.
3. **Uji Coba Alur Wizard**:
   - Di Langkah 1, baca teks sambutan lalu klik tombol **Lanjut**.
   - Di Langkah 2, pilih salah satu opsi tema (Sistem, Gelap, atau Terang) lalu klik **Lanjut**.
   - Di Langkah 3, klik tombol **Mulai Jelajahi**.
4. Perhatikan layar aplikasi: setelah onboarding selesai, aplikasi langsung membuka halaman **Home Screen** dan menampilkan dua kartu wallpaper dummy perdana (*Cyber Horizon* dan *Sunset Bloom*) dengan sudut membulat dan teks yang kontras.

---

## Simpan Checkpoint Sesi 2 ke Git

Buka tab Terminal di Android Studio, lalu jalankan perintah berikut untuk mengunci checkpoint Sesi 2:

```bash
git status
git add .
git commit -m "feat(sesi-2): implement setup wizard, app gateway, and initial stacking cards"
git push origin main
```

Selamat! Kamu sudah berhasil merakit alur onboarding interaktif dan kartu wallpaper perdana. Di **Sesi 3**, kita akan mengubah galeri ini menjadi Grid 2 kolom dinamis dan menyimpan preferensi tema ke memori permanen menggunakan **DataStore Preferences**!
