---
title: "Sesi 5: Capstone Showcase: Remote API, Coil, Native WallpaperManager, R8 & Final Project Submission"
description: "Panduan koding hands-on Sesi 5: remote API Cloudflare Workers, pemuatan gambar asinkron Coil, pasang wallpaper sistem native via WallpaperManager, optimasi rilis R8, dan pengumpulan Capstone."
---

## Gambaran Umum Sesi 5

Selamat datang di sesi puncak: **Sesi 5 (Capstone Showcase)**!

Di pertemuan penutup ini, kita akan menyatukan seluruh komponen yang telah kita pelajari dari Sesi 1 sampai Sesi 4 menjadi aplikasi Android utuh yang siap pakai dan siap dipamerkan di portofolio kamu:
1. **Networking & Image Loading**: Memasang library industri **OkHttp** dan **Coil** untuk memuat data dan gambar secara asinkron.
2. **Izin Sistem Android**: Mendaftarkan izin `INTERNET` dan `SET_WALLPAPER` pada berkas `AndroidManifest.xml`.
3. **Remote API Integration**: Menghubungkan aplikasi ke REST API Cloudflare Workers untuk menarik katalog wallpaper resolusi tinggi secara online.
4. **Coil SubcomposeAsyncImage**: Menggantikan kotak placeholder statis dengan pemuat gambar dinamis yang dilengkapi memori dan disk caching.
5. **Native WallpaperManager**: Mengintegrasikan API native Android untuk mengubah wallpaper smartphone secara nyata langsung dari aplikasi.
6. **Optimasi Rilis Produksi R8**: Mengaktifkan *code shrinking* dan *resource shrinking* untuk menghasilkan berkas APK rilis yang ringan dan terproteksi.
7. **Pengumpulan Proyek Capstone**: Memublikasikan hasil karya ke GitHub dan mengumpulkannya ke portal submisi GDGoC.

Semua langkah di bawah merujuk langsung pada baris komentar `// TODO: [Session 5]` pada template proyekmu.

---

## Langkah 1: Pasang Dependensi OkHttp & Coil di `app/build.gradle.kts`

Buka berkas `app/build.gradle.kts`.

Gunakan `Ctrl + F` (atau `Cmd + F` di Mac) untuk mencari baris komentar berikut:

```kotlin
    // TODO: [Session 5] Tambahkan Networking (OkHttp) & Image Loading (Coil) di bawah sini:
```

Tempel dua baris dependensi berikut tepat di bawah komentar tersebut:

```kotlin
    implementation(libs.okhttp)
    implementation(libs.coil.compose)
```

Setelah itu, klik tombol **Sync Now** di sudut kanan atas editor Android Studio dan tunggu hingga Gradle menyelesaikan sinkronisasi.

> `OkHttp` adalah HTTP client cepat dan efisien standar industri Android. `Coil` (*Coroutine Image Loader*) adalah pustaka resmi berbasis Kotlin Coroutines yang dirancang khusus untuk Jetpack Compose, mengelola proses pengunduhan gambar di background thread dan caching otomatis tanpa membebani memori smartphone.

---

## Langkah 2: Pastikan Izin Akses di `app/src/main/AndroidManifest.xml`

Buka berkas `app/src/main/AndroidManifest.xml`.

Cari baris komentar berikut di bagian atas berkas (tepat di atas tag `<application>`):

```xml
    <!-- TODO: [Session 5] Capstone Showcase — Permissions untuk akses API & pasang wallpaper -->
```

Pastikan kedua izin sistem berikut sudah terpasang:

```xml
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.SET_WALLPAPER" />
```

> - `android.permission.INTERNET`: Memberikan hak bagi aplikasi untuk berkomunikasi dengan server Cloudflare Workers dan mengunduh berkas gambar wallpaper.
> - `android.permission.SET_WALLPAPER`: Izin wajib sistem Android agar aplikasi diperbolehkan mengubah gambar wallpaper pada perangkat pengguna.

---

