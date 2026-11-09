---
title: "Sesi 1: Say Hello Android - Tools, First App Launch & Git on GitHub"
description: "Materi lengkap Sesi 1 GDGoC Study Jam: pengenalan Mobile Development vs Web, evolusi UI Android & Material Expressive, setup project Android Studio dari nol, running ke HP fisik, alur kerja Git & GitHub, dan inisialisasi template LuminaWalls."
---

## Gambaran Umum Sesi 1

Selamat datang di pertemuan perdana **GDGoC Study Jam: Mobile Development** bersama Google Developer Groups On Campus Universitas Widyatama.

Di sesi pertama ini, fokus kita terbagi menjadi dua capaian besar:
1. **Belajar Setup Project & Git dari Nol**: Memahami ekosistem Android, membuat proyek Compose perdana via wizard Android Studio, menjalankannya langsung ke smartphone fisik (*Hello Android!*), dan mempraktikkan alur Git murni (`git init` hingga `git push`).
2. **Inisialisasi Template LuminaWalls**: Menyiapkan starter pack proyek utama, memasang dependensi Splash API, dan memastikan laptop siap tempur untuk masuk ke Sesi 2.

---

## 1. What is Mobile Development?

### More Than Just Phones
Pengembangan aplikasi mobile (*mobile development*) saat ini tidak lagi terbatas hanya pada layar smartphone. Ekosistemnya mencakup tablet, perangkat lipat (*foldables*), jam tangan pintar (*Wear OS*), televisi pintar (*Android TV*), hingga sistem hiburan mobil (*Android Auto*).

### Deep Hardware Access
Keunggulan utama aplikasi mobile native dibandingkan aplikasi web terletak pada kemampuannya mengakses dan berinteraksi secara mendalam dengan komponen perangkat keras (*hardware*) perangkat:
- Sensor biometrik (pemindai sidik jari & pengenalan wajah)
- Kamera tingkat rendah dengan kontrol manual eksposur dan lensa
- GPS dan giroskop presisi tinggi
- Komunikasi nirkabel lokal (Bluetooth Low Energy, NFC, Wi-Fi Direct)

### Web Development vs Mobile Development

| Aspek | Web Development | Mobile Development (Android Native) |
|---|---|---|
| **Tech Stack** | Berjalan di browser menggunakan HTML, CSS, JavaScript / TypeScript | Menggunakan bahasa resmi Kotlin dengan toolkit Jetpack Compose |
| **Model Eksekusi** | Dijalankan oleh mesin peramban (*interpreted inside browser engine*) | Dikompilasi khusus menjadi instruksi biner mesin untuk arsitektur chipset tertentu (ARM64) |
| **Akses Hardware** | Terbatas oleh sandbox keamanan browser (Web APIs) | Integrasi penuh dan mendalam ke seluruh sensor dan periferal hardware secara native |
| **Pengalaman Pengguna** | Bergantung pada koneksi internet dan performa browser | Dirancang responsif, animasi mulus 120 FPS, dan mendukung kemampuan *offline-first* |

---

## 2. The Evolution of Android UI

Pengembangan antarmuka pengguna di Android telah mengalami transformasi besar sejak awal kemunculannya:

```
2008 ---------------- 2014 ---------------- 2017 ---------------- 2021 ------------ Now
Java & Eclipse        Android Studio        Kotlin Official       Modern Standard
XML Layouts           Material Design 1     Compose Preview       100% Compose
(Manual XML)          (Android 5.0)         (Google I/O)          Material 3
```

- **The Classic Android Era (2008–2013)**: Era awal antarmuka Android saat sistem masih mencari identitas visualnya, menggunakan layout XML manual dan bahasa Java pada IDE Eclipse.
- **Modern Material Design (2014–2020)**: Diperkenalkannya Material Design pada Android 5.0 Lollipop bersama IDE resmi Android Studio berbasis IntelliJ, membawa konsistensi visual kertas digital (*digital paper*).
- **Jetpack Compose & Material 3 (2021–Sekarang)**: Standar resmi Google untuk membangun antarmuka deklaratif tanpa berkas XML. Seluruh UI ditulis langsung menggunakan fungsi Kotlin beranotasi `@Composable`.

