class AuthService {
  isAuthenticated(): boolean {
    const accessToken = localStorage.getItem('accessToken');
    const idToken = localStorage.getItem('idToken');
    
    if (!accessToken || !idToken) return false;
    
    try {
      const payload = JSON.parse(atob(idToken.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getIdToken(): string | null {
    return localStorage.getItem('idToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('idToken');
    localStorage.removeItem('refreshToken');
  }
}

export const authService = new AuthService();
