import React, { useState } from 'react';
import config from '../config';

// Utility functions for PKCE
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
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleLoginClick = async () => {
    setIsRedirecting(true);
    try {
      // Generate PKCE parameters
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);
      
      // Generate state and nonce for security
      const state = generateSecureRandom();
      const nonce = generateSecureRandom();
      
      // Store values for later validation
      sessionStorage.setItem('pkce_code_verifier', codeVerifier);
      sessionStorage.setItem('oauth_state', state);
      sessionStorage.setItem('oauth_nonce', nonce);

      // Build OAuth URL
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
      setIsRedirecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800/40 backdrop-blur-xl p-8 rounded-3xl border border-gray-700/50">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Sign In</h1>
          <p className="text-gray-300">Click the button below to sign in with your account.</p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
        
        <button 
          onClick={handleLoginClick} 
          disabled={isRedirecting}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRedirecting ? 'Redirecting...' : 'Sign In'}
        </button>
        
        <div className="mt-6 text-center">
          <a href="/" className="text-gray-400 hover:text-white transition-colors">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}