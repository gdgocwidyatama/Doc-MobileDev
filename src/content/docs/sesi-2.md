---
title: "Sesi 2: App Gateway & Setup Wizard (Thinking in Compose Basics)"
description: "Panduan koding Sesi 2: implementasi SetupScreen 3 langkah, gerbang state navigasi di LuminaMainApp, dan Stacking Card di WallpaperCard."
---

## Langkah 1: Merakit Wizard di `SetupScreen.kt`

Buka berkas `app/src/main/kotlin/com/gdgoc/luminawalls/ui/setup/SetupScreen.kt`.

Lengkapi fungsi `SetupScreen` serta komponen langkahnya (`WelcomeStep` dan `DoneStep`):

```kotlin
@Composable
fun SetupScreen(
    currentThemeMode: AppThemeMode,
    onThemeModeSelected: (AppThemeMode) -> Unit,
    onFinished: () -> Unit,
) {
    var step by remember { mutableIntStateOf(0) }
    val pageCount = 3

    BackHandler(enabled = step > 0) {
        step -= 1
    }

    Scaffold(
        bottomBar = {
            SetupBottomBar(
                currentPage = step,
                pageCount = pageCount,
                onNextClicked = {
                    if (step < pageCount - 1) step += 1
                },
                onFinishClicked = onFinished,
                isNextButtonEnabled = true,
                isFinishButtonEnabled = true,
            )
        },
        containerColor = MaterialTheme.colorScheme.background,
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues),
        ) {
            when (step) {
                0 -> WelcomeStep()
                1 -> PersonalizationStep(
                    currentThemeMode = currentThemeMode,
                    onThemeModeSelected = onThemeModeSelected,
                )
                2 -> DoneStep()
            }
        }
    }
}

@Composable
private fun WelcomeStep() {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
    ) {
        SetupHeader(
            title = stringResource(R.string.setup_welcome_title),
            subtitle = stringResource(R.string.setup_welcome_subtitle),
        )
    }
}

@Composable
private fun DoneStep() {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
    ) {
        SetupHeader(
            title = stringResource(R.string.setup_done_title),
            subtitle = stringResource(R.string.setup_done_subtitle),
        )
    }
}
```

---

## Langkah 2: Gerbang State Navigasi di `LuminaMainApp.kt`

Buka berkas `app/src/main/kotlin/com/gdgoc/luminawalls/ui/LuminaMainApp.kt`.

Atur logika peralihan antara `SetupScreen` dan `HomeScreen`:

```kotlin
@Composable
fun LuminaMainApp() {
    val context = LocalContext.current
    val prefsRepo = remember { UserPreferencesRepository.getInstance(context) }

    val isSetupCompleted by prefsRepo.isSetupCompleted.collectAsStateWithLifecycle()
    val themeMode by prefsRepo.themeMode.collectAsStateWithLifecycle()

    LuminaTheme(
        darkTheme = when (themeMode) {
            AppThemeMode.FOLLOW_SYSTEM -> isSystemInDarkTheme()
            AppThemeMode.LIGHT -> false
            AppThemeMode.DARK -> true
        },
    ) {
        if (!isSetupCompleted) {
            SetupScreen(
                currentThemeMode = themeMode,
                onThemeModeSelected = { prefsRepo.setThemeMode(it) },
                onFinished = { prefsRepo.setSetupCompleted(true) },
            )
        } else {
            HomeScreen(
                wallpapers = WallpaperRepository.sampleWallpapers,
                onWallpaperClick = { /* Sesi 5 */ },
                onSettingsClick = { /* Sesi 3 */ },
            )
        }
    }
}
```

---

## Langkah 3: Merakit Stacking Card di `WallpaperCard.kt`

Buka berkas `app/src/main/kotlin/com/gdgoc/luminawalls/ui/components/WallpaperCard.kt`:

```kotlin
@Composable
fun WallpaperCard(
    wallpaper: Wallpaper,
    onWallpaperClick: (Wallpaper) -> Unit,
    modifier: Modifier = Modifier,
) {
    ElevatedCard(
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.elevatedCardColors(
            containerColor = MaterialTheme.colorScheme.surfaceContainerLow,
        ),
        elevation = CardDefaults.elevatedCardElevation(defaultElevation = 2.dp),
        modifier = modifier
            .fillMaxWidth()
            .clickable { onWallpaperClick(wallpaper) },
    ) {
        Column {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .aspectRatio(0.72f)
                    .clip(RoundedCornerShape(20.dp)),
            ) {
                // Placeholder warna latar
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(MaterialTheme.colorScheme.surfaceContainerHigh)
                )

                // Scrim Gradient (Gelap di atas dan bawah)
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(
                            Brush.verticalGradient(
                                0.0f to Color.Black.copy(alpha = 0.35f),
                                0.25f to Color.Transparent,
                                0.75f to Color.Transparent,
                                1.0f to Color.Black.copy(alpha = 0.45f),
                            )
                        ),
                )

                // Author Badge
                Surface(
                    shape = RoundedCornerShape(10.dp),
                    color = Color.Black.copy(alpha = 0.45f),
                    modifier = Modifier
                        .align(Alignment.BottomStart)
                        .padding(8.dp),
                ) {
                    Text(
                        text = wallpaper.author,
                        style = MaterialTheme.typography.labelSmall,
                        color = Color.White,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp),
                    )
                }
            }

            // Info Judul
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(12.dp),
            ) {
                Text(
                    text = wallpaper.title,
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurface,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                )
            }
        }
    }
}
```

---

## Langkah 4: Tampilkan Kartu di `HomeScreen.kt`

Buka berkas `app/src/main/kotlin/com/gdgoc/luminawalls/ui/screens/home/HomeScreen.kt`:

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
    ) {
        LazyVerticalGrid(
            columns = GridCells.Fixed(2),
            contentPadding = PaddingValues(14.dp),
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

Jalankan ke HP (`Shift + F10`). Uji coba tombol alur wizard hingga berpindah ke `HomeScreen`.

---

## Langkah 5: Simpan ke Git & Push

```bash
git status
git add .
git commit -m "feat(sesi-2): implement setup wizard, state gateway, and initial stacking cards"
git push origin main
```
