import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/utils/cn';

const navItems = [
  { path: '/', label: '홈', icon: '🏠' },
  { path: '/teams', label: '팀 목록', icon: '👥' },
  { path: '/profile', label: '프로필', icon: '👤' },
];

export const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-toss-gray-200 safe-area-pb">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  'flex flex-col items-center justify-center space-y-1 px-4 py-2 rounded-lg transition-colors',
                  isActive
                    ? 'text-toss-blue bg-toss-blue-light'
                    : 'text-toss-gray-500 hover:text-toss-gray-700 hover:bg-toss-gray-100'
                )}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}; 