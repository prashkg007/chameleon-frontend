import { Link, NavLink } from 'react-router-dom'
import { useState, useEffect } from 'react'
import config from '../config';

// PKCE helper functions
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

export default function Layout({ children }: { children: React.ReactNode }) {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [userName, setUserName] = useState<string>('');

	useEffect(() => {
		// Check login status via JWT tokens
		const checkLoginStatus = () => {
			try {
				const accessToken = localStorage.getItem('accessToken');
				const idToken = localStorage.getItem('idToken');
				
				if (accessToken && idToken) {
					// Decode JWT to get user info
					const tokenParts = idToken.split('.');
					if (tokenParts.length !== 3) {
						setIsLoggedIn(false);
						setUserName('');
						return;
					}
					const payload = JSON.parse(atob(tokenParts[1]));
					const isExpired = payload.exp * 1000 < Date.now();
					
					if (!isExpired) {
						setIsLoggedIn(true);
						setUserName(payload.name || payload.email || 'User');
					} else {
						// Token expired, clear storage
						localStorage.removeItem('accessToken');
						localStorage.removeItem('idToken');
						localStorage.removeItem('refreshToken');
						setIsLoggedIn(false);
						setUserName('');
					}
				} else {
					setIsLoggedIn(false);
					setUserName('');
				}
			} catch (error) {
				console.error('Error checking auth status:', error);
				setIsLoggedIn(false);
				setUserName('');
			}
		};
		
		checkLoginStatus();
		
		// Listen for storage changes (when user logs in/out in another tab)
		const handleStorageChange = () => {
			checkLoginStatus();
		};
		window.addEventListener('storage', handleStorageChange);
		
		return () => {
			window.removeEventListener('storage', handleStorageChange);
		};
	}, []);

	const handleLoginClick = async (e: React.MouseEvent) => {
		e.preventDefault();
		try {
			// Generate PKCE
			const codeVerifier = generateCodeVerifier();
			const codeChallenge = await generateCodeChallenge(codeVerifier);
			// Generate state and nonce
			const state = generateSecureRandom();
			const nonce = generateSecureRandom();
			// Persist for callback validation
			sessionStorage.setItem('pkce_code_verifier', codeVerifier);
			sessionStorage.setItem('oauth_state', state);
			sessionStorage.setItem('oauth_nonce', nonce);

			// Build Cognito Hosted UI URL directly
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
		} catch (error) {
			console.error('Error initiating login:', error);
		}
	};

	const handleLogoutClick = async (e: React.MouseEvent) => {
		e.preventDefault();
		try {
			// Clear local storage
			localStorage.removeItem('accessToken');
			localStorage.removeItem('idToken');
			localStorage.removeItem('refreshToken');
			
			// Clear session storage
			sessionStorage.removeItem('pkce_code_verifier');
			sessionStorage.removeItem('oauth_state');
			sessionStorage.removeItem('oauth_nonce');
			
			// Update login state immediately
			setIsLoggedIn(false);
			setUserName('');
			
			// Trigger storage event for other components
			window.dispatchEvent(new Event('storage'));
			
			// Redirect to Cognito logout URL
			const logoutUrl = `https://${config.cognito.domain}/logout?client_id=${config.cognito.clientId}&logout_uri=${encodeURIComponent(window.location.origin)}`;
			window.location.href = logoutUrl;
		} catch (error) {
			console.error('Error during logout:', error);
			// Clear local storage anyway and update state
			localStorage.removeItem('accessToken');
			localStorage.removeItem('idToken');
			localStorage.removeItem('refreshToken');
			sessionStorage.removeItem('pkce_code_verifier');
			sessionStorage.removeItem('oauth_state');
			sessionStorage.removeItem('oauth_nonce');
			setIsLoggedIn(false);
			setUserName('');
			window.location.href = '/';
		}
	};

	return (
		<div>
			<header className="header">
				<div className="container nav">
					<Link to="/" style={{ fontWeight: 700 }}>Chameleon</Link>
					<div className="grow" />
					<nav className="nav">
						<NavLink to="/pricing">Pricing</NavLink>
						{isLoggedIn ? (
							<>
								<span style={{ marginRight: '16px', color: '#666' }}>Hello, {userName}</span>
								<a href="#" onClick={handleLogoutClick}>Logout</a>
							</>
						) : (
							<a href="#" onClick={handleLoginClick}>Login</a>
						)}
						<Link to="/subscribe" className="btn">Subscribe</Link>
					</nav>
				</div>
			</header>
			<main className="container" style={{ paddingTop: 24 }}>{children}</main>
			<footer className="container small" style={{ padding: '24px 0' }}>
				<div>© {new Date().getFullYear()} Chameleon. All rights reserved.</div>
			</footer>
		</div>
	)
}



