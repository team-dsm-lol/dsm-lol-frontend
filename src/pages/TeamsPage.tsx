import React, { useState } from 'react';
import { useTeams, useMyTeam } from '@/hooks/useTeam';
import { useAvailableUsers } from '@/hooks/useUsers';
import { useSendRecruitRequest } from '@/hooks/useRecruit';
import { useAuthStatus } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { TierBadge } from '@/components/ui/TierBadge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { MAX_TEAM_SCORE } from '@/constants';

// 라인 이름 매핑 함수 추가
const getLaneName = (lane: string | undefined): string => {
  const laneMap: Record<string, string> = {
    'TOP': '탑',
    'JUNGLE': '정글',
    'MID': '미드',
    'ADC': '원딜',
    'SUPPORT': '서포터',
  };
  return lane ? laneMap[lane] || lane : '-';
};

export const TeamsPage: React.FC = () => {
  const { user } = useAuthStatus();
  const { data: teamsData, isLoading: teamsLoading } = useTeams();
  const { data: myTeam } = useMyTeam();
  const { data: availableUsers, isLoading: usersLoading } = useAvailableUsers();
  const sendRecruitMutation = useSendRecruitRequest();
  
  const [activeTab, setActiveTab] = useState<'teams' | 'players'>('teams');
  const [searchTerm, setSearchTerm] = useState('');

  const teams = teamsData?.teams || [];
  const users = availableUsers?.users || [];

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.summonerName && user.summonerName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleRecruit = async (userId: number, userName: string, userScore: number) => {
    // 팀 점수 제한 확인
    if (myTeam) {
      const currentTeamScore = myTeam.totalScore;
      const potentialNewScore = currentTeamScore + userScore;
      
      if (potentialNewScore > MAX_TEAM_SCORE) {
        alert(`팀 점수가 ${MAX_TEAM_SCORE}점을 초과할 수 없습니다.\n현재 팀 점수: ${currentTeamScore}점\n${userName}님 점수: ${userScore}점\n예상 총 점수: ${potentialNewScore}점`);
        return;
      }
    }

    if (window.confirm(`${userName}님에게 영입 요청을 보내시겠습니까?`)) {
      try {
        await sendRecruitMutation.mutateAsync({
          targetUserId: userId,
          message: `안녕하세요! 함께 리그에 참여하실래요?`,
        });
        alert('영입 요청을 보냈습니다.');
      } catch (error) {
        console.error('Recruit error:', error);
        alert('영입 요청 전송에 실패했습니다.');
      }
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* 헤더 */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-toss-gray-900 mb-2">
          팀 & 플레이어
        </h1>
        <p className="text-toss-gray-600">
          다른 팀들을 확인하고 플레이어를 영입해보세요
        </p>
      </div>

      {/* 탭 */}
      <div className="flex rounded-xl bg-toss-gray-100 p-1">
        <button
          onClick={() => setActiveTab('teams')}
          className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'teams'
              ? 'bg-white text-toss-blue shadow-sm'
              : 'text-toss-gray-600 hover:text-toss-gray-900'
          }`}
        >
          팀 목록
        </button>
        <button
          onClick={() => setActiveTab('players')}
          className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'players'
              ? 'bg-white text-toss-blue shadow-sm'
              : 'text-toss-gray-600 hover:text-toss-gray-900'
          }`}
        >
          플레이어
        </button>
      </div>

      {/* 검색 */}
      <Input
        placeholder={activeTab === 'teams' ? '팀 이름 검색...' : '플레이어 이름 검색...'}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* 콘텐츠 */}
      {activeTab === 'teams' ? (
        <div className="space-y-4">
          {teamsLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : filteredTeams.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-toss-gray-500">
                {searchTerm ? '검색 결과가 없습니다.' : '등록된 팀이 없습니다.'}
              </p>
            </div>
          ) : (
            filteredTeams.map((team) => (
              <Card key={team.id} hover>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-toss-gray-900">
                        {team.name}
                      </h3>
                      <p className="text-sm text-toss-gray-600">
                        팀장: {team.leader.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-toss-blue">
                        {team.totalScore}점
                      </p>
                      <p className="text-sm text-toss-gray-600">
                        {team.memberCount}/5명
                      </p>
                    </div>
                  </div>

                  {/* 팀원 목록 */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-toss-gray-700">팀원</h4>
                    <div className="grid gap-2">
                      {team.members.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between p-2 bg-toss-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-toss-gray-900">
                              {member.name}
                              {member.id === team.leader.id && (
                                <span className="ml-1 text-xs text-toss-blue">팀장</span>
                              )}
                            </span>
                            <span className="text-xs text-toss-gray-500">
                              {member.score}점
                            </span>
                          </div>
                          {member.tier && (
                            <TierBadge
                              tier={member.tier}
                              rank={member.rank}
                              leaguePoints={member.leaguePoints}
                              size="sm"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {usersLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-toss-gray-500">
                {searchTerm ? '검색 결과가 없습니다.' : '영입 가능한 플레이어가 없습니다.'}
              </p>
            </div>
          ) : (
            filteredUsers.map((player) => (
              <Card key={player.id}>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div>
                        <h3 className="text-lg font-medium text-toss-gray-900">
                          {player.name}
                        </h3>
                        <p className="text-sm text-toss-gray-600">
                          {player.summonerName || 'Riot 계정 미연동'}
                        </p>
                        <p className="text-sm text-toss-gray-600">
                          점수: {player.score}점
                        </p>
                        {(player.mostLane || player.secondLane) && (
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-sm text-toss-gray-600">라인:</span>
                            <div className="flex space-x-1">
                              {player.mostLane && (
                                <span className="px-2 py-1 bg-toss-blue bg-opacity-10 text-toss-blue text-xs rounded-md font-medium">
                                  {getLaneName(player.mostLane)}
                                </span>
                              )}
                              {player.secondLane && (
                                <span className="px-2 py-1 bg-toss-gray-100 text-toss-gray-700 text-xs rounded-md font-medium">
                                  {getLaneName(player.secondLane)}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {player.tier && (
                        <TierBadge
                          tier={player.tier}
                          rank={player.rank}
                          leaguePoints={player.leaguePoints}
                        />
                      )}
                      {user?.teamName && (
                        <Button
                          size="sm"
                          onClick={() => handleRecruit(player.id, player.name, player.score)}
                          loading={sendRecruitMutation.isPending}
                        >
                          영입
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}; 