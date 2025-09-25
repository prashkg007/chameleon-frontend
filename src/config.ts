// Environment-based configuration
const config = {
  // Use environment variable or fallback to localhost for development
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  appEnv: import.meta.env.VITE_APP_ENV || 'development',
  
  // Cognito configuration
  cognito: {
    domain: import.meta.env.VITE_COGNITO_DOMAIN || 'ap-south-16aqpga9c3.auth.ap-south-1.amazoncognito.com',
    clientId: import.meta.env.VITE_COGNITO_CLIENT_ID || '20c4860ta5pmnmmn8nle519oth',
    redirectUri: import.meta.env.VITE_COGNITO_REDIRECT_URI || `${window.location.origin}/auth/callback`
  }
};

export default config;