### Meet Material 3 Expressive
Material 3 Expressive adalah evolusi sistem desain Google yang mengedepankan pendekatan *User Experience* (UX) secara mendalam:
- Dirancang untuk membangun ikatan emosional dan memberikan responsivitas visual alami bagi pengguna di setiap ketukan layar.
- **Built as a UI Library**: Material Expressive bukan framework baru yang menggantikan Jetpack Compose, melainkan sebuah sistem desain resmi dari Google yang dibungkus menjadi Official UI Library bawaan agar proses perakitan antarmuka menjadi lebih terstandarisasi dan cepat.

---

## 3. Tooling and Environment

### Rekomendasi Spesifikasi Perangkat
- **Processor**: Minimal Intel Core i3 generasi ke-7, AMD Ryzen generasi ke-3 yang setara, atau disarankan menggunakan Mac dengan Apple Silicon M-Series.
- **RAM**: Minimal 8 GB, dengan rekomendasi 16 GB untuk kenyamanan multitasking.
- **Penyimpanan**: Menggunakan SSD dengan sisa ruang penyimpanan minimal 25 GB (direkomendasikan sisa ruang 50 GB).

### Integrated Development Environment (IDE)
IDE adalah perangkat lunak terintegrasi untuk menulis kode, melakukan pengujian (*testing*), dan mengelola versi kode. 

Untuk pengembangan Android modern, kita menggunakan **Android Studio** sebagai IDE resmi dari Google yang menyediakan:
- Dukungan penuh untuk Kotlin dan Jetpack Compose beserta fitur Live Preview
- Peralatan analisis bawaan (Logcat, Debugger, Memory & CPU Profiler)
- Integrasi sistem build otomatis menggunakan Gradle
- Fitur **Device Mirroring** untuk menampilkan layar smartphone fisik langsung di dalam editor

---

## 4. Belajar Setup Project dari Nol di Android Studio

Tahap ini bertujuan melatih kamu memahami alur pembuatan proyek Android Studio dari nol:

### Langkah Pembuatan Proyek Baru
1. Buka aplikasi **Android Studio**.
2. Pada layar utama, klik tombol **New Project**.
3. Pada panel kategori template sebelah kiri, pilih **Phone and Tablet**, lalu pilih template **Empty Activity** (pastikan yang berlogo Jetpack Compose).
4. Isi formulir konfigurasi proyek:
   - **Name**: `HelloAndroid`
   - **Package name**: `com.gdgoc.helloandroid`
   - **Save location**: Pilih folder direktori koding di laptopmu
   - **Minimum SDK**: `API 24 ("Nougat"; Android 7.0)`
   - **Build configuration language**: `Kotlin DSL (build.gradle.kts) [Recommended]`
5. Klik **Finish**. Tunggu proses Gradle mengunduh dan menyinkronkan komponen awal.

### Mengenal Struktur Berkas Proyek Android

```text
HelloAndroid/
├── app/
│   ├── build.gradle.kts            <- Konfigurasi SDK modul & dependensi library
│   └── src/main/
│       ├── AndroidManifest.xml     <- KTP aplikasi: izin hardware, deklarasi Activity, & metadata
│       ├── java/com/gdgoc/helloandroid/
│       │   ├── MainActivity.kt     <- Titik masuk utama (entrypoint) eksekusi Compose
│       │   └── ui/theme/           <- Color.kt, Theme.kt, Type.kt (Desain tema Material)
│       └── res/                    <- Asset non-kode: gambar (drawable), icon (mipmap), strings.xml
├── gradle/
│   └── libs.versions.toml          <- Version Catalog (inventaris dependensi terpusat)
└── build.gradle.kts                <- Konfigurasi plugin global tingkat proyek
```

