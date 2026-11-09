---
title: "Sesi 3: Stacking Cards, Settings Theme Switcher & Floating Nav Bar"
description: "Panduan koding hands-on Sesi 3: persistensi DataStore Preferences, galeri 2 kolom LazyVerticalGrid, antarmuka pemilihan tema di SettingsScreen, dan FloatingNavBar modern."
---

## Gambaran Umum Sesi 3

Selamat datang di materi koding **Sesi 3**!

Pada sesi ini, kita akan meningkatkan aplikasi **LuminaWalls** dari prototipe awal menjadi aplikasi yang lebih tangguh dan interaktif:
1. **Persistensi Data**: Mengganti state sementara di memori dengan **Jetpack DataStore Preferences** agar setelan tema dan status wizard tersimpan permanen di perangkat.
2. **Katalog Galeri Efisien**: Mengubah tata letak galeri di `HomeScreen.kt` dari `Row` menjadi **`LazyVerticalGrid` 2 kolom** yang mendukung scroll cepat dan hemat memori.
3. **Menu Pengaturan Tema**: Merakit opsi penggantian tema (Sistem, Terang, Gelap) di `SettingsScreen.kt` dengan bentuk sudut adaptif khas Material 3 Expressive.
4. **Navigasi Melayang**: Memasang `FloatingNavBar` di `LuminaMainApp.kt` dengan animasi muncul dan sembunyi otomatis saat berpindah layar.

Semua langkah di bawah langsung merujuk pada komentar `// TODO: [Session 3]` di berkas proyekmu.

---

## Rangkuman Import Sesi 3

Agar proses koding lancar tanpa terganggu pesan error merah karena class belum diimpor, berikut daftar `import` yang dikelompokkan per berkas untuk Sesi 3:

<details open>
<summary><b>Daftar Import Sesi 3 per Berkas (Klik untuk Buka/Tutup)</b></summary>

### 1. `UserPreferencesRepository.kt`
```kotlin
import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
```

### 2. `HomeScreen.kt`
```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Settings
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import com.gdgoc.luminawalls.R
import com.gdgoc.luminawalls.ui.components.WallpaperCard
```

### 3. `SettingsScreen.kt`
```kotlin
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.BrightnessAuto
import androidx.compose.material.icons.rounded.DarkMode
import androidx.compose.material.icons.rounded.LightMode
import androidx.compose.ui.res.stringResource
import com.gdgoc.luminawalls.R
import com.gdgoc.luminawalls.data.repository.AppThemeMode
import com.gdgoc.luminawalls.ui.components.itemShapeFor
```

### 4. `LuminaMainApp.kt`
> *Catatan*: Seluruh pustaka animasi (`AnimatedVisibility`, `slideInVertically`, dll.) dan komponen `FloatingNavBar` sudah tersedia di berkas awal template.

</details>

---

## Langkah 1: Pasang Dependensi DataStore Preferences di `app/build.gradle.kts`

Buka berkas `app/build.gradle.kts`.

Gunakan `Ctrl + F` (atau `Cmd + F` di Mac) untuk mencari baris komentar berikut:

```kotlin
    // TODO: [Session 3] Tambahkan DataStore Preferences untuk simpan setelan tema di bawah sini:
```

Tempel deklarasi dependensi berikut tepat di bawah komentar tersebut:

```kotlin
    implementation(libs.androidx.datastore.preferences)
```

Setelah itu, klik tombol **Sync Now** di sudut kanan atas editor Android Studio dan tunggu hingga proses sinkronisasi Gradle selesai.

> **Kenapa DataStore Preferences?**
> Di Android modern, Google merekomendasikan `DataStore Preferences` sebagai pengganti resmi dari `SharedPreferences`. DataStore beroperasi secara asinkron menggunakan Kotlin Coroutines dan Flow, sehingga tidak pernah mengunci main thread dan mencegah aplikasi mengalami lag atau ANR (*Application Not Responding*).

---

## Langkah 2: Sambungkan DataStore di `UserPreferencesRepository.kt`

Buka berkas `app/src/main/kotlin/com/gdgoc/luminawalls/data/repository/UserPreferencesRepository.kt`.

### 1. Tambahkan Import di Bagian Atas
Pastikan baris impor berikut tersedia di bagian paling atas berkas:

```kotlin
import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
```

Kita akan mengganti in-memory state dengan membaca dan menulis berkas DataStore lokal:

### 2. Inisialisasi Berkas DataStore
Tepat di atas deklarasi `class UserPreferencesRepository`, tambahkan baris delegasi berikut:

```kotlin
private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "luminawalls_prefs")
```

### 3. Ganti StateFlow & Fungsi Setter
Di dalam `class UserPreferencesRepository`, cari baris komentar:

