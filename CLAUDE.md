# CLAUDE.md - Project Intelligence for Claude Code

## Project Overview
TariffCheck is a React Native (Expo SDK 54) mobile app for calculating US import tariffs.
Tech stack: Expo managed workflow, TypeScript, Zustand, React Navigation, StyleSheet.

## Known Build Pitfalls (React Native / Expo)

### Android-specific
- **Never use `presentationStyle="pageSheet"` on `<Modal>`** — iOS-only prop, crashes Android with `java.lang.String cannot be cast to java.lang.Boolean`
- **Avoid `edgeToEdgeEnabled: true` in app.json** — causes the same String→Boolean cast error on Android/Expo Go
- **`gap` in StyleSheet** may not work on older Android — use `marginTop`/`marginBottom` instead
- **`contentStyle` on Stack.Navigator screenOptions** can cause casting issues on Android — set background color on the screen component instead
- **`keyboardType="decimal-pad"`** shows comma instead of period on some Android devices — always normalize input by replacing commas with periods

### EAS Build Compatibility
- **`@react-native-async-storage/async-storage` v3** has a Maven dependency (`org.asyncstorage.shared_storage:storage-android`) not available in EAS Build caches — use v2 (`^2.1.0`)
- **`expo-updates` version must match Expo SDK** — SDK 54 uses `expo-updates@~29.0.16`, NOT v55 (which targets a newer SDK). v55 causes Kotlin compiler errors.
- **Always check version compatibility** when adding native dependencies — run `npx expo install <package>` locally first if possible, or check the Expo SDK compatibility docs

### General React Native
- **iOS-only props crash Android silently** — always check React Native docs for platform-specific props
- **Binary assets (PNG icons) break Expo Snack imports** — Snack can't handle multi-file projects with assets
- **Branch names with `/` break Expo Snack git imports** — use flat branch names for Snack compatibility

## CI/CD Architecture
- Push to main triggers GitHub Actions → EAS Build (native changes) or EAS Update (JS-only changes)
- Quality gates run before every build: TypeScript check, ESLint, Jest
- Three EAS profiles: development, preview (APK), production (AAB for store)
- `EXPO_TOKEN` must be set as a GitHub Secret for CI/CD to work

## Project Structure
- `/src/data/countries.json` — 189 countries with tariff rates (edit here to update rates)
- `/src/data/categories.json` — 20 product categories
- `/src/utils/calculator.ts` — Core tariff calculation logic (all business rules here)
- `/__tests__/calculator.test.ts` — Unit tests for tariff stacking scenarios

## Tariff Calculation Rules
- All tariff types applied to product value (NOT compounded on each other)
- USMCA zeroes reciprocal tariff only — Section 232 still applies
- China is NOT de minimis eligible
- Section 301 is China-only, Section 232 is category-specific
- MPF: formal (≥$2500) = 0.3464% with min $31.67 / max $614.35; informal = $5.00
