# App Store Deployment Guide

This guide explains how to publish the Music app to iOS App Store, Google Play Store, and alternative Android app stores (Amazon AppStore, Huawei AppGallery).

## Prerequisites

### 1. EAS Account Setup
1. Create an Expo account at https://expo.dev
2. Install EAS CLI: `npm install -g eas-cli`
3. Login: `eas login`
4. Initialize your project: `cd mobile && eas init --id YOUR_PROJECT_ID`
5. Update `app.config.ts` with your EAS project ID

### 2. App Store Developer Accounts
- **Apple**: [Apple Developer Program](https://developer.apple.com/programs/) ($99/year)
- **Google Play**: [Google Play Console](https://play.google.com/console) ($25 one-time fee)
- **Amazon**: [Amazon Developer Console](https://developer.amazon.com/) (Free)
- **Huawei**: [Huawei AppGallery Connect](https://developer.huawei.com/) (Free)

### 3. Update Bundle Identifiers
Before building, update the bundle identifiers in `mobile/app.config.ts`:
```typescript
ios: {
  bundleIdentifier: 'com.yourcompany.music', // Change this
},
android: {
  package: 'com.yourcompany.music', // Change this
}
```

## GitHub Secrets Configuration

Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

### Required for Building
- `EXPO_TOKEN`: Your Expo access token (get from https://expo.dev/settings/access-tokens)

### Required for iOS Submission
- `EXPO_APP_STORE_CONNECT_ISSUER_ID`: App Store Connect API issuer ID
- `EXPO_APP_STORE_CONNECT_KEY_ID`: App Store Connect API key ID
- `EXPO_APP_STORE_CONNECT_PRIVATE_KEY`: App Store Connect API private key (base64 encoded)

**How to get App Store Connect API credentials:**
1. Go to [App Store Connect](https://appstoreconnect.apple.com/)
2. Users and Access → Keys → App Store Connect API
3. Generate a new key with "Developer" access
4. Download the .p8 file and note the Issuer ID and Key ID
5. Encode the .p8 file: `cat AuthKey_KEYID.p8 | base64`

### Required for Android Submission
- `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON`: Google Play service account JSON key

**How to get Google Play service account:**
1. Go to [Google Play Console](https://play.google.com/console)
2. Setup → API access
3. Create a service account
4. Grant "Release to production, exclude devices, and use Play App Signing" permission
5. Download the JSON key file
6. Copy the entire JSON content into the GitHub secret

### Optional Environment Variables
- `EXPO_PUBLIC_API_URL`: Backend API URL (can be set as a variable or secret)

## Building the App

### Local Build (Development)
```bash
cd mobile
eas build --profile development --platform ios
eas build --profile development --platform android
```

### Production Build via CI/CD

The GitHub workflow (`.github/workflows/eas-build.yml`) automatically builds when you:

1. **Tag a release**: `git tag v1.0.0 && git push origin v1.0.0`
2. **Manual trigger**: Go to Actions → "Mobile - EAS build and submit" → Run workflow

The workflow will:
- Build iOS app (AAB for App Store)
- Build Android app bundle (AAB for Google Play)
- Build Android APKs (for Amazon and Huawei)

### Manual Build
```bash
cd mobile
npm run build  # Builds for all platforms
npm run build:apk  # Builds APKs for Amazon/Huawei
```

## Submitting to App Stores

### Automated Submission via CI/CD

To enable automatic submission after builds complete:

1. Ensure all required secrets are configured (see above)
2. Run the workflow with submission enabled:
   - Go to Actions → "Mobile - EAS build and submit"
   - Click "Run workflow"
   - Set "enable_submit" to `true`
   - Click "Run workflow"

This will:
- Submit iOS build to TestFlight
- Submit Android AAB to Google Play (internal track)

### Manual Submission

#### iOS (TestFlight)
```bash
cd mobile
eas submit -p ios --latest
```

#### Android (Google Play)
```bash
cd mobile
eas submit -p android --latest --track internal
```

#### Amazon AppStore
1. Download the APK from EAS build dashboard
2. Go to [Amazon Developer Console](https://developer.amazon.com/apps-and-games/console/apps/list.html)
3. Create a new app or select existing
4. Upload the APK manually

#### Huawei AppGallery
1. Download the APK from EAS build dashboard
2. Go to [Huawei AppGallery Connect](https://developer.huawei.com/consumer/en/service/josp/agc/index.html)
3. Create a new app or select existing
4. Upload the APK manually

## App Store Listings

### Prepare Assets
You'll need to prepare store listing assets for each platform:

- **App Icon**: 1024x1024px (already at `mobile/assets/icon.png`)
- **Screenshots**: Various sizes per platform
- **Feature Graphic**: 1024x500px (Google Play)
- **App Preview Video**: Optional but recommended

### Store Listing Information
Prepare the following information:
- App name
- Short description (80 characters)
- Full description
- Keywords/Search terms
- Privacy policy URL
- Support URL
- Marketing URL (optional)
- App category
- Content rating

## Testing

### TestFlight (iOS)
After submitting to TestFlight:
1. Go to [App Store Connect](https://appstoreconnect.apple.com/)
2. Select your app → TestFlight
3. Add internal/external testers
4. Distribute the build

### Internal Testing (Android)
After submitting to internal track:
1. Go to [Google Play Console](https://play.google.com/console)
2. Select your app → Testing → Internal testing
3. Add testers via email list or Google Groups
4. Share the opt-in link with testers

## Troubleshooting

### Build Fails
- Check EAS build logs: `eas build:list`
- Ensure all credentials are properly configured: `eas credentials`
- Verify bundle identifiers match in app.config.ts and developer portals

### Submission Fails
- **iOS**: Ensure App Store Connect API credentials are correct and have proper permissions
- **Android**: Verify service account has proper permissions in Google Play Console
- Check that you've accepted all required agreements in the respective developer consoles

### Missing Dependencies
If the build complains about missing packages:
```bash
cd mobile
npm install
```

## Version Management

When releasing a new version:

1. Update version in `mobile/app.config.ts`:
   ```typescript
   version: '1.0.1',  // Increment this
   ```

2. For Android, you may also need to increment `versionCode` (add to android config):
   ```typescript
   android: {
     versionCode: 2,  // Increment for each release
     // ...
   }
   ```

3. For iOS, you may need to increment `buildNumber` (add to ios config):
   ```typescript
   ios: {
     buildNumber: '2',  // Increment for each release
     // ...
   }
   ```

4. Commit and tag:
   ```bash
   git add mobile/app.config.ts
   git commit -m "Bump version to 1.0.1"
   git tag v1.0.1
   git push origin main --tags
   ```

## Resources

- [Expo Application Services (EAS)](https://docs.expo.dev/eas/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [EAS Submit](https://docs.expo.dev/submit/introduction/)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Policy](https://play.google.com/about/developer-content-policy/)
- [Amazon Appstore Guidelines](https://developer.amazon.com/docs/app-submission/understanding-submission.html)
- [Huawei AppGallery Review Guidelines](https://developer.huawei.com/consumer/en/doc/start/review-0000001053142417)