```kotlin
    // TODO: [Session 3] Ganti in-memory state ini dengan Jetpack DataStore Preferences di bawah sini:
```

Hapus deklarasi `_isSetupCompleted`, `isSetupCompleted`, `_themeMode`, dan kedua fungsi setter di bawahnya, lalu gantikan dengan implementasi DataStore berikut:

```kotlin
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.IO)

    val isSetupCompleted: StateFlow<Boolean> = context.dataStore.data
        .map { preferences -> preferences[KEY_SETUP_COMPLETED] ?: false }
        .stateIn(
            scope = scope,
            started = SharingStarted.Eagerly,
            initialValue = false,
        )

    val themeMode: StateFlow<AppThemeMode> = context.dataStore.data
        .map { preferences ->
            val modeName = preferences[KEY_THEME_MODE] ?: AppThemeMode.FOLLOW_SYSTEM.name
            try {
                AppThemeMode.valueOf(modeName)
            } catch (_: Exception) {
                AppThemeMode.FOLLOW_SYSTEM
            }
        }
        .stateIn(
            scope = scope,
            started = SharingStarted.Eagerly,
            initialValue = AppThemeMode.FOLLOW_SYSTEM,
        )

    fun setSetupCompleted(completed: Boolean) {
        scope.launch {
            context.dataStore.edit { preferences ->
                preferences[KEY_SETUP_COMPLETED] = completed
            }
        }
    }

    fun setThemeMode(mode: AppThemeMode) {
        scope.launch {
            context.dataStore.edit { preferences ->
                preferences[KEY_THEME_MODE] = mode.name
            }
        }
    }
```

### 4. Daftarkan Kunci Preferensi di `companion object`
Gulir ke bagian paling bawah berkas pada blok `companion object { ... }`, lalu tambahkan definisi dua kunci berikut:

```kotlin
        private val KEY_SETUP_COMPLETED = booleanPreferencesKey("setup_completed")
        private val KEY_THEME_MODE = stringPreferencesKey("theme_mode")
```

> Kunci preferensi ini bertindak sebagai label kolom data di penyimpanan lokal perangkat. Menggunakan `stateIn` memastikan data preferensi selalu siap dibaca seketika (*read-ready*) saat UI Compose pertama kali dirender.

<details>
<summary><strong>Opsi Cepat: Salin Seluruh Isi File `UserPreferencesRepository.kt`</strong></summary>

Jika kamu tidak ingin repot mengedit sepotong-sepotong dan ingin langsung menghindari error import atau kurung kurawal, kamu bisa menekan `Ctrl + A` lalu timpa seluruh isi berkas `UserPreferencesRepository.kt` dengan kode lengkap berikut:

```kotlin
package com.gdgoc.luminawalls.data.repository

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

enum class AppThemeMode {
    FOLLOW_SYSTEM,
    LIGHT,
    DARK,
}

private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "luminawalls_prefs")

class UserPreferencesRepository private constructor(private val context: Context) {

    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.IO)

    val isSetupCompleted: StateFlow<Boolean> = context.dataStore.data
        .map { preferences -> preferences[KEY_SETUP_COMPLETED] ?: false }
        .stateIn(
            scope = scope,
            started = SharingStarted.Eagerly,
            initialValue = false,
        )

    val themeMode: StateFlow<AppThemeMode> = context.dataStore.data
        .map { preferences ->
            val modeName = preferences[KEY_THEME_MODE] ?: AppThemeMode.FOLLOW_SYSTEM.name
            try {
                AppThemeMode.valueOf(modeName)
            } catch (_: Exception) {
                AppThemeMode.FOLLOW_SYSTEM
            }
        }
        .stateIn(
            scope = scope,
            started = SharingStarted.Eagerly,
            initialValue = AppThemeMode.FOLLOW_SYSTEM,
        )

    fun setSetupCompleted(completed: Boolean) {
        scope.launch {
            context.dataStore.edit { preferences ->
                preferences[KEY_SETUP_COMPLETED] = completed
            }
        }
    }

    fun setThemeMode(mode: AppThemeMode) {
        scope.launch {
            context.dataStore.edit { preferences ->
                preferences[KEY_THEME_MODE] = mode.name
            }
        }
    }

    companion object {
        private val KEY_SETUP_COMPLETED = booleanPreferencesKey("setup_completed")
        private val KEY_THEME_MODE = stringPreferencesKey("theme_mode")

        @Volatile
        private var INSTANCE: UserPreferencesRepository? = null

        fun getInstance(context: Context): UserPreferencesRepository {
            return INSTANCE ?: synchronized(this) {
                INSTANCE ?: UserPreferencesRepository(context.applicationContext).also { INSTANCE = it }
            }
        }
    }
}
```

</details>

---

