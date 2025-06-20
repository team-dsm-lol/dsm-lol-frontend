'use client';

import React, { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { userApi } from '@/lib/api';

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const router = useRouter();
  const { 
    isAuthenticated, 
    isLoading, 
    setUser, 
    setLoading, 
    checkAuth,
    logout 
  } = useAuthStore();
  
  const [connectionError, setConnectionError] = React.useState(false);

  useEffect(() => {
    const initAuth = async () => {
      console.log('AuthGuard: 인증 초기화 시작, isLoading:', isLoading);
      
      // 이미 로딩이 완료되었다면 리턴
      if (!isLoading) {
        console.log('AuthGuard: 이미 로딩 완료됨');
        return;
      }

      try {
        // 토큰이 있는지 확인
        const hasToken = checkAuth();
        console.log('AuthGuard: 토큰 존재 여부:', hasToken);
        
        if (!hasToken) {
          console.log('AuthGuard: 토큰 없음, 로그인 페이지로 이동');
          logout(); // 상태 초기화
          setLoading(false);
          router.replace('/login'); // push 대신 replace 사용
          return;
        }

        console.log('AuthGuard: 사용자 정보 가져오기 시도');
        // 토큰이 있다면 사용자 정보를 가져오기
        try {
          const response = await userApi.getMyInfo();
          console.log('AuthGuard: 사용자 정보 응답:', response);
          
          if (response.success && response.data) {
            console.log('AuthGuard: 사용자 정보 설정');
            setUser(response.data);
            setLoading(false); // 성공한 경우 로딩 완료
          } else {
            // 토큰이 유효하지 않은 경우
            console.log('AuthGuard: 토큰 유효하지 않음, 로그아웃');
            logout();
            setLoading(false);
            router.replace('/login');
          }
        } catch (apiError) {
          console.error('AuthGuard: API 호출 실패:', apiError);
          
          // 네트워크 오류인지 확인 (백엔드 서버가 꺼져있는 경우)
          const axiosError = apiError as { code?: string; message?: string };
          if (axiosError.code === 'ECONNREFUSED' || axiosError.message?.includes('Network Error') || axiosError.code === 'ERR_NETWORK') {
            console.log('AuthGuard: 백엔드 서버에 연결할 수 없음');
            setConnectionError(true);
            setLoading(false);
            return;
          }
          
          // 인증 오류인 경우 로그인 페이지로 이동
          logout();
          setLoading(false);
          router.replace('/login');
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        logout();
        setLoading(false);
        router.replace('/login');
      }
    };

    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 의존성 배열을 빈 배열로 변경하여 한 번만 실행

  // 연결 오류가 발생한 경우
  if (connectionError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">서버에 연결할 수 없습니다</h2>
          <p className="text-gray-600 mb-4">
            백엔드 서버가 실행되지 않았거나 연결에 문제가 있습니다.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            서버 주소: http://192.168.1.5:8080
          </p>
          <button
            onClick={() => {
              setConnectionError(false);
              setLoading(true);
              window.location.reload();
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  // 로딩 중이거나 인증되지 않은 경우
  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard; 