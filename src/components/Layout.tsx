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

	useEffect(() => {
		// Check login status on mount and when localStorage changes
		const checkLoginStatus = () => {
			setIsLoggedIn(!!localStorage.getItem('accessToken'));
		};
		
		checkLoginStatus();
		
		// Listen for storage changes (when user logs in/out in another tab)
		window.addEventListener('storage', checkLoginStatus);
		
		return () => {
			window.removeEventListener('storage', checkLoginStatus);
		};
	}, []);

	const handleLoginClick = async (e: React.MouseEvent) => {
		e.preventDefault();
		try {
			const codeVerifier = generateCodeVerifier();
			const codeChallenge = await generateCodeChallenge(codeVerifier);
			sessionStorage.setItem('pkce_code_verifier', codeVerifier);

			const params = new URLSearchParams({
				code_challenge: codeChallenge,
				code_challenge_method: 'S256'
			});

			const resp = await fetch(`${config.apiBaseUrl}/auth/login-url?${params.toString()}`);
			const data = await resp.json();
			if (data?.success && data?.loginUrl) {
				window.location.href = data.loginUrl;
			} else {
				console.error('Failed to get login URL:', data);
			}
		} catch (error) {
			console.error('Error initiating login:', error);
		}
	};

	const handleLogoutClick = async (e: React.MouseEvent) => {
		e.preventDefault();
		try {
			const resp = await fetch(`${config.apiBaseUrl}/auth/logout`, {
				method: 'POST'
			});
			const data = await resp.json();
			
			// Clear local storage
			localStorage.removeItem('accessToken');
			localStorage.removeItem('idToken');
			localStorage.removeItem('refreshToken');
			sessionStorage.removeItem('pkce_code_verifier');
			
			// Update login state immediately
			setIsLoggedIn(false);
			
			if (data?.success && data?.logoutUrl) {
				// Redirect to Cognito logout to clear the session
				console.log('Redirecting to Cognito logout:', data.logoutUrl);
				window.location.href = data.logoutUrl;
			} else {
				// If logout URL fails, just reload to clear local state
				console.log('Logout URL failed, just reloading page');
				window.location.reload();
			}
		} catch (error) {
			console.error('Error during logout:', error);
			// Clear tokens anyway and update state
			localStorage.removeItem('accessToken');
			localStorage.removeItem('idToken');
			localStorage.removeItem('refreshToken');
			sessionStorage.removeItem('pkce_code_verifier');
			setIsLoggedIn(false);
			window.location.reload();
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
							<a href="#" onClick={handleLogoutClick}>Logout</a>
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



