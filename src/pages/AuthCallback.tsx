import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import config from '../config';

export default function AuthCallback() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const hasHandledRef = useRef(false);

  useEffect(() => {
    if (hasHandledRef.current) return; // guard against double-invoke in React 18 StrictMode
    hasHandledRef.current = true;
    const handleCallback = async () => {
      try {
        // Debug: log all URL parameters
        console.log('Callback URL params:', Object.fromEntries(searchParams.entries()));
        console.log('Full URL:', window.location.href);
        
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
          
          console.log('Code verifier found:', !!codeVerifier);
          console.log('State validation:', { returnedState, storedState, match: returnedState === storedState });
          
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
          
          // Exchange code for tokens via backend (more secure)
          const redirectUri = `${window.location.origin}/auth/callback`;
          
          const response = await fetch(`${config.apiBaseUrl}/auth/exchange-token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include', // Include cookies for session management
            body: JSON.stringify({
              code,
              code_verifier: codeVerifier,
              redirect_uri: redirectUri
            })
          });

          const data = await response.json();
          
          if (data.success) {
            // Tokens are now stored as HTTP-only cookies, no need to handle them in localStorage
            console.log('Authentication successful, tokens stored as secure cookies');
            
            // Clean up session storage
            sessionStorage.removeItem('pkce_code_verifier');
            sessionStorage.removeItem('oauth_state');
            sessionStorage.removeItem('oauth_nonce');
            
            // Trigger storage event for other components to update auth state
            window.dispatchEvent(new Event('storage'));
            
            // Small delay to ensure cookie is set before navigation
            setTimeout(() => {
              // Clean URL and redirect
              window.history.replaceState({}, document.title, window.location.pathname);
              navigate('/');
            }, 100);
            return;
          } else {
            throw new Error(data.message || 'Token exchange failed');
          }
        }

        // No valid authentication data found
        console.error('No code parameter found in callback URL');
        setError('No authorization code received. Please try logging in again.');
        
      } catch (err: any) {
        console.error('Auth callback error:', err);
        setError(err.message || 'Authentication failed. Please try again.');
      } finally {
        setLoading(false);
        setProcessing(false);
      }
    };

    handleCallback();
  }, [navigate, searchParams]);

  if (loading) {
    return (
      <div className="callback-container">
        <div className="callback-card">
          <div className="spinner"></div>
          <h2>Completing authentication...</h2>
          <p>Please wait while we finish setting up your account.</p>
        </div>

        <style>{`
          .callback-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
          }

          .callback-card {
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            padding: 40px;
            text-align: center;
            max-width: 400px;
            width: 100%;
          }

          .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #e2e8f0;
            border-top: 4px solid #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          h2 {
            color: #2d3748;
            font-size: 24px;
            font-weight: 600;
            margin: 0 0 12px 0;
          }

          p {
            color: #718096;
            font-size: 16px;
            margin: 0;
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="callback-container">
        <div className="callback-card">
          <div className="error-icon">⚠️</div>
          <h2>Authentication Failed</h2>
          <p>{error}</p>
          <button 
            onClick={() => navigate('/login')}
            className="btn btn-primary"
          >
            Back to Login
          </button>
        </div>

        <style>{`
          .callback-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
          }

          .callback-card {
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            padding: 40px;
            text-align: center;
            max-width: 400px;
            width: 100%;
          }

          .error-icon {
            font-size: 48px;
            margin-bottom: 20px;
          }

          h2 {
            color: #2d3748;
            font-size: 24px;
            font-weight: 600;
            margin: 0 0 12px 0;
          }

          p {
            color: #718096;
            font-size: 16px;
            margin: 0 0 24px 0;
          }

          .btn {
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
          }

          .btn-primary {
            background: #667eea;
            color: white;
          }

          .btn-primary:hover {
            background: #5a67d8;
          }
        `}</style>
      </div>
    );
  }

  return null;
}
