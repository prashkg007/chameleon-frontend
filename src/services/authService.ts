import config from '../config';

function generateCodeVerifier(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode.apply(null, Array.from(array)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function generateSecureRandom(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode.apply(null, Array.from(array)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(digest))))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

class AuthService {
  isAuthenticated(): boolean {
    const accessToken = this.getAccessToken();
    if (!accessToken) return false;
    
    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getIdToken(): string | null {
    return localStorage.getItem('id_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('refresh_token');
  }

  storeTokens(accessToken: string, idToken: string, refreshToken?: string): void {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('id_token', idToken);
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    }
  }

  async redirectToCognito(): Promise<void> {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    const state = generateSecureRandom();
    const nonce = generateSecureRandom();
    
    sessionStorage.setItem('pkce_code_verifier', codeVerifier);
    sessionStorage.setItem('oauth_state', state);
    sessionStorage.setItem('oauth_nonce', nonce);

    const redirectUri = `${window.location.origin}/auth/callback`;
    const params = new URLSearchParams({
      client_id: config.cognito.clientId,
      response_type: 'code',
      scope: 'openid email profile',
      redirect_uri: redirectUri,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      state,
      nonce
    });

    const loginUrl = `https://${config.cognito.domain}/oauth2/authorize?${params.toString()}`;
    window.location.href = loginUrl;
  }

  getUserInfo(): { name: string; email: string } | null {
    const idToken = this.getIdToken();
    if (!idToken) return null;
    
    try {
      const payload = JSON.parse(atob(idToken.split('.')[1]));
      return {
        name: payload.name || payload.email?.split('@')[0] || 'User',
        email: payload.email || ''
      };
    } catch {
      return null;
    }
  }

  logout(): void {
    this.clearTokens();
    const logoutUrl = `https://${config.cognito.domain}/logout?client_id=${config.cognito.clientId}&logout_uri=${encodeURIComponent(window.location.origin)}`;
    window.location.href = logoutUrl;
  }
}

export default new AuthService();