## Langkah 3: Sambungkan REST API Cloudflare di `WallpaperRepository.kt`

Buka berkas `app/src/main/kotlin/com/gdgoc/luminawalls/data/repository/WallpaperRepository.kt`.

Kita akan melengkapi tiga bagian untuk mengaktifkan pengambilan data dari server Cloudflare:

### 1. Panggil `loadWallpapers()` saat Aplikasi Menyala
Cari komentar di dalam blok `init { ... }`:

```kotlin
        // TODO: [Session 5] Panggil loadWallpapers() saat menghubungkan API Cloudflare Worker di bawah sini:
```

Tempel pemanggilan fungsi pemuatan data berikut:

```kotlin
        loadWallpapers()
```

### 2. Eksekusi HTTP Request ke Cloudflare Workers
Cari baris komentar berikut di dalam fungsi `fetchWallpapersFromApi`:

```kotlin
        // TODO: [Session 5] Eksekusi HTTP request ke BASE_URL via OkHttp dan deserialisasi JSON array ke List<Wallpaper> di bawah sini:
```

Hapus baris `emptyList()` di bawahnya, lalu gantikan dengan logika koneksi jaringan berikut:

```kotlin
        try {
            val urlString = if (category.isNullOrBlank() || category == "all") {
                "$BASE_URL/wallpapers"
            } else {
                "$BASE_URL/wallpapers?category=$category"
            }

            val jsonStr = try {
                val conn = java.net.URL(urlString).openConnection() as javax.net.ssl.HttpsURLConnection
                conn.sslSocketFactory = trustAllSslContext.socketFactory
                conn.hostnameVerifier = javax.net.ssl.HostnameVerifier { _, _ -> true }
                conn.setRequestProperty("User-Agent", "Mozilla/5.0 (Android; Mobile)")
                conn.setRequestProperty("Accept", "application/json")
                conn.connectTimeout = 8000
                conn.readTimeout = 8000
                if (conn.responseCode == java.net.HttpURLConnection.HTTP_OK) {
                    conn.inputStream.bufferedReader().use { it.readText() }
                } else {
                    ""
                }
            } catch (e: Exception) {
                ""
            }

            if (jsonStr.isNotBlank()) {
                parseWallpapersJson(jsonStr)
            } else {
                initialWallpapers
            }
        } catch (_: Exception) {
            initialWallpapers
        }
```

### 3. Perbarui Nilai State Wallpaper
Gulir ke fungsi `loadWallpapers(category: String? = null)`, lalu cari komentar:

```kotlin
            // TODO: [Session 5] Panggil fetchWallpapersFromApi() dan perbarui _wallpapers.value di bawah sini:
```

Tempel dua baris pembaruan state berikut:

```kotlin
            val result = fetchWallpapersFromApi(category)
            _wallpapers.value = result.ifEmpty { initialWallpapers }
```

> Alur ini mengimplementasikan pola **Offline-First Resilience**: jika smartphone terhubung ke internet, aplikasi akan menampilkan katalog terbaru dari Cloudflare Workers. Namun jika terjadi gangguan koneksi atau server lambat, aplikasi otomatis menampilkan data dummy cadangan sehingga pengguna tidak melihat layar kosong.

---

## Langkah 4: Pasang Image Loader Coil di `NetworkImage.kt`

Buka berkas `app/src/main/kotlin/com/gdgoc/luminawalls/ui/components/NetworkImage.kt`.

Pastikan impor Coil berikut sudah tersedia di bagian atas:

```kotlin
import androidx.compose.ui.platform.LocalContext
import coil.compose.SubcomposeAsyncImage
import coil.request.ImageRequest
import com.gdgoc.luminawalls.data.image.ImageCacheManager
```

Cari baris komentar berikut di dalam fungsi `NetworkImage`:

```kotlin
    // TODO: [Session 5] Pasang Coil SubcomposeAsyncImage setelah menambahkan dependensi coil-compose di bawah sini:
```

