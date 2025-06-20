import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';

const QUICK_ACTIONS = [
  {
    icon: '👥',
    label: '팀 목록',
    path: '/teams',
  },
  {
    icon: '👤',
    label: '내 프로필',
    path: '/profile',
  },
] as const;

export const QuickActionsSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold text-toss-gray-900">바로가기</h2>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {QUICK_ACTIONS.map((action) => (
            <Button
              key={action.path}
              variant="outline"
              onClick={() => navigate(action.path)}
              className="h-16 flex-col"
            >
              <span className="text-2xl mb-1">{action.icon}</span>
              <span>{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}; 