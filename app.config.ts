import { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  name: 'Packrat',
  slug: 'packrat',
  version: '2.0.0',
  scheme: 'packrat',
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/favicon.png',
  },
  plugins: ['expo-router'],
  experiments: {
    typedRoutes: true,
    tsconfigPaths: true,
  },
  orientation: 'portrait',
  icon: './assets/packrat-app-icon-gradient.png',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/splash.png',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.andrewbierman.myexpoapp',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#026A9F',
    },
    package: 'com.andrewbierman.packrat',
  },
  extra: {
    eas: {
      projectId: '267945b1-d9ac-4621-8541-826a2c70576d',
    },
  },

  owner: 'packrat',
});
