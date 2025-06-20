import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStatus } from '@/hooks/useAuth';
import { useLeaveTeam, useKickMember } from '@/hooks/useTeam';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { TierBadge } from '@/components/ui/TierBadge';
import type { TeamResponse } from '@/types/api';

interface MyTeamSectionProps {
  team: TeamResponse;
}

export const MyTeamSection: React.FC<MyTeamSectionProps> = ({ team }) => {
  const navigate = useNavigate();
  const { user } = useAuthStatus();
  const leaveTeamMutation = useLeaveTeam();
  const kickMemberMutation = useKickMember();

  const handleLeaveTeam = async () => {
    if (window.confirm('정말로 팀을 탈퇴하시겠습니까?')) {
      try {
        await leaveTeamMutation.mutateAsync();
      } catch (error) {
        console.error('Leave team error:', error);
      }
    }
  };

  const handleKickMember = async (userId: number, userName: string) => {
    if (window.confirm(`${userName}님을 팀에서 강퇴하시겠습니까?`)) {
      try {
        await kickMemberMutation.mutateAsync(userId);
      } catch (error) {
        console.error('Kick member error:', error);
      }
    }
  };

  const isLeader = user?.id === team.leader.id;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-toss-gray-900">
              내 팀: {team.name}
            </h2>
            <p className="text-toss-gray-600">
              총 점수: {team.totalScore}점 · {team.memberCount}/5명
            </p>
          </div>
          <div className="flex space-x-2">
            {isLeader && (
              <span className="px-2 py-1 bg-toss-blue text-white text-xs rounded-lg">
                팀장
              </span>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* 팀원 목록 */}
          <div className="space-y-3">
            {team.members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 bg-toss-gray-50 rounded-xl"
              >
                <div className="flex items-center space-x-3">
                  <div>
                    <div className="font-medium text-toss-gray-900">
                      {member.name}
                      {member.id === team.leader.id && (
                        <span className="ml-2 text-xs text-toss-blue">팀장</span>
                      )}
                    </div>
                    <div className="text-sm text-toss-gray-600">
                      {member.summonerName || 'Riot 계정 미연동'}
                    </div>
                    <div className="text-sm text-toss-gray-600">
                      점수: {member.score}점
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {member.tier && (
                    <TierBadge
                      tier={member.tier}
                      rank={member.rank}
                      leaguePoints={member.leaguePoints}
                      size="sm"
                    />
                  )}
                  {isLeader && member.id !== team.leader.id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleKickMember(member.id, member.name)}
                      loading={kickMemberMutation.isPending}
                      className="text-toss-red hover:bg-red-50"
                    >
                      강퇴
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 팀 액션 */}
          <div className="flex space-x-2 pt-4 border-t border-toss-gray-200">
            {!isLeader && (
              <Button
                variant="outline"
                onClick={handleLeaveTeam}
                loading={leaveTeamMutation.isPending}
                className="text-toss-red border-toss-red hover:bg-red-50"
              >
                팀 탈퇴
              </Button>
            )}
            {team.canRecruit && (
              <Button
                variant="secondary"
                onClick={() => navigate('/teams')}
              >
                팀원 영입하기
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 