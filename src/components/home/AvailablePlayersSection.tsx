import React from 'react';
import { useAvailableUsers } from '@/hooks/useUsers';
import { useSendRecruitRequest } from '@/hooks/useRecruit';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { TierBadge } from '@/components/ui/TierBadge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { MAX_DISPLAYED_USERS, MAX_PLAYERS_HEIGHT_CLASS } from '@/constants';

interface AvailablePlayersSectionProps {
  onRecruitSuccess?: () => void;
}

export const AvailablePlayersSection: React.FC<AvailablePlayersSectionProps> = ({
  onRecruitSuccess,
}) => {
  const { data: availableUsers, isLoading } = useAvailableUsers();
  const sendRecruitMutation = useSendRecruitRequest();

  const users = availableUsers?.users || [];

  const handleRecruit = async (userId: number, userName: string) => {
    if (window.confirm(`${userName}님에게 영입 요청을 보내시겠습니까?`)) {
      try {
        await sendRecruitMutation.mutateAsync({
          targetUserId: userId,
          message: `안녕하세요! 함께 리그에 참여하실래요?`,
        });
        alert('영입 요청을 보냈습니다.');
        onRecruitSuccess?.();
      } catch (error) {
        console.error('Recruit error:', error);
        alert('영입 요청 전송에 실패했습니다.');
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold text-toss-gray-900">
          영입 가능한 플레이어 🎯
        </h2>
        <p className="text-toss-gray-600">
          {users.length}명의 플레이어가 영입을 기다리고 있습니다
        </p>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8 text-toss-gray-500">
            현재 영입 가능한 플레이어가 없습니다.
          </div>
        ) : (
          <div className={`space-y-3 ${MAX_PLAYERS_HEIGHT_CLASS} overflow-y-auto`}>
            {users.slice(0, MAX_DISPLAYED_USERS).map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 bg-toss-gray-50 rounded-xl"
              >
                <div className="flex items-center space-x-3">
                  <div>
                    <div className="font-medium text-toss-gray-900">
                      {user.name}
                    </div>
                    <div className="text-sm text-toss-gray-600">
                      {user.summonerName || 'Riot 계정 미연동'}
                    </div>
                    <div className="text-sm text-toss-gray-600">
                      점수: {user.score}점
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {user.tier && (
                    <TierBadge
                      tier={user.tier}
                      rank={user.rank}
                      leaguePoints={user.leaguePoints}
                      size="sm"
                    />
                  )}
                  <Button
                    size="sm"
                    onClick={() => handleRecruit(user.id, user.name)}
                    loading={sendRecruitMutation.isPending}
                  >
                    영입
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 