Hapus blok `Box` placeholder statis bawaan template di bawah komentar tersebut, lalu gantikan dengan komponen `SubcomposeAsyncImage` bawaan Coil:

```kotlin
    val context = LocalContext.current
    val imageLoader = ImageCacheManager.getImageLoader(context)

    SubcomposeAsyncImage(
        model = ImageRequest.Builder(context)
            .data(url)
            .crossfade(300)
            .build(),
        imageLoader = imageLoader,
        contentDescription = contentDescription,
        contentScale = contentScale,
        loading = {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(MaterialTheme.colorScheme.surfaceContainerHigh),
            )
        },
        error = {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(MaterialTheme.colorScheme.surfaceContainerHigh),
            )
        },
        modifier = modifier,
    )
```

> Parameter `.crossfade(300)` memberikan animasi transisi memudar yang halus selama 300 milidetik saat gambar selesai diunduh dari internet, mencegah efek visual berkedip (*flicker*) saat pengguna melakukan scroll cepat pada galeri.

---

## Langkah 5: Pasang Wallpaper Native di `PreviewScreen.kt`

Buka berkas `app/src/main/kotlin/com/gdgoc/luminawalls/ui/screens/preview/PreviewScreen.kt`.

Pastikan impor berikut sudah ada di bagian atas:

```kotlin
import android.app.WallpaperManager
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Check
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.sp
import com.gdgoc.luminawalls.R
```

Kita akan melengkapi tombol pemicu dan eksekusi penggantian wallpaper sistem:

### 1. Tombol "Terapkan Wallpaper"
Cari baris komentar berikut:

```kotlin
            // TODO: [Session 5] Tulis komponen Button untuk memicu BottomSheet apply wallpaper di bawah sini:
```

Tempel komponen tombol Material 3 berikut:

```kotlin
            Button(
                onClick = {
                    haptic.performHapticFeedback(androidx.compose.ui.hapticfeedback.HapticFeedbackType.LongPress)
                    showBottomSheet = true
                },
                enabled = !isApplying,
                shape = RoundedCornerShape(27.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = MaterialTheme.colorScheme.primary,
                    contentColor = MaterialTheme.colorScheme.onPrimary,
                ),
                contentPadding = PaddingValues(horizontal = 24.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(54.dp),
            ) {
                if (isApplying) {
                    CircularProgressIndicator(
                        color = MaterialTheme.colorScheme.onPrimary,
                        modifier = Modifier.size(20.dp),
                        strokeWidth = 2.5.dp,
                    )
                } else {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.Center,
                    ) {
                        Icon(
                            imageVector = Icons.Rounded.Check,
                            contentDescription = null,
                            modifier = Modifier.size(20.dp),
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = stringResource(R.string.action_apply),
                            fontFamily = GoogleSansRounded,
                            fontWeight = FontWeight.Bold,
                            fontSize = 16.sp,
                        )
                    }
                }
            }
```

### 2. Eksekusi Native Android `WallpaperManager`
Gulir ke bawah pada fungsi coroutine penggantian wallpaper, lalu cari baris komentar:

```kotlin
                            // TODO: [Session 5] Tulis eksekusi WallpaperManager untuk mengubah wallpaper perangkat di bawah sini:
```

Tempel dua baris pemanggilan API sistem Android berikut tepat di bawahnya:

```kotlin
                            val wm = WallpaperManager.getInstance(appContext)
                            wm.setBitmap(bitmap, null, true, flag)
```

> **Bagaimana Cara Kerjanya?**
> Saat tombol "Terapkan Wallpaper" diklik, aplikasi memunculkan dialog BottomSheet dengan 3 opsi:
> - **Layar Utama (Home Screen)**: `WallpaperManager.FLAG_SYSTEM`
> - **Layar Kunci (Lock Screen)**: `WallpaperManager.FLAG_LOCK`
> - **Kedua Layar**: `WallpaperManager.FLAG_SYSTEM or WallpaperManager.FLAG_LOCK`
> Begitu pengguna memilih salah satu opsi, `WallpaperManager.getInstance()` langsung menulis bitmap gambar beresolusi penuh ke sistem operasi Android secara instan.

