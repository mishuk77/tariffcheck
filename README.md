# TariffCheck — US Import Duty Calculator

A React Native (Expo) mobile app that calculates US import duties and tariffs for goods from any country.

## Quick Start (Local)

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go on your phone.

---

## CI/CD Pipeline

This project uses **zero local builds**. Everything runs in the cloud via GitHub Actions + EAS Build.

### How It Works

```
Push to main
  ├─ JS-only changes → OTA Update (seconds, no rebuild)
  └─ Native changes  → Full EAS Build (APK/IPA, ~10 min)
```

| Workflow | Trigger | What it does |
|----------|---------|--------------|
| `preview.yml` | Push to `main` (native files change) | Runs quality gates → EAS Build → posts APK link on commit |
| `update.yml` | Push to `main` (JS/TS files only) | Runs quality gates → EAS OTA Update → app updates on next launch |
| `build-ios.yml` | Manual dispatch | On-demand iOS build (preview or production profile) |

### Quality Gates (run before every build/update)

- **TypeScript check**: `npx tsc --noEmit`
- **ESLint**: `npx eslint . --ext .ts,.tsx --max-warnings 0`
- **Jest tests**: `npx jest --ci`

---

## Setup Guide (One-Time)

### 1. Create an Expo Account

Go to [expo.dev](https://expo.dev) and sign up (free).

### 2. Link the Project

```bash
npm install -g eas-cli
eas login
eas init
```

`eas init` will create your project on Expo's servers and fill in the `projectId` in `app.json`. **Commit the updated `app.json` after this step.**

### 3. Set GitHub Secrets

Go to your repo → Settings → Secrets and variables → Actions → New repository secret:

| Secret Name | Where to get it |
|------------|-----------------|
| `EXPO_TOKEN` | [expo.dev/settings/access-tokens](https://expo.dev/accounts/[your-username]/settings/access-tokens) — create a "Robot" token |

### 4. First Build

Trigger the first build manually from the Actions tab:
- Go to Actions → "Preview Build" → "Run workflow" → select `android`
- This creates the initial APK (~10 min)
- The build URL will be posted as a comment on the commit

### 5. Install on Your Phone

- Open the build URL on your Android phone
- Download and install the APK (you may need to allow "Install from unknown sources")
- Future JS changes will update automatically via OTA — no reinstall needed

---

## Testing Builds

### Android (APK — easiest)

1. **Push code to `main`** (GitHub web editor, Codespaces, or local)
2. **Wait for GitHub Action** to complete (~10 min for full build, seconds for OTA)
3. **Check the commit** on GitHub — a comment will have the download link
4. **Open the link on your phone** → download APK → install → done

For subsequent JS-only changes, the app updates automatically on next launch (OTA update).

### Android (Expo Go — for development builds)

1. Install **Expo Go** from Google Play Store
2. Run `npx expo start` on any machine (local, Codespaces, etc.)
3. Scan the QR code with Expo Go

### iOS (Ad-Hoc — requires Apple Developer account)

1. **Register your device**: run `eas device:create` and follow the link on your iPhone to install the provisioning profile
2. **Trigger an iOS build**: Go to Actions → "iOS Build (Manual)" → Run workflow
3. **Download**: open the build URL on your iPhone to install

### OTA Updates (instant, no reinstall)

Once you have a build installed on your phone:
1. Edit any `.ts`/`.tsx` file and push to `main`
2. The `update.yml` workflow runs automatically
3. **Open the app** — it pulls the update on launch (takes seconds)
4. No need to re-download or reinstall anything

This is the fast path for UI changes, data updates, bug fixes — anything that doesn't change native dependencies.

### When Does a Full Rebuild Happen?

A full EAS Build is triggered when these files change:
- `package.json` or `package-lock.json` (new native dependencies)
- `app.json` or `eas.json` (config changes)
- `ios/` or `android/` directories (native code)

Everything else (`.ts`, `.tsx`, `.json` in `src/`, etc.) goes through the fast OTA path.

---

## Project Structure

```
├── .github/workflows/     # CI/CD pipelines
│   ├── preview.yml        # Full build on native changes
│   ├── update.yml         # OTA update on JS changes
│   └── build-ios.yml      # Manual iOS builds
├── src/
│   ├── components/        # Reusable UI components
│   ├── data/              # Tariff data (countries, categories)
│   ├── navigation/        # React Navigation config
│   ├── screens/           # App screens
│   ├── store/             # Zustand state management
│   ├── theme/             # Colors, typography
│   ├── types/             # TypeScript interfaces
│   └── utils/             # Calculator, formatters, share
├── __tests__/             # Unit tests
├── app.json               # Expo config
├── eas.json               # EAS Build profiles
└── package.json
```

---

## EAS Build Profiles

| Profile | Use Case | Output |
|---------|----------|--------|
| `development` | Dev builds with Expo Dev Client | APK (Android) / internal IPA (iOS) |
| `preview` | Testable builds for QA | APK (Android) / ad-hoc IPA (iOS) |
| `production` | Store submission | AAB (Android) / store IPA (iOS) |

---

## Environment Variables

See `.env.example` for all required variables. For CI/CD, set these as:
- **GitHub Secrets** (for GitHub Actions): `EXPO_TOKEN`
- **EAS Secrets** (for build-time): `eas secret:create --name MY_VAR --value "..."`