## Langkah 3: Tombol Settings & Galeri 2 Kolom di `HomeScreen.kt`

Buka berkas `app/src/main/kotlin/com/gdgoc/luminawalls/ui/screens/home/HomeScreen.kt`.

### 1. Tambahkan Import di Bagian Atas
Pastikan baris impor berikut tersedia di bagian paling atas berkas:

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Settings
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import com.gdgoc.luminawalls.R
import com.gdgoc.luminawalls.ui.components.WallpaperCard
```

Kita akan melengkapi header dan mengubah tata letak katalog wallpaper:

### 2. Tambahkan Ikon Menu Settings di Header
Cari baris komentar berikut pada parameter `trailingAction`:

```kotlin
            // TODO: [Session 3] Tulis IconButton untuk membuka layar Pengaturan (onSettingsClick) di bawah sini:
```

Tempel kode tombol pengaturan berikut:

```kotlin
            IconButton(
                onClick = onSettingsClick,
                modifier = Modifier.size(42.dp),
            ) {
                Icon(
                    imageVector = Icons.Rounded.Settings,
                    contentDescription = stringResource(R.string.action_settings),
                    tint = MaterialTheme.colorScheme.onSurface,
                    modifier = Modifier.size(26.dp),
                )
            }
```

### 3. Ubah Menjadi `LazyVerticalGrid` 2 Kolom
Cari baris komentar berikut:

```kotlin
        // TODO: [Session 3] Ubah menjadi LazyVerticalGrid 2 kolom di bawah sini:
