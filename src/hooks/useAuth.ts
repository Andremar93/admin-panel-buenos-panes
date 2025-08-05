export function useAuth() {
  const token = localStorage.getItem('auth_token');
  const userType = JSON.parse(localStorage.getItem('user') || '{}').userType;
  return { isAuthenticated: !!token, userType };
}
