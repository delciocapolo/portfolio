const TOKEN_FIELD = "b954-9d255293ac5a";

export const getToken = () => {
  return localStorage.getItem(TOKEN_FIELD);
};

export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_FIELD, token);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_FIELD);
};

export const hasToken = () => {
  const token = localStorage.getItem(TOKEN_FIELD);
  return !!token;
};
