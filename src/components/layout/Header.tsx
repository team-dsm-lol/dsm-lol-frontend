import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStatus, useLogout } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStatus();
  const logout = useLogout();

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <header className="bg-white border-b border-toss-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="text-2xl font-bold text-toss-blue">
              🎮 DSM LoL 멸망전
            </div>
          </div>

          {/* 사용자 정보 */}
          {user && (
            <div className="flex items-center space-x-4">
              <div className="text-sm text-toss-gray-600">
                {user.name}님 환영합니다!
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleProfileClick}
              >
                프로필
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
              >
                로그아웃
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}; 