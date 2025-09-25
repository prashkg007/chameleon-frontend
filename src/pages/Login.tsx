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
        const codeVerifier = generateCodeVerifier();
        const codeChallenge = await generateCodeChallenge(codeVerifier);
        sessionStorage.setItem('pkce_code_verifier', codeVerifier);

        const params = new URLSearchParams({
          code_challenge: codeChallenge,
          code_challenge_method: 'S256'
        });
        // Ask backend for hosted UI login URL with PKCE applied
        const resp = await fetch(`${config.apiBaseUrl}/auth/login-url?${params.toString()}`);
        const data = await resp.json();
        if (!data?.success || !data?.loginUrl) {
          throw new Error('Failed to get login URL');
        }
        window.location.href = data.loginUrl;
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
