// Environment-based configuration
const config = {
  appEnv: import.meta.env.VITE_APP_ENV || 'production',
  
  // Cognito configuration
  cognito: {
    domain: import.meta.env.VITE_COGNITO_DOMAIN || 'ap-south-16aqpga9c3.auth.ap-south-1.amazoncognito.com',
    clientId: import.meta.env.VITE_COGNITO_CLIENT_ID || '20c4860ta5pmnmmn8nle519oth',
    redirectUri: import.meta.env.VITE_COGNITO_REDIRECT_URI || 'https://d1540vq6lr6647.cloudfront.net/auth/callback'
  },

  // API configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://32s82kvzrc.execute-api.ap-south-1.amazonaws.com'
  },

  // Download URLs (public CloudFront)
  downloads: {
    macArm64: 'https://stealthbuddy.ai/downloads/macos/stealthbuddy-mac-arm64.dmg',
    macIntel: 'https://stealthbuddy.ai/downloads/macos/stealthbuddy-mac-intel.dmg',
    win: 'https://stealthbuddy.ai/downloads/windows/stealthbuddy-windows.exe'
  }
};

export default config;
