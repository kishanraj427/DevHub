const TOKEN_KEY = "devhub_token";

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);

export const setToken = (token: string): void =>
  void localStorage.setItem(TOKEN_KEY, token);

export const clearToken = (): void => void localStorage.removeItem(TOKEN_KEY);