> **Kenapa masih ada file `.xml`?**
> Di Android modern, kita tidak lagi menggunakan XML untuk membuat desain tata letak tampilan (sudah 100% digantikan Jetpack Compose). Berkas XML seperti `AndroidManifest.xml` dan `res/values/strings.xml` tetap digunakan khusus untuk identitas sistem, izin perangkat, dan teks aplikasi.

---

## 5. Bye Emulator! Menjalankan Aplikasi ke HP Fisik

Menggunakan smartphone fisik langsung jauh lebih hemat RAM dan bebas dari lag dibandingkan emulator virtual.

### Mengaktifkan USB Debugging di HP Fisik
1. Buka menu **Settings (Pengaturan)** di smartphone Android kamu.
2. Masuk ke **About Phone (Tentang Ponsel)**.
3. Cari baris **Build Number (Nomor Bentukan)** atau **Versi OS** (MIUI / HyperOS / One UI / ColorOS).
4. Ketuk baris tersebut sebanyak **7 kali berturut-turut** hingga muncul notifikasi *"You are now a developer!"*.
5. Kembali ke menu utama Settings, buka menu **Developer Options (Opsi Pengembang)**.
6. Aktifkan toggle **USB Debugging**.
7. Hubungkan smartphone ke laptop menggunakan kabel data.
8. Pada dialog pop-up di layar HP (*Allow USB debugging?*), centang **Always allow from this computer**, lalu tekan **OK / Allow**.

### Menjalankan Aplikasi (*Hello Android!*)
1. Buka tab **Running Devices** di Android Studio untuk melihat layar HP tertampil langsung via Device Mirroring.
2. Di toolbar atas editor, pastikan nama smartphone fisikmu sudah terpilih.
3. Klik tombol hijau **Run 'app'** (atau tekan `Shift + F10`).
4. Tunggu proses kompilasi berjalan hingga aplikasi terbuka di layar HP dan menampilkan teks *"Hello Android!"*.

---

## 6. Belajar Git dari Nol: Init, Commit & Push ke GitHub

Sekarang kita latih alur version control menggunakan proyek `HelloAndroid` yang baru saja kamu buat.

### Konfigurasi Identitas Git Terminal
Buka Terminal atau tab Terminal di Android Studio, lalu atur identitas global:

```bash
git config --global user.name "username-github-kamu"
git config --global user.email "email-github-kamu@example.com"
```

Verifikasi konfigurasi:
```bash
git config user.name
git config user.email
```

### Inisialisasi Git Lokal
Pastikan kamu berada di dalam folder proyek `HelloAndroid`, lalu jalankan:

```bash
# 1. Jadikan folder proyek sebagai repositori Git
git init

# 2. Masukkan semua berkas ke staging area
git add .

# 3. Kunci riwayat checkpoint pertama
git commit -m "feat(setup): first hello android app launch"
```

### Format Pesan Commit Standar (Conventional Commits)

| Tipe | Kapan Dipakai | Contoh Penerapan |
|---|---|---|
| **`feat`** | Menambah fitur atau komponen baru | `feat(card): rakit wallpaper card pake stacking box` |
| **`fix`** | Memperbaiki bug atau glitch tampilan | `fix(splash): atasi icon splash kepotong di android 12` |
| **`refactor`** | Merapikan susunan kode tanpa mengubah fungsi | `refactor(nav): pisah floating navbar ke folder components` |
| **`chore`** | Urusan dependensi atau konfigurasi build | `chore(deps): pasang coil di libs.versions.toml` |
| **`docs`** | Menulis panduan atau dokumentasi | `docs(readme): tambahkan langkah aktifkan usb debugging` |

