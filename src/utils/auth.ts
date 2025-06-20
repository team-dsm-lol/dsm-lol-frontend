import Cookies from 'js-cookie';

const TOKEN_KEY = 'auth_token';

// 토큰 저장
export const setAuthToken = (token: string): void => {
  Cookies.set(TOKEN_KEY, token, { 
    expires: 7, // 7일
    secure: import.meta.env.PROD, // Vite 환경 변수 사용
    sameSite: 'strict'
  });
};

// 토큰 가져오기
export const getAuthToken = (): string | undefined => {
  return Cookies.get(TOKEN_KEY);
};

// 토큰 제거
export const removeAuthToken = (): void => {
  Cookies.remove(TOKEN_KEY);
};

// 로그인 여부 확인
export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  return !!token;
};

// JWT 토큰 디코딩 (단순 파싱, 검증 안함)
export const decodeToken = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Token decode error:', error);
    return null;
  }
};

// 토큰 만료 확인
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

// 유효한 토큰인지 확인
export const isValidToken = (): boolean => {
  const token = getAuthToken();
  if (!token) return false;
  return !isTokenExpired(token);
}; 