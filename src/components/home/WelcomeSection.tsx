import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { TierBadge } from '@/components/ui/TierBadge';
import type { UserResponse } from '@/types/api';

interface WelcomeSectionProps {
  user: UserResponse;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({ user }) => {
  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-toss-gray-900 mb-2">
              환영합니다, {user.name}님! 👋
            </h1>
            <div className="flex items-center space-x-3">
              {user.tier && (
                <TierBadge
                  tier={user.tier}
                  rank={user.rank}
                  leaguePoints={user.leaguePoints}
                />
              )}
              <span className="text-toss-gray-600">
                점수: {user.score}점
              </span>
            </div>
          </div>
          <div className="text-4xl">🎮</div>
        </div>
      </CardContent>
    </Card>
  );
}; 