### Membuat Repository di GitHub & Push Perdana
1. Buka peramban, masuk ke akun [GitHub](https://github.com), lalu klik **New Repository**.
2. Beri nama repositori: `hello-android`.
3. Biarkan opsi README dan .gitignore **tidak dicentang** (karena proyek lokal kita sudah memilikinya). Klik **Create repository**.
4. Salin URL repositori milikmu, lalu jalankan perintah berikut di Terminal laptopmu:

```bash
# Hubungkan repositori lokal ke GitHub
git remote add origin https://github.com/username-github-kamu/hello-android.git

# Pastikan branch utama bernama main
git branch -M main

# Unggah kode ke GitHub
git push -u origin main
```

Selamat! Kamu sudah menguasai alur setup project Android Studio dan alur Git dari nol.

---

## 7. Persiapan Template LuminaWalls untuk Sesi 2

Untuk proyek besar aplikasi wallpaper **LuminaWalls** yang akan kita kembangkan dari Sesi 2 sampai Sesi 5, panitia telah menyediakan starter pack berisi aset gambar, warna tema Material, dan string XML agar kita tidak perlu membuat semuanya dari nol.

### Clone Template LuminaWalls
Buka terminal baru di folder kodinganmu, lalu clone repositori starter:

```bash
git clone https://github.com/gdgocwidyatama/MobileDev.git luminawalls
cd luminawalls
```

Buka folder `luminawalls` tersebut di Android Studio (**File > Open...**), lalu tunggu Gradle menyelesaikan sinkronisasi.

### Hands-on Template LuminaWalls untuk Sesi 1

Di template LuminaWalls, pustaka `androidx-core-splashscreen` sudah terdaftar rapi di file inventaris `gradle/libs.versions.toml`. Tugas kita di Sesi 1 adalah mengaktifkan dependensi tersebut dan memasang Splash Screen resmi sistem Android.

Ada tiga berkas yang perlu kita sentuh:

#### Langkah 1: Pasang Dependensi Splash API di `app/build.gradle.kts`
Buka berkas `app/build.gradle.kts`. Gunakan `Ctrl + F` (atau `Cmd + F` di Mac) untuk mencari baris komentar berikut:

```kotlin
    // TODO: [Session 1] Tambahkan dependensi SplashScreen resmi Android di bawah sini:
```

Tempel baris dependensi berikut tepat di bawah komentar tersebut:

```kotlin
    implementation(libs.androidx.core.splashscreen)
```

Setelah itu, klik tombol **Sync Now** yang muncul di sudut kanan atas editor Android Studio dan tunggu proses sinkronisasi Gradle selesai.

> Dependensi ini adalah library resmi dari Google (`androidx.core:core-splashscreen`) agar tampilan splash screen transisi mulus dan konsisten di semua versi Android, dari Android 7 sampai Android 15+.

#### Langkah 2: Aktifkan Style Splash Screen di `app/src/main/res/values/themes.xml`
Buka berkas `app/src/main/res/values/themes.xml`. Kamu akan melihat komentar TODO berikut:

```xml
    <!-- TODO: [Session 1] Pasang dependency core-splashscreen di build.gradle.kts, lalu aktifkan style Theme.App.Starting di bawah ini & ganti android:theme di AndroidManifest.xml:
    <style name="Theme.App.Starting" parent="Theme.SplashScreen">
        <item name="windowSplashScreenBackground">@color/splash_background</item>
        <item name="windowSplashScreenAnimatedIcon">@drawable/gdg_logo</item>
        <item name="postSplashScreenTheme">@style/Theme.LuminaWalls</item>
        <item name="android:windowNoTitle">true</item>
        <item name="android:windowActionBar">false</item>
    </style>
    -->
```

Hapus tanda komentar pembuka `<!--` dan penutup `-->` sehingga style `Theme.App.Starting` menjadi aktif seperti ini:

```xml
    <style name="Theme.App.Starting" parent="Theme.SplashScreen">
        <item name="windowSplashScreenBackground">@color/splash_background</item>
        <item name="windowSplashScreenAnimatedIcon">@drawable/gdg_logo</item>
        <item name="postSplashScreenTheme">@style/Theme.LuminaWalls</item>
        <item name="android:windowNoTitle">true</item>
        <item name="android:windowActionBar">false</item>
    </style>
```

> Style ini memberitahu sistem Android untuk menampilkan warna latar cream (`@color/splash_background`) dan logo resmi GDGoC (`@drawable/gdg_logo`) saat aplikasi sedang dimuat ke memori, lalu otomatis berganti ke tema utama (`Theme.LuminaWalls`). Item `windowNoTitle` dan `windowActionBar` memastikan jendela aplikasi bebas dari action bar native sistem.

#### Langkah 3: Pasang Style di `app/src/main/AndroidManifest.xml`
Buka berkas `app/src/main/AndroidManifest.xml`. Cari baris atribut tema pada tag `<application>`:

```xml
        android:theme="@style/Theme.LuminaWalls">
        <!-- TODO: [Session 1] Setelah mengaktifkan Theme.App.Starting di themes.xml, ganti android:theme di atas menjadi @style/Theme.App.Starting -->
```

Ubah nilai atribut `android:theme` di atas komentar tersebut dari `@style/Theme.LuminaWalls` menjadi `@style/Theme.App.Starting`:

```xml
        android:theme="@style/Theme.App.Starting">
```

> AndroidManifest adalah berkas identitas aplikasi. Mengarahkan tema aplikasi ke `Theme.App.Starting` memastikan sistem Android langsung menyalakan splash screen sejak milidetik pertama icon aplikasi diketuk oleh pengguna.

#### Langkah 4: Aktifkan SplashScreen di `app/src/main/kotlin/com/gdgoc/luminawalls/MainActivity.kt`
Buka berkas `app/src/main/kotlin/com/gdgoc/luminawalls/MainActivity.kt`.

1. Tambahkan baris impor resmi SplashScreen di bagian atas berkas:

```kotlin
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
```

2. Cari blok fungsi `onCreate()`:

```kotlin
    override fun onCreate(savedInstanceState: Bundle?) {
        // TODO: [Session 1] Pasang installSplashScreen() resmi Android di bawah sini sebelum super.onCreate():

        super.onCreate(savedInstanceState)
```

3. Panggil fungsi `val splashScreen = installSplashScreen()` tepat sebelum `super.onCreate(savedInstanceState)`:

```kotlin
    override fun onCreate(savedInstanceState: Bundle?) {
        // TODO: [Session 1] Pasang installSplashScreen() resmi Android di bawah sini sebelum super.onCreate():
        val splashScreen = installSplashScreen()
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
```

> **Mengapa wajib sebelum `super.onCreate()`?**
> Library SplashScreen Android membutuhkan inisialisasi awal sebelum Activity dibangun. Pemanggilan `installSplashScreen()` memastikan sistem Android mengendalikan animasi splash dan mulus berpindah ke tema `Theme.LuminaWalls` tanpa memunculkan title bar native bawaan sistem.

#### Langkah 5: Uji Coba Jalankan di HP Fisik
1. Hubungkan smartphone fisikmu dengan kabel data.
2. Pastikan nama perangkatmu terpilih di toolbar atas Android Studio.
3. Klik tombol hijau **Run 'app'** atau tekan shortcut `Shift + F10`.
4. Perhatikan layar smartphone: splash screen dengan latar cream dan logo GDGoC akan muncul sekejap secara anggun, kemudian langsung masuk ke halaman utama bertuliskan "Hello Android!".

#### Langkah 6: Simpan Checkpoint Sesi 1 ke GitHub
Buka tab Terminal di Android Studio, lalu jalankan perintah Git berikut:

```bash
git status
git add .
git commit -m "feat(sesi-1): setup project, physical device run, and splash api"
git push origin main
```

Kini proyek LuminaWalls di laptop dan smartphonemu sudah 100% siap untuk mulai merakit antarmuka aplikasi dari kanvas kosong di **Sesi 2**!
