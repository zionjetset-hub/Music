# Music
Music Distribution globally

## Project Structure

- **mobile/**: Expo React Native mobile application
- **backend/**: Node.js backend API
- **.github/workflows/**: CI/CD workflows for automated builds and deployments

## Getting Started

### Mobile App

```bash
cd mobile
npm install
npm start
```

### Backend

```bash
cd backend
npm install
npm start
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on publishing the app to:
- Apple App Store (iOS)
- Google Play Store (Android)
- Amazon AppStore (Android APK)
- Huawei AppGallery (Android APK)

## CI/CD

The repository includes a GitHub Actions workflow that automatically:
- Builds the mobile app for all platforms using EAS (Expo Application Services)
- Submits to app stores when triggered (requires proper secrets configuration)
- Creates APK builds for alternative Android app stores

See [DEPLOYMENT.md](./DEPLOYMENT.md) for required GitHub secrets configuration.

