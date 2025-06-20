import React from 'react';
import { Users, Crown, Calendar, Star } from 'lucide-react';
import type { TeamResponse } from '@/types/api';
import { 
  getTierColor, 
  getTierBgColor, 
  formatTierRank, 
  formatUserName,
  getScoreColor,
  formatDateShort
} from '@/lib/utils';

interface TeamCardProps {
  team: TeamResponse;
  showJoinButton?: boolean;
  onJoin?: (teamId: number) => void;
  isJoining?: boolean;
}

const TeamCard: React.FC<TeamCardProps> = ({
  team,
  showJoinButton = false,
  onJoin,
  isJoining = false
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {team.memberCount}/5
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 mb-2">
            <Crown className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-gray-600">
              팀장: {formatUserName(team.leader.grade, team.leader.classNum, team.leader.num, team.leader.name)}
            </span>
          </div>
          
          <div className="flex items-center space-x-4 mb-3">
            <span className={`text-sm font-medium ${getScoreColor(team.totalScore)}`}>
              총 점수: {team.totalScore}점
            </span>
            
            {team.leader.tier && (
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTierBgColor(team.leader.tier)} ${getTierColor(team.leader.tier)}`}>
                <Star className="w-3 h-3 mr-1" />
                팀장 {formatTierRank(team.leader.tier, team.leader.rank)}
              </div>
            )}
          </div>
          
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="w-3 h-3 mr-1" />
            생성일: {formatDateShort(team.createdAt)}
          </div>
        </div>
        
        <div className="ml-4">
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            team.canRecruit 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {team.canRecruit ? '모집중' : '모집완료'}
          </div>
        </div>
      </div>
      
      {/* 팀원 목록 */}
      <div className="border-t pt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">팀원</h4>
        <div className="grid grid-cols-1 gap-2">
          {team.members.map((member) => (
            <div key={member.id} className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-gray-900">
                  {formatUserName(member.grade, member.classNum, member.num, member.name)}
                </span>
                {member.isTeamLeader && (
                  <Crown className="w-3 h-3 text-yellow-500" />
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                {member.tier && (
                  <span className={`text-xs ${getTierColor(member.tier)}`}>
                    {formatTierRank(member.tier, member.rank)}
                  </span>
                )}
                <span className={`text-xs font-medium ${getScoreColor(member.score)}`}>
                  {member.score}점
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 가입 버튼 (필요한 경우) */}
      {showJoinButton && team.canRecruit && onJoin && (
        <div className="mt-4 pt-4 border-t">
          <button
            onClick={() => onJoin(team.id)}
            disabled={isJoining}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isJoining ? '가입 요청 중...' : '팀 가입 요청'}
          </button>
        </div>
      )}
    </div>
  );
};

export default TeamCard; 