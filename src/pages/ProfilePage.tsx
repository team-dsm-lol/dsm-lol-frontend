import React from 'react';
import { useAuthStatus } from '@/hooks/useAuth';
import { useMyTeam } from '@/hooks/useTeam';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { TierBadge } from '@/components/ui/TierBadge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export const ProfilePage: React.FC = () => {
  const { user, isLoading: userLoading } = useAuthStatus();
  const { data: myTeam, isLoading: teamLoading } = useMyTeam();

  if (userLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-toss-gray-500">사용자 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* 기본 정보 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-toss-gray-900">내 프로필</h1>
            <div className="text-3xl">👤</div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-toss-gray-600 mb-1">
                  이름
                </label>
                <p className="text-lg font-medium text-toss-gray-900">{user.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-toss-gray-600 mb-1">
                  계정 아이디
                </label>
                <p className="text-lg font-medium text-toss-gray-900">{user.accountId}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-toss-gray-600 mb-1">
                  학년
                </label>
                <p className="text-lg font-medium text-toss-gray-900">{user.grade}학년</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-toss-gray-600 mb-1">
                  반
                </label>
                <p className="text-lg font-medium text-toss-gray-900">{user.classNum}반</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-toss-gray-600 mb-1">
                  번호
                </label>
                <p className="text-lg font-medium text-toss-gray-900">{user.num}번</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-toss-gray-600 mb-1">
                역할
              </label>
              <p className="text-lg font-medium text-toss-gray-900">
                {user.userRole === 'STU' ? '학생' : 
                 user.userRole === 'SCH' ? '교직원' : '기숙사'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 게임 정보 */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold text-toss-gray-900">게임 정보</h2>
        </CardHeader>

        <CardContent>
          {user.summonerName ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-toss-gray-600 mb-1">
                  소환사명
                </label>
                <p className="text-lg font-medium text-toss-gray-900">{user.summonerName}</p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-toss-gray-600 mb-1">
                    티어
                  </label>
                  {user.tier ? (
                    <TierBadge
                      tier={user.tier}
                      rank={user.rank}
                      leaguePoints={user.leaguePoints}
                    />
                  ) : (
                    <p className="text-toss-gray-500">티어 정보 없음</p>
                  )}
                </div>
                <div className="text-right">
                  <label className="block text-sm font-medium text-toss-gray-600 mb-1">
                    점수
                  </label>
                  <p className="text-2xl font-bold text-toss-blue">{user.score}점</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-toss-gray-500 mb-2">Riot 계정이 연동되지 않았습니다</p>
              <p className="text-sm text-toss-gray-400">설정에서 계정을 연동해주세요</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 팀 정보 */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold text-toss-gray-900">팀 정보</h2>
        </CardHeader>

        <CardContent>
          {teamLoading ? (
            <div className="flex justify-center py-4">
              <LoadingSpinner />
            </div>
          ) : myTeam ? (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-toss-gray-600 mb-1">
                  팀명
                </label>
                <p className="text-lg font-medium text-toss-gray-900">{myTeam.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-toss-gray-600 mb-1">
                    역할
                  </label>
                  <p className="text-lg font-medium text-toss-gray-900">
                    {user.isTeamLeader ? '팀장' : '팀원'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-toss-gray-600 mb-1">
                    팀 점수
                  </label>
                  <p className="text-lg font-medium text-toss-gray-900">
                    {myTeam.totalScore}점
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-toss-gray-600 mb-1">
                  팀원 수
                </label>
                <p className="text-lg font-medium text-toss-gray-900">
                  {myTeam.memberCount}/5명
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-toss-gray-500">소속된 팀이 없습니다</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 