import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { getAuthToken, removeAuthToken, isValidToken } from '@/utils/auth';

// API 기본 설정 - 환경변수 사용
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

console.log('API Base URL:', BASE_URL);

// Axios 인스턴스 생성
export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 - 인증 토큰 자동 추가
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();
    
    // 토큰이 있고 유효한 경우 헤더에 추가
    if (token && isValidToken()) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 에러 처리
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // 401 에러 (인증 실패) 처리
    if (error.response?.status === 401) {
      removeAuthToken();
      window.location.href = '/login';
      return;
    }
    
    // 네트워크 에러 처리
    if (!error.response) {
      console.error('Network error:', error.message);
      // 필요시 사용자에게 네트워크 에러 알림
    }
    
    return Promise.reject(error);
  }
);

// API 에러 타입
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// API 에러 처리 유틸리티
export const handleApiError = (error: any): ApiError => {
  if (error.response) {
    // 서버가 응답을 반환한 경우
    return {
      message: error.response.data?.message || '서버 오류가 발생했습니다.',
      status: error.response.status,
      code: error.response.data?.code,
    };
  } else if (error.request) {
    // 요청이 전송되었지만 응답을 받지 못한 경우
    return {
      message: '서버에 연결할 수 없습니다. 네트워크를 확인해주세요.',
    };
  } else {
    // 요청 설정 중 오류가 발생한 경우
    return {
      message: error.message || '알 수 없는 오류가 발생했습니다.',
    };
  }
};

export default apiClient; 