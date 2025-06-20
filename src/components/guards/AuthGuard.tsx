import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStatus } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading, needsRiotRegister, user } = useAuthStatus();

  useEffect(() => {
    console.log('AuthGuard 상태 체크:', {
      isAuthenticated,
      isLoading,
      needsRiotRegister,
      currentPath: location.pathname,
      hasUser: !!user
    });

    if (!isLoading) {
      // 인증되지 않은 경우 로그인 페이지로
      if (!isAuthenticated) {
        console.log('인증되지 않음 - 로그인 페이지로 이동');
        navigate('/login', { replace: true });
        return;
      }

      // 현재 페이지가 이미 riot-register인 경우는 리디렉션 하지 않음
      if (location.pathname === '/riot-register') {
        console.log('이미 Riot 등록 페이지에 있음');
        return;
      }

      // Riot 등록이 필요한 경우
      if (needsRiotRegister) {
        console.log('Riot 계정 연동 필요 - Riot 등록 페이지로 이동');
        navigate('/riot-register', { replace: true });
        return;
      }

      // Riot 등록이 완료된 상태에서 riot-register 페이지에 있는 경우
      if (!needsRiotRegister && location.pathname === '/riot-register') {
        console.log('Riot 계정 연동 완료 - 홈으로 이동');
        navigate('/', { replace: true });
        return;
      }
    }
  }, [isAuthenticated, isLoading, needsRiotRegister, navigate, location.pathname, user]);

  // 로딩 중
  if (isLoading) {
    console.log('AuthGuard 로딩 중...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 인증되지 않은 경우
  if (!isAuthenticated) {
    console.log('AuthGuard: 인증되지 않음');
    return null;
  }

  console.log('AuthGuard: 인증 완료, children 렌더링');
  return <>{children}</>;
}; 