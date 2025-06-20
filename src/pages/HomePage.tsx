import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStatus } from '@/hooks/useAuth';
import { useMyTeam } from '@/hooks/useTeam';
import { useAvailableUsers } from '@/hooks/useUsers';
import { usePendingRequests } from '@/hooks/useRecruit';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { TierBadge } from '@/components/ui/TierBadge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { MyTeamSection } from '@/components/home/MyTeamSection';
import { AvailablePlayersSection } from '@/components/home/AvailablePlayersSection';
import { PendingRequestsSection } from '@/components/home/PendingRequestsSection';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStatus();
  const { data: myTeam, isLoading: teamLoading } = useMyTeam();
  const { data: availableUsers, isLoading: usersLoading } = useAvailableUsers();
  const { data: pendingRequests } = usePendingRequests();

  if (!user) {
    return <LoadingSpinner size="lg" />;
  }

  return (
    <div className="space-y-6 pb-20">
      {/* 환영 메시지 */}
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

      {/* 내 팀 정보 */}
      {teamLoading ? (
        <Card>
          <CardContent>
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          </CardContent>
        </Card>
      ) : myTeam ? (
        <MyTeamSection team={myTeam} />
      ) : (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-toss-gray-900">팀 생성</h2>
          </CardHeader>
          <CardContent>
            <p className="text-toss-gray-600 mb-4">
              아직 팀에 소속되지 않았습니다. 새로운 팀을 만들어보세요!
            </p>
            <Button onClick={() => navigate('/team/create')}>
              팀 만들기
            </Button>
          </CardContent>
        </Card>
      )}

      {/* 나에게 온 영입 요청 */}
      {pendingRequests && pendingRequests.requests.length > 0 && (
        <PendingRequestsSection requests={pendingRequests.requests} />
      )}

      {/* 영입 가능한 플레이어 (팀이 있고 영입 가능한 경우에만) */}
      {myTeam && myTeam.canRecruit && (
        <AvailablePlayersSection 
          users={availableUsers?.users || []} 
          isLoading={usersLoading}
        />
      )}

      {/* 퀵 액션 */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold text-toss-gray-900">바로가기</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/teams')}
              className="h-16 flex-col"
            >
              <span className="text-2xl mb-1">👥</span>
              <span>팀 목록</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/profile')}
              className="h-16 flex-col"
            >
              <span className="text-2xl mb-1">👤</span>
              <span>내 프로필</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 