---
title: "Sesi 4: Material 3 Design: Tokens, Component Reuse & Contributors Screen"
description: "Panduan koding Sesi 4: komponen reusable WallpaperTag, tombol Back seragam, dan implementasi ContributorsScreen."
---

## Langkah 1: Ekstraksi Komponen `WallpaperTag` di `WallpaperCard.kt`

Buka berkas `app/src/main/kotlin/com/gdgoc/luminawalls/ui/components/WallpaperCard.kt`.

Tambahkan fungsi `WallpaperTag` berikut:

```kotlin
@Composable
fun WallpaperTag(
    text: String,
    modifier: Modifier = Modifier,
) {
    Surface(
        shape = RoundedCornerShape(8.dp),
        color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.8f),
        modifier = modifier,
    ) {
        Text(
            text = text,
            style = MaterialTheme.typography.labelSmall,
            fontWeight = FontWeight.Medium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
        )
    }
}
```

Panggil `WallpaperTag` di dalam `Column` info `WallpaperCard`:

```kotlin
FlowRow(
    horizontalArrangement = Arrangement.spacedBy(4.dp),
    verticalArrangement = Arrangement.spacedBy(4.dp),
) {
    wallpaper.tags.take(2).forEach { tag ->
        WallpaperTag(text = tag)
    }
}
```

---

## Langkah 2: Tombol Navigasi Back Seragam

Pastikan tombol kembali di sub-layar (`SettingsScreen` dan `PreviewScreen`) membaca string resource `R.string.action_back`:

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

---

## Langkah 3: Merakit Layar `ContributorsScreen.kt`

Buka berkas `app/src/main/kotlin/com/gdgoc/luminawalls/ui/screens/contributors/ContributorsScreen.kt`:

```kotlin
@Composable
fun ContributorsScreen(
    contributors: List<Contributor>,
    modifier: Modifier = Modifier,
) {
    LuminaScreenScaffold(
        title = stringResource(R.string.about_title),
        subtitle = stringResource(R.string.about_subtitle),
        modifier = modifier,
    ) {
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(start = 16.dp, end = 16.dp, top = 16.dp, bottom = 100.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
        ) {
            // 1. Hero Card
            item {
                LuminaHeroCard(
                    description = stringResource(R.string.about_hero_desc)
                )
            }

            // 2. Section Tim GDGoC
            item {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(
                        text = stringResource(R.string.about_team_title),
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurface,
                    )
                    Text(
                        text = stringResource(R.string.about_team_subtitle),
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )

                    // Kartu Instruktur
                    LuminaListItem(
                        title = stringResource(R.string.about_instructor_name),
                        subtitle = stringResource(R.string.about_instructor_subtitle),
                        trailingContent = {
                            BadgePill(text = stringResource(R.string.about_badge_instructor))
                        }
                    )
                }
            }

            // 3. Section Kontributor
            item {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(
                        text = stringResource(R.string.about_contributors_title),
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurface,
                    )
                    Text(
                        text = stringResource(R.string.about_contributors_subtitle),
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
            }

            items(items = contributors, key = { it.id }) { contributor ->
                ContributorCard(contributor = contributor)
            }
        }
    }
}
```

Jalankan ke HP (`Shift + F10`). Klik tab **About** pada bilah navigasi melayang untuk melihat hasilnya.

---

## Langkah 4: Simpan ke Git & Push

```bash
git status
git add .
git commit -m "feat(sesi-4): implement m3 design tokens, reusable wallpaper tag, and contributors screen"
git push origin main
```
