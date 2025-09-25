class AuthService {
  handleOAuthCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const refresh = urlParams.get('refresh');

    if (token && refresh) {
      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', refresh);
      window.history.replaceState({}, document.title, window.location.pathname);
      return { accessToken: token, refreshToken: refresh };
    }
    return null;
  }
}

export const authService = new AuthService();
