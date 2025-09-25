import { useEffect, useState } from 'react';
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

export default function Login() {
  const [error, setError] = useState('');

  useEffect(() => {
    const goToHostedUi = async () => {
      try {
        // Generate PKCE parameters
        const codeVerifier = generateCodeVerifier();
        const codeChallenge = await generateCodeChallenge(codeVerifier);
        
        // Generate state and nonce for security
        const state = generateSecureRandom();
        const nonce = generateSecureRandom();
        
        // Store values for later validation (state validation happens on frontend)
        sessionStorage.setItem('pkce_code_verifier', codeVerifier);
        sessionStorage.setItem('oauth_state', state);
        sessionStorage.setItem('oauth_nonce', nonce);

        // Build OAuth URL directly
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
      } catch (e: any) {
        setError(e?.message || 'Failed to start login');
      }
    };
    goToHostedUi();
  }, []);

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Redirecting to sign in…</h1>
        {error && <div className="error">{error}</div>}
      </div>
    </div>
  );
}
