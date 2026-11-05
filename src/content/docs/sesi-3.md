---
title: "Sesi 3: Stacking Cards, Settings Theme Switcher & Floating Nav Bar"
description: "Panduan koding Sesi 3: dependensi DataStore Preferences, grid 2 kolom di HomeScreen, SettingsScreen theme switcher, dan FloatingNavBar."
---

## Langkah 1: Pasang Dependensi DataStore Preferences

Pustaka `androidx-datastore-preferences` sudah tersedia di `gradle/libs.versions.toml`. Buka berkas `app/build.gradle.kts`, lalu panggil di dalam blok `dependencies`:

```kotlin
dependencies {
    // Penyimpanan data preferensi asinkron (pengganti SharedPreferences)
    implementation(libs.androidx.datastore.preferences)
}
```

Klik tombol **Sync Now** di sudut kanan atas editor Android Studio.

---

## Langkah 2: Grid 2 Kolom di `HomeScreen.kt`

Buka berkas `app/src/main/kotlin/com/gdgoc/luminawalls/ui/screens/home/HomeScreen.kt`.

Atur grid 2 kolom dengan jarak antar item yang rapi:

```kotlin
@Composable
fun HomeScreen(
    wallpapers: List<Wallpaper>,
    onWallpaperClick: (Wallpaper) -> Unit,
    onSettingsClick: () -> Unit,
    modifier: Modifier = Modifier,
) {
    LuminaScreenScaffold(
        title = stringResource(R.string.app_name),
        subtitle = stringResource(R.string.home_subtitle),
        modifier = modifier,
        trailingAction = {
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
        },
    ) {
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
    }
}
```

---

## Langkah 3: Theme Switcher di `SettingsScreen.kt`

Buka berkas `app/src/main/kotlin/com/gdgoc/luminawalls/ui/screens/settings/SettingsScreen.kt`:

```kotlin
@Composable
fun SettingsScreen(
    currentThemeMode: AppThemeMode,
    onThemeModeSelected: (AppThemeMode) -> Unit,
    onBackClick: () -> Unit,
    modifier: Modifier = Modifier,
) {
    LuminaScreenScaffold(
        title = stringResource(R.string.settings_title),
        subtitle = stringResource(R.string.settings_subtitle),
        leadingAction = {
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
        },
        modifier = modifier,
    ) {
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(start = 16.dp, end = 16.dp, top = 22.dp, bottom = 48.dp),
            verticalArrangement = Arrangement.spacedBy(22.dp),
        ) {
            item {
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    verticalArrangement = Arrangement.spacedBy(6.dp),
                ) {
                    Text(
                        text = stringResource(R.string.settings_section_appearance),
                        style = MaterialTheme.typography.labelMedium,
                        color = MaterialTheme.colorScheme.primary,
                        modifier = Modifier.padding(start = 12.dp, bottom = 2.dp),
                        letterSpacing = 1.2.sp,
                    )

                    Column(
                        modifier = Modifier.fillMaxWidth(),
                        verticalArrangement = Arrangement.spacedBy(3.dp),
                    ) {
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
                    }
                }
            }
        }
    }
}
```

---

## Langkah 4: Pasang `FloatingNavBar` di `LuminaMainApp.kt`

Buka berkas `app/src/main/kotlin/com/gdgoc/luminawalls/ui/LuminaMainApp.kt`:

```kotlin
Box(modifier = Modifier.fillMaxSize()) {
    when (currentTab) {
        LuminaTab.HOME -> {
            HomeScreen(
                wallpapers = wallpapers,
                onWallpaperClick = { wall -> activeScreen = AppScreen.Preview(wall) },
                onSettingsClick = { activeScreen = AppScreen.Settings },
            )
        }
        LuminaTab.CONTRIBUTORS -> {
            ContributorsScreen(contributors = contributors)
        }
    }

    FloatingNavBar(
        selectedTab = currentTab,
        onTabSelected = { tab -> currentTab = tab },
        modifier = Modifier.align(Alignment.BottomCenter),
    )
}
```

Jalankan ke HP (`Shift + F10`). Klik ikon Settings, pilih salah satu mode tema (Light/Dark/System), lalu amati perubahan warna aplikasi.

---

## Langkah 5: Simpan ke Git & Push

```bash
git status
git add .
git commit -m "feat(sesi-3): implement datastore preferences, 2-column grid, theme switcher, and floating nav bar"
git push origin main
```
