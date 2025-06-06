import type { CapacitorConfig } from '@capacitor/cli';

enum KeyboardResize {
  Body = 'body',
  Ionic = 'ionic',
  None = 'none',
}

const config: CapacitorConfig = {
  appId: 'salim.chat.app',
  appName: 'chat',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    Keyboard: {
      resize: KeyboardResize.Body, // Use a valid resize option
    },
    SplashScreen: {
      launchShowDuration: 4000,
      launchAutoHide: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
};

export default config;