```

Hapus blok `if (wallpapers.isNotEmpty()) { Row { ... } }` dari Sesi 2, lalu gantikan dengan grid dinamis berikut:

```kotlin
        LazyVerticalGrid(
            columns = GridCells.Fixed(2),
            contentPadding = PaddingValues(start = 14.dp, end = 14.dp, top = 14.dp, bottom = 100.dp),
            horizontalArrangement = Arrangement.spacedBy(10.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
            modifier = Modifier.fillMaxSize(),
        ) {
            items(
                items = wallpapers,
                key = { it.id },
            ) { wallpaper ->
                WallpaperCard(
                    wallpaper = wallpaper,
                    onWallpaperClick = onWallpaperClick,
                )
            }
        }
```

> **Mengapa `LazyVerticalGrid`?**
> Komponen `Lazy` hanya merender kartu yang sedang tampak di layar pengguna (*lazy rendering*), sehingga penggunaan RAM tetap sangat rendah meskipun berisi ribuan wallpaper. Padding `bottom = 100.dp` memastikan kartu di baris paling bawah tidak tertutup oleh navigasi bawah (*floating navbar*).

---

## Langkah 4: Opsi Pemilihan Tema di `SettingsScreen.kt`

Buka berkas `app/src/main/kotlin/com/gdgoc/luminawalls/ui/screens/settings/SettingsScreen.kt`.

### 1. Tambahkan Import di Bagian Atas
Pastikan baris impor berikut sudah tersedia di bagian paling atas berkas:

```kotlin
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.BrightnessAuto
import androidx.compose.material.icons.rounded.DarkMode
import androidx.compose.material.icons.rounded.LightMode
import androidx.compose.ui.res.stringResource
import com.gdgoc.luminawalls.R
import com.gdgoc.luminawalls.data.repository.AppThemeMode
import com.gdgoc.luminawalls.ui.components.itemShapeFor
```

### 2. Tulis Opsi Pemilihan Tema
Cari baris komentar berikut:

```kotlin
                    // TODO: [Session 3] Tulis opsi pemilihan tema (System, Light, Dark) menggunakan ThemeOptionItem di bawah sini:
```

Tempel tiga pilihan mode tema berikut tepat di bawah komentar tersebut:

```kotlin
                    ThemeOptionItem(
                        title = stringResource(R.string.settings_theme_system),
                        subtitle = stringResource(R.string.settings_theme_system_desc),
                        icon = Icons.Rounded.BrightnessAuto,
                        selected = currentThemeMode == AppThemeMode.FOLLOW_SYSTEM,
                        onClick = { onThemeModeSelected(AppThemeMode.FOLLOW_SYSTEM) },
                        shape = itemShapeFor(0, 3),
                    )

                    ThemeOptionItem(
                        title = stringResource(R.string.settings_theme_light),
                        subtitle = stringResource(R.string.settings_theme_light_desc),
                        icon = Icons.Rounded.LightMode,
                        selected = currentThemeMode == AppThemeMode.LIGHT,
                        onClick = { onThemeModeSelected(AppThemeMode.LIGHT) },
                        shape = itemShapeFor(1, 3),
                    )

                    ThemeOptionItem(
                        title = stringResource(R.string.settings_theme_dark),
                        subtitle = stringResource(R.string.settings_theme_dark_desc),
                        icon = Icons.Rounded.DarkMode,
                        selected = currentThemeMode == AppThemeMode.DARK,
                        onClick = { onThemeModeSelected(AppThemeMode.DARK) },
                        shape = itemShapeFor(2, 3),
                    )
```

> Fungsi `itemShapeFor(index, total)` adalah helper bawaan template yang otomatis membulatkan sudut atas untuk item pertama, sudut bawah untuk item terakhir, dan sudut datar untuk item di tengah, menciptakan daftar pilihan rapi bergaya *Material Expressive Grouped Card*.

---

## Langkah 5: Navigasi Settings & Pasang FloatingNavBar di `LuminaMainApp.kt`

Buka berkas `app/src/main/kotlin/com/gdgoc/luminawalls/ui/LuminaMainApp.kt`.

> **Catatan Import**: Seluruh pustaka animasi (`AnimatedVisibility`, `slideInVertically`, `spring`, dll.) serta komponen `FloatingNavBar` sudah diimpor secara lengkap di bagian atas berkas `LuminaMainApp.kt`. Kamu bisa langsung lanjut melengkapi kode navigasi di bawah.

Terdapat dua bagian navigasi yang perlu kita lengkapi:

### 1. Buka Layar Settings saat Ikon Diklik
Cari baris komentar berikut di dalam blok `onSettingsClick = { ... }`:

```kotlin
                                        // TODO: [Session 3] Navigasikan ke SettingsScreen (AppScreen.Settings) di bawah sini:
```

Tempel satu baris navigasi berikut:

```kotlin
                                        activeScreen = AppScreen.Settings
```

### 2. Pasang Floating Navigation Bar
Gulir ke bagian bawah kontainer `Box`, lalu cari komentar:

```kotlin
                // TODO: [Session 3] Tulis Floating Navigation Bar di bagian bawah untuk navigasi tab Home & Contributors di bawah sini:
```

Tempel komponen bar navigasi melayang dengan animasi pegas (*spring animation*) berikut:

```kotlin
                AnimatedVisibility(
                    visible = activeScreen is AppScreen.MainTab,
                    enter = slideInVertically(
                        initialOffsetY = { it },
                        animationSpec = spring(
                            dampingRatio = Spring.DampingRatioMediumBouncy,
                            stiffness = Spring.StiffnessMedium,
                        )
                    ) + fadeIn(),
                    exit = slideOutVertically(
                        targetOffsetY = { it },
                        animationSpec = tween(150, easing = EaseInCubic)
                    ) + fadeOut(),
                    modifier = Modifier.align(Alignment.BottomCenter),
                ) {
                    FloatingNavBar(
                        selectedTab = currentTab,
                        onTabSelected = { tab ->
                            currentTab = tab
                            activeScreen = AppScreen.MainTab(tab)
                        },
                        modifier = Modifier.padding(bottom = 24.dp),
                    )
                }
```

> `FloatingNavBar` didesain melayang anggun di atas galeri wallpaper. Dengan membungkusnya di dalam `AnimatedVisibility`, navbar akan otomatis bersembunyi saat kita membuka layar Settings atau Preview, dan kembali muncul saat kita kembali ke galeri utama.

---

## Uji Coba Jalankan di HP Fisik

1. Hubungkan smartphone ke laptop dan jalankan aplikasi (`Shift + F10`).
2. **Uji Coba Penggantian Tema**:
   - Ketuk ikon **Settings** di kanan atas Home Screen.
   - Pilih opsi **Gelap (Dark Mode)**: amati seluruh warna latar dan kartu seketika berubah menjadi gelap.
   - Coba pilih opsi **Terang (Light Mode)** untuk melihat warna cerah.
3. **Uji Coba Persistensi DataStore**:
   - Biarkan tema dalam mode Gelap.
   - Keluar dari aplikasi, lalu tutup paksa aplikasi (*kill app* dari daftar Recent Apps di smartphone kamu).
   - Buka kembali aplikasi LuminaWalls: perhatikan aplikasi langsung menyala dalam mode Gelap tanpa kembali ke setelan awal!
4. **Uji Coba Navigasi Tab**:
   - Ketuk tab **Contributors** pada Floating Navigation Bar di bagian bawah layar untuk melihat animasi perpindahan tab.

---

## Simpan Checkpoint Sesi 3 ke Git

Buka tab Terminal di Android Studio, lalu jalankan:

```bash
git status
git add .
git commit -m "feat(sesi-3): implement datastore preferences, 2-column grid, theme switcher, and floating nav bar"
git push origin main
```

Luar biasa! Di **Sesi 4**, kita akan menyempurnakan token warna Material 3, menambahkan badge label kategori, dan menghubungkan REST API GitHub untuk memuat daftar kontributor secara live!