---

## Langkah 6: Aktifkan Optimasi R8 / ProGuard di `app/build.gradle.kts`

Buka berkas `app/build.gradle.kts`.

Cari baris komentar berikut pada blok `buildTypes`:

```kotlin
        // TODO: [Session 5] Aktifkan optimasi R8 pada mode Release saat belajar rilis produksi
```

Ubah nilai atribut `isMinifyEnabled` dan `isShrinkResources` pada blok `release` menjadi `true`:

```kotlin
        release {
            isMinifyEnabled = true
            isShrinkResources = true

            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
```

Sekarang kita coba kompilasi berkas APK rilis produksi menggunakan Terminal di Android Studio:

```bash
./gradlew assembleRelease
```

Setelah proses kompilasi sukses, berkas APK rilis final kamu akan berada di folder:

```text
app/build/outputs/apk/release/app-release-unsigned.apk
```

> **Keuntungan Optimasi R8:**
> - **Code Shrinking**: Memindai seluruh kode dan menghapus ribuan class atau method library eksternal yang tidak pernah dipanggil, memangkas ukuran APK hingga lebih dari 50%.
> - **Resource Shrinking**: Menghapus file gambar atau string yang tidak pernah direferensikan dalam kode.
> - **Obfuscation**: Mengacak nama class dan variabel menjadi huruf acak (`a`, `b`, `c`) untuk mempersulit pihak luar merekayasa balik (*reverse engineering*) aplikasimu.

---

## Uji Coba Jalankan di HP Fisik

1. Hubungkan smartphone Android kamu ke laptop dan tekan **Run 'app'** (`Shift + F10`).
2. **Uji Coba Remote API & Coil**:
   - Amati Home Screen: ratusan katalog wallpaper asli beresolusi tinggi langsung dimuat dari server Cloudflare secara cepat dan mulus.
   - Coba scroll cepat naik-turun: perhatikan performa tetap lancar 120 FPS tanpa patah-patah berkat manajemen memori Coil.
3. **Uji Coba Pasang Wallpaper Nyata**:
   - Ketuk salah satu wallpaper yang kamu suka untuk masuk ke `PreviewScreen`.
   - Ketuk tombol **Terapkan Wallpaper** di bagian bawah.
   - Pada dialog yang muncul, pilih opsi **Layar Utama**.
   - Tunggu indikator putaran selesai hingga muncul teks konfirmasi berhasil.
   - Tekan tombol Home di smartphonemu: wallpaper smartphone kamu sekarang benar-benar telah berubah!

---

## Simpan Checkpoint Sesi 5 & Pengumpulan Capstone

Buka tab Terminal di Android Studio, lalu kunci seluruh perubahan checkpoint final:

```bash
git status
git add .
git commit -m "feat(sesi-5): capstone showcase - remote cloudflare api, coil caching, native wallpaper manager, and r8 optimization"
git push origin main
```

### Langkah Pengumpulan Proyek Akhir (Capstone Submission)

1. Pastikan seluruh kode terbaru sudah ter-push rapi ke repositori GitHub pribadimu (`origin main`).
2. Kunjungi portal pengumpulan resmi di [GitHub gdgocwidyatama/Substitution-MobileDev](https://github.com/gdgocwidyatama/Substitution-MobileDev).
3. Buka berkas [Panduan Submisi Capstone](https://github.com/gdgocwidyatama/Substitution-MobileDev/blob/main/doc/SUBMISSION_GUIDE.md).
4. Buat Pull Request (PR) sesuai format yang telah ditentukan panitia untuk mendaftarkan repositori karyamu sebagai Git Submodule.

Selamat atas keberhasilanmu menyelesaikan seluruh rangkaian materi **GDGoC Study Jam: Mobile Development** dan membangun aplikasi **LuminaWalls** dari kanvas kosong hingga rilis produksi!
