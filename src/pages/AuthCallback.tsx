import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import config from '../config';
import authService from '../services/authService';

function AuthCallback() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hasHandledRef = useRef(false);

  useEffect(() => {
    if (hasHandledRef.current) return;
    hasHandledRef.current = true;
    
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const returnedState = searchParams.get('state');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        
        if (error) {
          console.error('OAuth error:', error, errorDescription);
          setError(`Authentication failed: ${errorDescription || error}`);
          return;
        }
        
        if (code) {
          // Get stored values from session storage
          const codeVerifier = sessionStorage.getItem('pkce_code_verifier');
          const storedState = sessionStorage.getItem('oauth_state');
          const storedNonce = sessionStorage.getItem('oauth_nonce');
          
          // Validate state parameter to prevent CSRF attacks
          if (!returnedState || !storedState || returnedState !== storedState) {
            console.error('State validation failed');
            setError('Authentication failed: Invalid state parameter. This may be a security issue.');
            return;
          }
          
          if (!storedNonce) {
            console.error('Nonce not found in session storage');
            setError('Authentication failed: Missing nonce. Please try logging in again.');
            return;
          }
          
          // Exchange code for tokens
          const redirectUri = `${window.location.origin}/auth/callback`;
          
          const tokenResponse = await fetch(`https://${config.cognito.domain}/oauth2/token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              grant_type: 'authorization_code',
              client_id: config.cognito.clientId,
              code,
              code_verifier: codeVerifier || '',
              redirect_uri: redirectUri
            })
          });

          const data = await tokenResponse.json();
          
          if (data.access_token) {
            // Store tokens
            authService.storeTokens(
              data.access_token,
              data.id_token,
              data.refresh_token
            );
            
            // Clean up session storage
            sessionStorage.removeItem('pkce_code_verifier');
            sessionStorage.removeItem('oauth_state');
            sessionStorage.removeItem('oauth_nonce');
            
            // Redirect to home
            navigate('/', { replace: true });
          } else {
            console.error('Token exchange failed:', data);
            setError('Authentication failed: Unable to obtain access token.');
          }
        } else {
          setError('Authentication failed: No authorization code received.');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        setError('Authentication failed: An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Processing authentication...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-gray-800/40 backdrop-blur-xl p-8 rounded-3xl border border-gray-700/50 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Authentication Failed</h1>
            <p className="text-gray-300 mb-6">{error}</p>
          </div>
          
          <div className="space-y-4">
            <button 
              onClick={() => navigate('/login')}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300"
            >
              Try Again
            </button>
            <button 
              onClick={() => navigate('/')}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default AuthCallback;