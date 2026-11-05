---
title: "Sesi 5: Capstone Showcase: Remote API, Coil, Native WallpaperManager, R8 & Final Project Submission"
description: "Panduan koding Sesi 5: remote API OkHttp, Coil image loading, pasang wallpaper native WallpaperManager, optimasi R8, dan pengumpulan Capstone."
---

## Langkah 1: Pasang Dependensi OkHttp & Coil

Pustaka `okhttp` dan `coil-compose` sudah terdaftar di `gradle/libs.versions.toml`. Buka berkas `app/build.gradle.kts`, lalu panggil di dalam blok `dependencies`:

```kotlin
dependencies {
    // Remote API HTTP Client
    implementation(libs.okhttp)
    // Asynchronous Image Loading untuk Jetpack Compose
    implementation(libs.coil.compose)
}
```

Klik tombol **Sync Now** di sudut kanan atas editor.

---

## Langkah 2: Ambil Data API di `WallpaperRepository.kt`

Buka berkas `app/src/main/kotlin/com/gdgoc/luminawalls/data/repository/WallpaperRepository.kt`:

```kotlin
object WallpaperRepository {
    private val client = OkHttpClient()
    private const val API_URL = "https://lumiwalls-api.gdgoc.workers.dev/wallpapers"

    suspend fun fetchWallpapers(): List<Wallpaper> = withContext(Dispatchers.IO) {
        val request = Request.Builder().url(API_URL).build()
        client.newCall(request).execute().use { response ->
            if (!response.isSuccessful) throw IOException("Gagal memuat data: ${response.code}")
            val body = response.body?.string() ?: return@withContext emptyList()
            parseWallpapersJson(body)
        }
    }
}
```

---

## Langkah 3: Load Gambar Online di `NetworkImage.kt`

Buka berkas `app/src/main/kotlin/com/gdgoc/luminawalls/ui/components/NetworkImage.kt`:

```kotlin
@Composable
fun NetworkImage(
    url: String,
    contentDescription: String?,
    modifier: Modifier = Modifier,
    contentScale: ContentScale = ContentScale.Crop,
) {
    SubcomposeAsyncImage(
        model = ImageRequest.Builder(LocalContext.current)
            .data(url)
            .crossfade(true)
            .build(),
        contentDescription = contentDescription,
        contentScale = contentScale,
        loading = {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(MaterialTheme.colorScheme.surfaceContainerHigh),
                contentAlignment = Alignment.Center,
            ) {
                CircularProgressIndicator(
                    modifier = Modifier.size(24.dp),
                    strokeWidth = 2.dp,
                    color = MaterialTheme.colorScheme.primary,
                )
            }
        },
        error = {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(MaterialTheme.colorScheme.surfaceContainerHighest),
                contentAlignment = Alignment.Center,
            ) {
                Icon(
                    imageVector = Icons.Rounded.BrokenImage,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.outline,
                )
            }
        },
        modifier = modifier,
    )
}
```

---

## Langkah 4: Pasang Wallpaper Native via `WallpaperManager`

### 1. Izin di `app/src/main/AndroidManifest.xml`
Tambahkan baris berikut di atas tag `<application>`:

```xml
<uses-permission android:name="android.permission.SET_WALLPAPER" />
```

### 2. Eksekusi di `ApplyWallpaperBottomSheet.kt`
Buka berkas `app/src/main/kotlin/com/gdgoc/luminawalls/ui/screens/preview/ApplyWallpaperBottomSheet.kt`:

```kotlin
suspend fun applyWallpaper(
    context: Context,
    bitmap: Bitmap,
    target: WallpaperTarget,
) = withContext(Dispatchers.IO) {
    val manager = WallpaperManager.getInstance(context)
    val flag = when (target) {
        WallpaperTarget.HOME -> WallpaperManager.FLAG_SYSTEM
        WallpaperTarget.LOCK -> WallpaperManager.FLAG_LOCK
        WallpaperTarget.BOTH -> WallpaperManager.FLAG_SYSTEM or WallpaperManager.FLAG_LOCK
    }
    manager.setBitmap(bitmap, null, true, flag)
}
```

---

## Langkah 5: Optimasi Rilis R8 / ProGuard

Buka berkas `app/build.gradle.kts`. Pada blok `buildTypes -> release`:

```kotlin
android {
    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
}
```

Kompilasi APK rilis lewat Terminal:

```bash
./gradlew assembleRelease
```

Hasil file APK ada di `app/build/outputs/apk/release/app-release.apk`.

---

## Langkah 6: Simpan ke Git & Submit Proyek Capstone

1. Push seluruh kode final ke repositori GitHub pribadimu:
   ```bash
   git status
   git add .
   git commit -m "feat(sesi-5): complete capstone project with remote api, coil, wallpaper manager, and r8"
   git push origin main
   ```

2. Kumpulkan tautan repositori proyekmu ke form / repositori submission:
   [**Repositori Submission Capstone GDGoC**](https://github.com/gdgocwidyatama/Substitution-MobileDev)
