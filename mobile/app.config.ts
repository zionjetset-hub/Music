import 'dotenv/config';
import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'Music',
  slug: 'music',
  scheme: 'music',
  version: '1.0.0',
  orientation: 'portrait',
  platforms: ['ios', 'android', 'web'],
  splash: {
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.example.music',
    infoPlist: {
      NSAppTransportSecurity: {
        NSAllowsArbitraryLoads: true,
      },
    },
  },
  android: {
    package: 'com.example.music',
    permissions: [],
  },
  web: {
    bundler: 'metro',
  },
  extra: {
    eas: {
      projectId: ''
    }
  },
  experiments: {
    typedRoutes: true,
  },
  runtimeVersion: {
    policy: 'appVersion',
  },
  plugins: [],
};

export default config;
