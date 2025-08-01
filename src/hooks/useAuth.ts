export function useAuth() {
  console.log(localStorage);
  const token = localStorage.getItem('auth_token');
  console.log(JSON.parse(localStorage.getItem('user') || '{}'));

  const userType = JSON.parse(localStorage.getItem('user') || '{}').userType;
  return { isAuthenticated: !!token, userType };
}
