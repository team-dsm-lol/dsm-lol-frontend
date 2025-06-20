import React from 'react';
import { useRespondToRecruitRequest } from '@/hooks/useRecruit';
import { useAuthStatus } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { TierBadge } from '@/components/ui/TierBadge';
import { MAX_TEAM_SCORE } from '@/constants';
import type { RecruitResponse } from '@/types/api';

interface PendingRequestsSectionProps {
  requests: RecruitResponse[];
}

export const PendingRequestsSection: React.FC<PendingRequestsSectionProps> = ({
  requests,
}) => {
  const { user } = useAuthStatus();
  const respondMutation = useRespondToRecruitRequest();

  const handleResponse = async (requestId: number, accept: boolean, teamName: string, teamScore: number) => {
    const action = accept ? '수락' : '거절';
    
    // 수락하는 경우 점수 제한 확인
    if (accept && user) {
      const potentialNewScore = teamScore + user.score;
      
      if (potentialNewScore > MAX_TEAM_SCORE) {
        alert(`팀 점수가 ${MAX_TEAM_SCORE}점을 초과할 수 없습니다.\n${teamName} 팀 점수: ${teamScore}점\n나의 점수: ${user.score}점\n예상 총 점수: ${potentialNewScore}점`);
        return;
      }
    }

    if (window.confirm(`${teamName} 팀의 영입 요청을 ${action}하시겠습니까?`)) {
      try {
        await respondMutation.mutateAsync({
          requestId,
          data: { accept },
        });
        alert(`영입 요청을 ${action}했습니다.`);
      } catch (error) {
        console.error('Respond error:', error);
        alert(`영입 요청 ${action}에 실패했습니다.`);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold text-toss-gray-900">
          영입 요청 📩
        </h2>
        <p className="text-toss-gray-600">
          {requests.length}개의 팀에서 영입 요청을 보냈습니다
        </p>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {requests.map((request) => (
            <div
              key={request.id}
              className="p-4 bg-toss-blue-light border border-toss-blue/20 rounded-xl"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-medium text-toss-gray-900">
                    {request.team.name}
                  </div>
                  <div className="text-sm text-toss-gray-600">
                    팀장: {request.requester.name}
                  </div>
                  <div className="text-sm text-toss-gray-600">
                    팀 점수: {request.team.totalScore}점 · {request.team.memberCount}/5명
                  </div>
                </div>
                {request.requester.tier && (
                  <TierBadge
                    tier={request.requester.tier}
                    rank={request.requester.rank}
                    leaguePoints={request.requester.leaguePoints}
                    size="sm"
                  />
                )}
              </div>

              {request.message && (
                <div className="mb-3 p-2 bg-white rounded-lg text-sm text-toss-gray-700">
                  "{request.message}"
                </div>
              )}

              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => handleResponse(request.id, true, request.team.name, request.team.totalScore)}
                  loading={respondMutation.isPending}
                  className="bg-toss-green hover:bg-green-600"
                >
                  수락
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleResponse(request.id, false, request.team.name, request.team.totalScore)}
                  loading={respondMutation.isPending}
                  className="text-toss-red border-toss-red hover:bg-red-50"
                >
                  거절
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}; 