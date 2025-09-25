// Environment-based configuration
const config = {
  // Use environment variable or fallback to localhost for development
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  appEnv: import.meta.env.VITE_APP_ENV || 'development'
};

export default config;