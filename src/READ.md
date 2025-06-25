# My Minimal App

This is a React Native app using Expo, with sensor visualizations and 3D graphics.

## Getting Started

### 1. Install dependencies

```sh
npm install
```

### 2. Start the development server (with cache clean)

```sh
npx expo start -c
```

- This will open the Expo Dev Tools in your browser.
- You can scan the QR code with Expo Go on your device, or run on an emulator.

### 3. Build a production app (EAS Build)

Expo Application Services (EAS) is the recommended way to build production binaries.

#### Install EAS CLI (if you haven't):

```sh
npm install -g eas-cli
```

#### Login to Expo:

```sh
eas login
```

#### Build for Android:

```sh
eas build --platform android
```

#### Build for iOS:

```sh
eas build --platform ios
```

- Follow the prompts to configure your project if this is your first EAS build.
- The build artifacts will be available on the Expo website.

## Notes

- To clear the Metro bundler cache, always use `npx expo start -c`.
- For best results, use a real device for sensor features.
- Shake-to-open dev menu cannot be disabled in Expo Go, but is disabled in production builds.

## Project Structure

- `src/` — App source code (sensors, visualizations, etc.)
- `android/` and `ios/` — Native project files (for bare workflow or EAS builds)
- `package.json` — Project dependencies and scripts

---

For more Expo CLI and EAS Build documentation, see [Expo Docs](https://docs.expo.dev/).

eas build --profile preview --platform android