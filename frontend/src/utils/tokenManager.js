import { TOKEN_KEY, REFRESH_TOKEN_KEY } from './constants';

export const tokenManager = {
  getAccessToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  setAccessToken: (token) => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  getRefreshToken: () => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setRefreshToken: (token) => {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  clearTokens: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  hasTokens: () => {
    return !!(tokenManager.getAccessToken() && tokenManager.getRefreshToken());
  }
};

